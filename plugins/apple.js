const { toAudio } = require('../lib/functions');
const { search, download } = require('./functions/appleMusic');

CreatePlug({
  command: 'applemusic',
  category: 'download',
  desc: 'Fetches Apple Music track details and provides a download link',
  execute: async (message, conn, match) => {
    if (!match) return message.reply("Please provide a search query");
    await message.react('🎵');
    const results = await search(match);
    if (results.length === 0) return;
    const track = results[0]; 
    const trackInfo = `*Title:* ${track.title}\n*Artist:* ${track.artist.name}\n *SLink:* ${track.song}`;
    await conn.sendMessage(message.user, { image: { url: track.image }, caption: trackInfo });
    await message.react('⏳');
    const songData = await download(track.song);
    await message.react('✅');
    const audioFile = await toAudio(songData.download);
    await conn.sendMessage(message.user, { audio: audioFile, mimetype: 'audio/mp3' });
  },
});
        
