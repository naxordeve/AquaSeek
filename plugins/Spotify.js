const { CreatePlug } = require('../lib/commands');
const{ searchspotify, downloadSpotify } = require('./functions/spotify.js');

CreatePlug({
  command: "spotifysearch",
  category: "search",
  desc: "Search for a song on Spotify",
  execute: async (message, conn, match) => {
    await message.react("⏳");
    if (!match) return message.reply("_Please provide a song name to search_");
    const results = await searchSpotify(match);
    if (!results || results.msg) return;
    let voidi = `Spotify Search*\n\n`;
    results.forEach((track, index) => {
      voidi+= `*${index + 1}.* ${track.title} - ${track.artist}\n⏱ Duration: ${track.duration}\n${track.url}\n\n`;
    });
    await conn.sendMessage(
      message.user,
      {
        text: voidi,
        contextInfo: {
          externalAdReply: {
            title: "Spotify Search", 
            body: "Spotify", 
            thumbnailUrl: results[0].thumbnail, 
            mediaType: 1,
            mediaUrl: results[0].url, 
            sourceUrl: results[0].url, 
          },
        },
      }
    );
  },
});

CreatePlug({
  command: "spotifydl",
  category: "download",
  desc: "Download a Spotify track",
  execute: async (message, conn, match) => {
    await message.react("⏳");
    if (!match || !match.includes("spotify.com/track/")) return message.reply("_Please provide a valid Spotify track url_");
    const track = await downloadSpotify(match);
    if (!track || !track.download) return;
    await conn.sendMessage(
      message.user,
      {
        audio: { url: track.download },
        mimetype: "audio/mp4",
        ptt: false,
        contextInfo: {
          externalAdReply: {
            title: "Spotify Downloader",
            body: "Download", 
            thumbnailUrl: track.cover, 
            renderLargerThumbnail: true,
            mediaType: 1, 
            mediaUrl: track.url, 
            sourceUrl: track.url, 
          },
        },
      }
    );
  },
});
  
