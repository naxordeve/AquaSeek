const { twitter } = require("./functions/twitter");
const CreatePlug = require("../lib/commands");

CreatePlug({
  command: "twitter",
  category: "download",
  desc: "Download media from Twitter",
  execute: async (message, conn, match) => {
    await message.react("🗣️");
    if (!match) return message.reply("_Please provide a valid twitter url_");
    const data = await twitter(match);
    if (!data || !data.download || data.download.length === 0)  return;
    const caption = `*Title:* ${data.title || "title"}\n*Duration:* ${data.duration || "10000"}\n*Source:* ${match}\n\n💦`;
    if (data.type === "video") {
      const video = data.download.find((item) => item.type === "mp4") || data.download[0];
      await conn.sendMessage(
        message.user,
        { video: { url: video.url }, caption },
        { quoted: message }
      );
    } else if (data.type === "image") {
      for (const img of data.download) {
        const img = `*Source:* ${match}\n\n💦`;
        await conn.sendMessage(
          message.user,
          { image: { url: img.url }, caption: img },
          { quoted: message }
        );
      }
    } else {
      await message.reply("_unsup_");
    }
  },
});
