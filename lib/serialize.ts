import { proto, getContentType, jidNormalizerUser } from '@whiskeysockets/baileys';
import { getMessage } from './Base/Message';
import { downloadMedia } from './Base/tMedia';

export const serialize = (m: proto.IWebMessageInfo, conn: any): getMessage => {
    const msg = m as getMessage;
    if (msg.key) {
        msg.id = msg.key.id!;
        msg.isSelf = !!msg.key.fromMe;
        msg.user = jidNormalizerUser(msg.key.remoteJid!);
        msg.isGroup = msg.user.endsWith('@g.us');
        msg.sender = msg.isGroup
            ? jidNormalizerUser(msg.key.participant!)
            : msg.isSelf
            ? jidNormalizerUser(conn.user.id)
            : msg.user;
    }

    if (msg.message) {
        msg.type = getContentType(msg.message);
        if (msg.type === 'ephemeralMessage') {
            msg.message = msg.message.ephemeralMessage!.message;
            msg.type = Object.keys(msg.message || {})[0];
            if (msg.type === 'viewOnceMessageV2') {
                msg.message = msg.message.viewOnceMessageV2?.message;
                msg.type = getContentType(msg.message);
            }
        }

        if (msg.type === 'viewOnceMessageV2') {
            msg.message = msg.message.viewOnceMessageV2?.message;
            msg.type = getContentType(msg.message);
        }

        msg.messageTypes = (type: string) => ['videoMessage', 'imageMessage'].includes(type);
        try {
            const quoted = msg.message?.[msg.type!]?.contextInfo;
            if (quoted?.quotedMessage?.ephemeralMessage) {
                const quotedType = Object.keys(quoted.quotedMessage.ephemeralMessage.message)[0];
                if (quotedType === 'viewOnceMessageV2') {
                    msg.quoted = {
                        type: 'view_once',
                        stanzaId: quoted.stanzaId!,
                        participant: jidNormalizerUser(quoted.participant!),
                        message: quoted.quotedMessage.ephemeralMessage.message.viewOnceMessage.message
                    };
                } else {
                    msg.quoted = {
                        type: 'ephemeral',
                        stanzaId: quoted.stanzaId!,
                        participant: jidNormalizerUser(quoted.participant!),
                        message: quoted.quotedMessage.ephemeralMessage.message
                    };
                }
            } else if (quoted?.quotedMessage?.viewOnceMessageV2) {
                msg.quoted = {
                    type: 'view_once',
                    stanzaId: quoted.stanzaId!,
                    participant: jidNormalizerUser(quoted.participant!),
                    message: quoted.quotedMessage.viewOnceMessage.message
                };
            } else if (quoted?.quotedMessage) {
                msg.quoted = {
                    type: 'normal',
                    stanzaId: quoted.stanzaId!,
                    participant: jidNormalizerUser(quoted.participant!),
                    message: quoted.quotedMessage
                };
            }

            if (msg.quoted) {
                msg.quoted.isSelf = msg.quoted.participant === jidNormalizerUser(conn.user.id);
                msg.quoted.mtype = Object.keys(msg.quoted.message).find(
                    (v) => v.includes('Message') || v.includes('conversation')
                ) || '';
                msg.quoted.text =
                    msg.quoted.message?.[msg.quoted.mtype!]?.text ||
                    msg.quoted.message?.[msg.quoted.mtype!]?.description ||
                    msg.quoted.message?.[msg.quoted.mtype!]?.caption ||
                    msg.quoted.message?.[msg.quoted.mtype!]?.hydratedTemplate?.hydratedContentText ||
                    msg.quoted.message?.[msg.quoted.mtype!] ||
                    '';
                msg.quoted.key = {
                    id: msg.quoted.stanzaId,
                    fromMe: msg.quoted.isSelf,
                    remoteJid: msg.user!
                };

                msg.quoted.download = () => downloadMedia(msg.quoted!.message);
            }
        } catch {
            msg.quoted = null;
        }

        msg.body =
            msg.message?.conversation ||
            msg.message?.[msg.type!]?.text ||
            msg.message?.[msg.type!]?.caption ||
            (msg.type === 'listResponseMessage' && msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId) ||
            (msg.type === 'buttonsResponseMessage' && msg.message?.buttonsResponseMessage?.selectedButtonId) ||
            (msg.type === 'templateButtonReplyMessage' && msg.message?.templateButtonReplyMessage?.selectedId) ||
            '';

        msg.reply = async (text: string) => {
            await conn.sendMessage(msg.user!,{ text },{ quoted: msg });
        };

        msg.react = async (emoji: string) => {
                await conn.sendMessage(msg.user, { react: { text: emoji, key: msg.key } });
         }};

        msg.mentions = [];
        if (msg.quoted?.participant) {
            msg.mentions.push(msg.quoted.participant);
        }
        const mentionedJid = msg.message?.[msg.type!]?.contextInfo?.mentionedJid || [];
        msg.mentions.push(...mentionedJid.filter(Boolean));
        msg.download = () => downloadMedia(msg.message!);
    }

    return msg;
};
  
