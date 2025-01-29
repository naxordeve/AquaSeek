const { 
    proto, 
    getContentType, 
    jidNormalizedUser, 
    downloadContentFromMessage,
    generateWAMessageContent, 
    extractMessageContent, 
    normalizeMessageContent 
} = require('@whiskeysockets/baileys');

const gc_object = {};
const downloadMedia = async (_msg) => {
    let type = Object.keys(_msg)[0];
    let media = _msg[type];
    if (type === 'buttonsMessage' || type === 'viewOnceMessageV2') {
        if (type === 'viewOnceMessageV2') {
            media = _msg.viewOnceMessageV2?.message;
            type = Object.keys(media || {})[0];
        } else {
            type = Object.keys(media || {})[1];
        }
        media = media[type];
    }
    const stream = await downloadContentFromMessage(media, type.replace('Message', ''));
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
};

const fetchGroupAdmins = async (jid, conn) => {
    if (gc_object[jid] && gc_object[jid].expiry > Date.now()) {
        return gc_object[jid].admins;
    }
    try {
        const groupMetadata = await conn.groupMetadata(jid);
        const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
        gc_object[jid] = {
            admins,
            expiry: Date.now() + 5 * 60 * 1000,
        };
        return admins;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const serialize = async (_msg, conn) => {
    if (_msg.key) {
        _msg.id = _msg.key.id;
        _msg.isFromMe = _msg.key.fromMe;
        _msg.user = jidNormalizedUser(_msg.key.remoteJid);
        _msg.isGroup = _msg.user && _msg.user.endsWith('@g.us');
        _msg.device = /^3A/.test(_msg.id)
            ? 'ios'
            : /^3EB/.test(_msg.id)
            ? 'web'
            : /^.{21}/.test(_msg.id)
            ? 'android'
            : /^.{18}/.test(_msg.id)
            ? 'desktop'
            : 'unknown';
        _msg.fromBot = _msg.isBaileys = _msg.id.startsWith('BAE5') && _msg.id.length === 16;
        _msg.sender = _msg.isGroup ? jidNormalizedUser(_msg.key.participant) : _msg.isFromMe ? jidNormalizedUser(conn.user.id) : _msg.user;
        _msg.isOwner = conn.user.id.includes(':') ? conn.user.id.split(':')[0]+'@s.whatsapp.net' : conn.user.id;
    }

    if (_msg.isGroup) {
        _msg.admins = await fetchGroupAdmins(_msg.user, conn);
        try {
            const groupMetadata = await conn.groupMetadata(_msg.user);
            _msg.isAdmin = groupMetadata.participants.some(p => p.id === _msg.sender && p.admin);
            _msg.isBotAdmin = groupMetadata.participants.some(p => p.id === jidNormalizedUser(conn.user.id) && p.admin);
        } catch (error) {
            _msg.isAdmin = false;
            _msg.isBotAdmin = false;
        }
    }

    if (_msg.message) {
        _msg.type = getContentType(_msg.message);
        if (_msg.type === 'ephemeralMessage') {
            _msg.message = _msg.message[_msg.type].message;
            const type = Object.keys(_msg.message)[0];
            _msg.type = type;
            if (type === 'viewOnceMessageV2') {
                _msg.message = _msg.message[_msg.type].message;
                _msg.type = getContentType(_msg.message);
            }
        }
        if (_msg.type === 'viewOnceMessageV2') {
            _msg.message = _msg.message[_msg.type].message;
            _msg.type = getContentType(_msg.message);
        }
        _msg.messageTypes = (type) => ['videoMessage', 'imageMessage'].includes(type);
        try {
            const quoted = _msg.message[_msg.type]?.contextInfo;
            if (quoted?.quotedMessage['ephemeralMessage']) {
                const type = Object.keys(quoted.quotedMessage.ephemeralMessage.message)[0];
                _msg.quoted = type === 'viewOnceMessageV2'
                    ? {
                        type: 'view_once',
                        stanzaId: quoted.stanzaId,
                        participant: jidNormalizedUser(quoted.participant),
                        message: quoted.quotedMessage.ephemeralMessage.message.viewOnceMessage.message,
                    }
                    : {
                        type: 'ephemeral',
                        stanzaId: quoted.stanzaId,
                        participant: jidNormalizedUser(quoted.participant),
                        message: quoted.quotedMessage.ephemeralMessage.message,
                    };
            } else if (quoted?.quotedMessage['viewOnceMessageV2']) {
                _msg.quoted = {
                    type: 'view_once',
                    stanzaId: quoted.stanzaId,
                    participant: jidNormalizedUser(quoted.participant),
                    message: quoted.quotedMessage.viewOnceMessage.message,
                };
            } else {
                _msg.quoted = {
                    type: 'normal',
                    stanzaId: quoted.stanzaId,
                    participant: jidNormalizedUser(quoted.participant),
                    message: quoted.quotedMessage,
                };
            }

            if (_msg.quoted) {
                _msg.quoted.isFromMe = _msg.quoted.participant === jidNormalizedUser(conn.user.id);
                _msg.quoted.fromBot = _msg.quoted.isBaileys = _msg.quoted.id ? _msg.quoted.id.startsWith('BAE5') && _msg.quoted.id.length === 16 : false;
                _msg.quoted.mtype = Object.keys(_msg.quoted.message).find(v => v.includes('Message') || v.includes('conversation'));
                _msg.quoted.text =
                    _msg.quoted.message[_msg.quoted.mtype]?.text ||
                    _msg.quoted.message[_msg.quoted.mtype]?.description ||
                    _msg.quoted.message[_msg.quoted.mtype]?.caption ||
                    _msg.quoted.message[_msg.quoted.mtype]?.hydratedTemplate?.hydratedContentText ||
                    _msg.quoted.message[_msg.quoted.mtype] ||
                    '';
                _msg.quoted.key = {
                    id: _msg.quoted.stanzaId,
                    fromMe: _msg.quoted.isFromMe,
                    remoteJid: _msg.user,
                };
                _msg.quoted.download = () => downloadMedia(_msg.quoted.message);
            }
        } catch (error) {
            _msg.quoted = null;
        }

        _msg.body =
            _msg.message?.conversation ||
            _msg.message?.[_msg.type]?.text ||
            _msg.message?.[_msg.type]?.caption ||
            (_msg.type === 'listResponseMessage' && _msg.message?.[_msg.type]?.singleSelectReply?.selectedRowId) ||
            (_msg.type === 'buttonsResponseMessage' && _msg.message?.[_msg.type]?.selectedButtonId) ||
            (_msg.type === 'templateButtonReplyMessage' && _msg.message?.[_msg.type]?.selectedId) ||
            '';

        _msg.reply = (text) => conn.sendMessage(_msg.user, { text }, { quoted: _msg });
        _msg.mentions = [];
        if (_msg.quoted?.participant) _msg.mentions.push(_msg.quoted.participant);
        const mentionedJids = _msg?.message?.[_msg.type]?.contextInfo?.mentionedJid || [];
        _msg.mentions.push(...mentionedJids.filter(Boolean));
        _msg.download = () => downloadMedia(_msg.message);
    }
    _msg.react = async (emoji) => {
        try {
            await conn.sendMessage(_msg.user, { react: { text: emoji, key: _msg.key } });
        } catch (error) {}
    };

    _msg.generateWAMessageContent = (_msgData) => generateWAMessageContent(_msgData, _msg.type);
    _msg.extractMessageContent = () => extractMessageContent(_msg.message);
    _msg.normalizeMessageContent = () => normalizeMessageContent(_msg.message);
    return _msg;
};

module.exports = { serialize };
