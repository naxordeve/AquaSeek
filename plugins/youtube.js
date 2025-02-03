const { CreatePlug } = require('../lib/commands');
const YouTubePlay = require('./functions/play');
var YTDown = require('./functions/YTDown');
var YTVideo = require('./functions/YTVid');

CreatePlug({
  command: "ytmp4",
  category: "download",
  desc: "Download YouTube videos as MP4",
  execute: async (message, conn, match) => {
    await message.react("✅");
    if (!match) return message.reply("_Provide a YouTube URL_");
    try { const db = new YTVideo("https://api.diioffc.web.id/api/download/ytmp4?url=");
      const voidi = await db.getVideo(match);
      await conn.sendMessage(message.user, {
        video: { url: voidi.downloadUrl },
        mimetype: "video/mp4",
        fileName: voidi.filename,
        caption: `*Title:* ${voidi.title}\n*Author:* ${voidi.author}\n*Duration:* ${voidi.duration}\n*Views:* ${voidi.views}\n\nMade with❣️`,
        contextInfo: {
          externalAdReply: {
            title: voidi.title,
            body: voidi.author,
            thumbnailUrl: voidi.thumbnail,
            mediaType: 1,
            mediaUrl: voidi.originalUrl,
            sourceUrl: voidi.originalUrl,
          },
        },
      });
    } catch (error) {
      message.reply(`${error.message}`);
    }
  },
});

// Command to search and download YouTube audio
CreatePlug({
  command: 'play',
  category: 'download',
  desc: 'Search and download YouTube audio',
  execute: async (message, conn, match) => {
    await message.react('✅');
    if (!match) return message.reply('_Provide a query, e.g., play hope by XXXTENTACION_');
    try { const url = 'https://api.diioffc.web.id/api/search/ytplay?query=';
      const ytSearch = new YouTubePlay(url);
      const video = await ytSearch.Ytdl(match);
      await conn.sendMessage(message.user, { 
        image: { url: video.thumbnail }, 
        caption: `*Title:* ${video.title}\n*Author:* ${video.author.name}\n*Views:* ${video.views}\n*Duration:* ${video.duration}\n*Published:* ${video.publishedAgo}\n\n*Download:* ${video.download.url}`,
      });

      await conn.sendMessage(message.user, {
        audio: { url: video.download.url },
        mimetype: 'audio/mpeg',
        fileName: video.download.filename,
      });
    } catch (error) {
      message.reply(`${error.message}`);
    }
  },
});

CreatePlug({
  command: "ytmp3",
  category: "download",
  desc: "Download YouTube videos as MP3",
  execute: async (message, conn, match) => {
    await message.react("✅");
    if (!match) return message.reply("_Provide a YouTube URL_");
    try { const down = new YTDown("https://api.diioffc.web.id/api/download/ytmp3?url=");
      const voidi = await down.getAudio(match);
      await conn.sendMessage(message.user, {
        audio: { url: voidi.downloadUrl },
        mimetype: "audio/mpeg",
        fileName: voidi.filename,
        contextInfo: {
          externalAdReply: {
            title: voidi.title,
            body: voidi.author,
            thumbnailUrl: voidi.thumbnail,
            mediaType: 1,
            mediaUrl: voidi.originalUrl,
            sourceUrl: voidi.originalUrl,
          },
        },
      });
    } catch (error) {
      message.reply(`${error.message}`);
    }
  },
});
    
