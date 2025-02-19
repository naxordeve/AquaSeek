import { twitter } from "./functions/twitter";
import { default as CreatePlug } from "../lib/index";

CreatePlug({
  command: "twitter",
  category: "download",
  desc: "Download media from Twitter",
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    match = match || message.quoted.text;
    if (!match) return void (await message.reply("_Please provide a valid twitter url_"));
    await message.react("✅");
    const data = await twitter(match);
    if (!data || !Array.isArray(data.download) || data.download.length === 0) {
      return;
    }
    const caption = `*Title:* ${data.title || "unknown"}\n*Duration:* ${data.duration || "1000"}\n*Source:* ${match}\n\n💦`;
    if (data.type === "video") {
      const video = data.download.find((item: any) => item.type === "mp4") || data.download[0];
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
      return void (await message.reply("_unspo_"));
    }
  },
});
