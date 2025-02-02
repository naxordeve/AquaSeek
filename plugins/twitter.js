const { twitter } = require("./functions/twitter");
const { CreatePlug } = require("../lib/commands");

CreatePlug({
  command: "twitter",
  category: "download",
  desc: "Download media from Twitter",
  execute: async (message, conn, match) => {
    await message.react("🗣️");
    if (!match) return message.reply("_Please provide a valid twitter url_");
    const data = await twitter(match);
    if (!data || !Array.isArray(data.download) || data.download.length === 0) return;
    const caption = `*Title:* ${data.title || "unknown"}\n*Duration:* ${data.duration || "1000"}\n*Source:* ${match}\n\n💦`;
    if (data.type === "video") {
      const video = data.download.find((item) => item.type === "mp4") || data.download[0];
      await conn.sendMessage(
        message.user,
        { video: { url: video.url }, caption },
        { quoted: message }
      );
    } else if (data.type === "image" && data.download.length > 0) {
      for (const img of data.download) {
        const im = `*Source:* ${match}\n\n💦`;
        if (img.url) {
          await conn.sendMessage(
            message.user,
            { image: { url: img.url }, caption: im },
            { quoted: message }
          );
        }
      }
    } else {
      await message.reply("_unspo_");
    }
  },
});
