import { CreatePlug, getLang } from '../lib/index';
import axios from 'axios';

CreatePlug({
    command: ['ytmp3', 'mp3'],
    category: 'download',
    desc: 'Download audio',
    fromMe: false,
    execute: async (message: any, conn: any, match: string): Promise<void> => {
        const msgs = getLang();
        if (!match) return void (await message.reply(msgs.ytmp3_msg);
        await message.reply(msgs.audio_wait);
        const { data } = await axios.get(`https://tshepang.vercel.app/download?url=${match}`);
        if (!data.audio?.['128']) {
        return void (await message.reply(msgs.error_msg));}
        await conn.sendMessage(message.user, {
            audio: { url: data.audio['128'] },
            mimetype: 'audio/mpeg',
            ptt: false
        }, {
            quoted: message,  
            contextInfo: {
                externalAdReply: {
                    title: data.title,
                    body: 'AquaSeek',
                    thumbnailUrl: data.thumbnail,
                    mediaType: 1,
                    mediaUrl: data.youtube_url,
                    sourceUrl: data.youtube_url
                }
            }
        });
    },
});
          
