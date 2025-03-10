import { CreatePlug, getLang, monospace } from '../lib/index';
import axios from 'axios';
import { YouTubeSearch } from 'youtube-search-api';


CreatePlug({
    command: "ytmp4",
    category: "download",
    desc: "Download YouTube MP4",
    execute: async (message: any, conn: any, match: string): Promise<void> => {
        const msgs = getLang();
        if (!match) return void (await message.reply(msgs.ytmp4_msg));
        const velyn_api = `https://velyn.vercel.app/api/downloader/ytmp4v2?url=${match}`;
        const get = await axios.get(velyn_api);
        const data = get.data;
        const video_info = data?.data?.basicInfo ?? null;
        const vid = data?.data?.advancedInfo?.videoMp4 ?? null;
        if (!video_info || !vid) return void (await message.reply(msgs.error_msg));
        const caption = `*${monospace("Title:")}* ${video_info.title}\n*${monospace("Author:"}* ${video_info.author?.name ?? "aquaseek"}\n*${monospace("Duration:")}* ${video_info.duration}\n*${monospace("Views:")}* ${video_info.views}`;
        await conn.sendMessage(message.user, {video: { url: vid },
            caption,
            jpegThumbnail: await getBuffer(video_info.thumbnail),
        });
    },
});

async function getBuffer(url: string): Promise<Buffer> {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(res.data, "binary");
}

CreatePlug({
    command: 'play',
    category: 'download',
    desc: 'Search and download YouTube MP3',
    execute: async (message: any, conn: any, match: string): Promise<void> => {
        const msgs = getLang();
        if (!match) return void (await message.reply(msgs.ytdl_msg));
        const getSearch = await YouTubeSearch.GetListByKeyword(match, false, 1);
        if (!getSearch.items || getSearch.items.length === 0) return void (await message.reply(msgs.notfound_msg));
        const ytdl = getSeearch.items[0]; 
        const _id = `https://www.youtube.com/watch?v=${video.id}`;
        const thumbnail = ytdl.thumbnails[0].url;
        const { data } = await axios.get(`https://diegoson-naxordeve.hf.space/youtube?url=${_id}&format=mp3`);
        if (!data.url) return void (await message.reply(msgs.error_msg));
        await conn.sendMessage(message.user, {audio: { url: data.url },mimetype: 'audio/mpeg',fileName: `${ytdl.title}.mp3`,ptt: false,
            contextInfo: {
                externalAdReply: {
                    title: ytdl.title,
                    body: 'AquaSeek',
                    thumbnailUrl: thumbnail,
                    sourceUrl: _id,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, {
            quoted: message
        });
    },
});


CreatePlug({
    command: 'yts',
    category: 'search',
    desc: 'Search YouTube videos',
    execute: async (message: any, conn: any, match: string): Promise<void> => {
        const msgs = getLang();
        if (!match) return void (await message.reply(msgs.query_msg));
        const p = await YouTubeSearch.GetListByKeyword(match, false, 18);
        if (!p.items || p.items.length === 0) return void (await message.reply(msgs.notfound_msg));
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
          
