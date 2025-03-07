import { CreatePlug, getLang, monospace } from '../lib/index';
import axios from 'axios';
import { YouTubeSearch } from 'youtube-search-api';

CreatePlug({
    command: 'yts',
    category: 'search',
    desc: 'Search YouTube videos',
    execute: async (message: any, conn: any, match: string): Promise<void> => {
        const msgs = getLang();
        if (!match) return void (await message.reply(msgs.query_msg));
        const p = await YouTubeSearch.GetListByKeyword(match, false, 18);
        if (!p.items || p.items.length === 0) return void (await message.reply(msgs.notfound));
        let q = '乂  *Y T - S E A R C H*\n\n';
        for (let i = 0; i < p.items.length; i++) {
            const video = p.items[i];
            q += `*${i + 1}.* ${monospace(video.title)}\n`;
            q += `↳ https://www.youtube.com/watch?v=${video.id}\n`;
        }

        const vi = p.items[0];
        await conn.sendMessage(message.user, {
            image: { url: vi.thumbnails[0].url },
            caption: q.trim()
        }, {
            quoted: message
        });
    },
});

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
          
