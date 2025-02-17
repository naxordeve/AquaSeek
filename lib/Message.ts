import { 
    proto, 
    getContentType, 
    jidNormalizedUser, 
    downloadContentFromMessage,
    generateWAMessageContent, 
    generateWAMessageFromContent,
    extractMessageContent, 
    normalizeMessageContent 
} from '@whiskeysockets/baileys';

const gc_object: { [key: string]: { admins: string[], expiry: number } } = {};

interface Message {
    key: { id: string, fromMe: boolean, remoteJid: string, participant?: string };
    message?: proto.Message;
    type?: string;
    user?: string;
    isFromMe?: boolean;
    isGroup?: boolean;
    isBaileys?: boolean;
    fromBot?: boolean;
    sender?: string;
    admins?: string[];
    isAdmin?: boolean;
    isBotAdmin?: boolean;
    quoted?: { 
        type: string;
        stanzaId: string;
        participant: string;
        message: proto.Message;
        isFromMe?: boolean;
        fromBot?: boolean;
        mtype?: string;
        text?: string;
        key: { id: string, fromMe: boolean, remoteJid: string };
        download: () => Promise<Buffer | null>;
    };
    body?: string;
    reply: (text: string) => void;
    mentions?: string[];
    download: () => Promise<Buffer | null>;
    react: (emoji: string) => Promise<void>;
}

const downloadMedia = async (_msg: Message): Promise<Buffer | null> => {
    try {
        let type = Object.keys(_msg || {})[0];
        let media = _msg?.[type];
        if (type === 'buttonsMessage' || type === 'viewOnceMessageV2') {
            media = _msg.viewOnceMessageV2?.message || media;
            type = Object.keys(media || {})[0];
            media = media?.[type];
        }

        if (!media) throw new Error('No media found to download');
        const stream = await downloadContentFromMessage(media, type.replace('Message', ''));
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const fetchGroupAdmins = async (jid: string, conn: any): Promise<string[]> => {
    if (gc_object[jid] && gc_object[jid].expiry > Date.now()) {
        return gc_object[jid].admins;
    }

    try {
        const groupMetadata = await conn.groupMetadata(jid);
        const admins = (groupMetadata?.participants || [])
            .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
            .map(p => p.id);

        gc_object[jid] = { admins, expiry: Date.now() + 5 * 60 * 1000 };
        return admins;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const serialize = async (_msg: Message, conn: any): Promise<Message> => {
    try {
        if (_msg?.key) {
            _msg.id = _msg.key.id;
            _msg.isFromMe = Boolean(_msg.key.fromMe);
            _msg.user = jidNormalizedUser(_msg.key.remoteJid);
            _msg.isGroup = _msg.user?.endsWith('@g.us');
            _msg.isBaileys = _msg.id.startsWith('BAE5') && _msg.id.length === 16;
            _msg.fromBot = _msg.isBaileys;
            _msg.sender = _msg.isGroup
                ? jidNormalizedUser(_msg.key.participant)
                : (_msg.isFromMe
                    ? jidNormalizedUser(conn.user.id)
                    : _msg.user);
        }

        if (_msg.isGroup) {
            _msg.admins = await fetchGroupAdmins(_msg.user, conn);
            try {
                const groupMetadata = await conn.groupMetadata(_msg.user);
                _msg.isAdmin = groupMetadata.participants.some(p => 
                    p.id === _msg.sender && (p.admin === 'admin' || p.admin === 'superadmin')
                );
                _msg.isBotAdmin = groupMetadata.participants.some(p => 
                    p.id === jidNormalizedUser(conn.user.id) && (p.admin === 'admin' || p.admin === 'superadmin')
                );
            } catch (error) {
                console.error(error);
                _msg.isAdmin = false;
                _msg.isBotAdmin = false;
            }
        }

        if (_msg.message) {
            _msg.type = getContentType(_msg.message);
            while (_msg.type === 'ephemeralMessage' || _msg.type === 'viewOnceMessageV2') {
                _msg.message = _msg.message?.[_msg.type]?.message;
                _msg.type = getContentType(_msg.message);
            }

            try {
                const quoted = _msg.message?.[_msg.type]?.contextInfo?.quotedMessage;
                if (quoted?.ephemeralMessage) {
                    const quotedType = Object.keys(quoted.ephemeralMessage.message)[0];
                    _msg.quoted = {
                        type: quotedType === 'viewOnceMessageV2' ? 'view_once' : 'ephemeral',
                        stanzaId: quoted.stanzaId,
                        participant: jidNormalizedUser(quoted.participant),
                        message: quoted.ephemeralMessage.message?.viewOnceMessage?.message || quoted.ephemeralMessage.message,
                    };
                } else if (quoted?.viewOnceMessageV2) {
                    _msg.quoted = {
                        type: 'view_once',
                        stanzaId: quoted.stanzaId,
                        participant: jidNormalizedUser(quoted.participant),
                        message: quoted.viewOnceMessageV2.message,
                    };
                } else if (quoted) {
                    _msg.quoted = {
                        type: 'normal',
                        stanzaId: quoted.stanzaId,
                        participant: jidNormalizedUser(quoted.participant),
                        message: quoted,
                    };
                }

                if (_msg.quoted) {
                    _msg.quoted.isFromMe = _msg.quoted.participant === jidNormalizedUser(conn.user.id);
                    _msg.quoted.fromBot = _msg.quoted.isBaileys = _msg.quoted.id?.startsWith('BAE5') && _msg.quoted.id.length === 16;
                    _msg.quoted.mtype = Object.keys(_msg.quoted.message || {}).find(v => v.includes('Message') || v.includes('conversation')) || 'unknown';
                    _msg.quoted.text = _msg.quoted.message?.[_msg.quoted.mtype]?.text || 
                                       _msg.quoted.message?.[_msg.quoted.mtype]?.description ||
                                       _msg.quoted.message?.[_msg.quoted.mtype]?.caption || 
                                       _msg.quoted.message?.[_msg.quoted.mtype] || '';

                    _msg.quoted.key = {
                        id: _msg.quoted.stanzaId,
                        fromMe: _msg.quoted.isFromMe,
                        remoteJid: _msg.user,
                    };
                    _msg.quoted.download = () => downloadMedia(_msg.quoted.message);
                }
            } catch (error) {
                console.error(error);
                _msg.quoted = null;
            }

            _msg.body = _msg.message?.conversation ||
                        _msg.message?.[_msg.type]?.text ||
                        _msg.message?.[_msg.type]?.caption ||
                        (_msg.type === 'listResponseMessage' && _msg.message?.[_msg.type]?.singleSelectReply?.selectedRowId) ||
                        (_msg.type === 'buttonsResponseMessage' && _msg.message?.[_msg.type]?.selectedButtonId) ||
                        (_msg.type === 'templateButtonReplyMessage' && _msg.message?.[_msg.type]?.selectedId) ||
                        '';
            _msg.reply = (text: string) => conn.sendMessage(_msg.user, { text }, { quoted: _msg });
            _msg.mentions = (_msg.quoted?.participant ? [_msg.quoted.participant] : []).concat(
                _msg.message?.[_msg.type]?.contextInfo?.mentionedJid || []
            );

            _msg.download = () => downloadMedia(_msg.message);
        }
        
        _msg.react = async (emoji: string) => {
            try {
                await conn.sendMessage(_msg.user, { react: { text: emoji, key: _msg.key } });
            } catch (error) {
                console.error(error);
            }
        };

        return _msg;
    } catch (error) {
        console.error(error);
        return _msg;
    }
};

export { serialize };
    
