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

const { spotify } = require("./functions/spotifydl"); 

CreatePlug({
  command: "spotifydl",
  category: "download",
  desc: "Download a Spotify track",
  execute: async (message, conn, match) => {
    await message.react("✅");
    if (!match || !match.includes("spotify.com/track/")) return message.reply("_Please provide a valid Spotify track url_");
    const trackInfo = await spotify(match);
    if (!trackInfo.music) return;
    await conn.sendMessage(message.user, {
      audio: { url: trackInfo.music },
      mimetype: "audio/mp4",
      ptt: false,
      contextInfo: {
        externalAdReply: {
          title: trackInfo.title || "Spotify Downloader",
          body: trackInfo.author || "Download",
          thumbnailUrl: trackInfo.thumbnail || "",
          mediaType: 1,
          renderLargerThumbnail: true,
          mediaUrl: trackInfo.link,
          sourceUrl: trackInfo.link,
        },
      },
    });

    await message.react("✅");
  },
});
      
