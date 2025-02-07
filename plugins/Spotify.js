const { CreatePlug } = require('../lib/commands');
const SpotifyDL = require("./functions/spotify");

CreatePlug({
  command: "spotify",
  category: "download",
  desc: "Download a Spotify track",
  execute: async (message, conn, match) => {
    await message.react("✅");
    match = match || message.message.text;
    if (!match) return message.reply("_provides spotify url_");
    const get = new SpotifyDL("https://api.diioffc.web.id/api/download/spotify");
    const voidi = await get.toAudio(match);
    if (voidi.error) return;
    const { title, artists, releaseDate, thumbnail, audioUrl } = voidi;
    const caption =
      + `📌 *Title:* ${title}\n`
      + `🎤 *Artist:* ${artists}\n`
      + `📅 *Release Date:* ${releaseDate}`;
    await conn.sendMessage(message.user,{ image: { url: thumbnail }, caption: caption },{ quoted: message });
    await conn.sendMessage(message.user,{ audio: { url: audioUrl }, mimetype: "audio/mp4", ptt: false },{ quoted: message });
  }
});
