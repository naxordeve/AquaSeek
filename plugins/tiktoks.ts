import { CreatePlug } from "../lib/index";
import TikTokS from "./functions/tiktoks";

CreatePlug({
  command: "ttsearch",
  category: "search",
  desc: "Search for TikToker",
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    match = match || message.message.text;
    if (!match) return void (await message.reply("_Please provide a search query_"));
    await message.react("✅"));
    const searcher = new TikTokS("https://api.diioffc.web.id/api/search/tiktok");
    const results = await searcher.search(match);
    if (results.error) return;
    const video = results[0];
    const caption = 
      `*Title:* ${video.title}\n` +
      `*Duration:* ${video.duration} seconds\n` +
      `*Region:* ${video.region}\n` +
      `*Uploaded:* ${video.createdAt}\n` +
      `*Likes:* ${video.stats.like}\n` +
      `*Comments:* ${video.stats.comment}\n` +
      `*Shares:* ${video.stats.share}\n` +
      `*Audio:* ${video.music.title} by ${video.music.author}`;
    await conn.sendMessage(message.user, { image: { url: video.thumbnail }, caption: caption }, { quoted: message });
    await conn.sendMessage(message.user, { video: { url: video.media.no_watermark }, mimetype: "video/mp4" }, { quoted: message });
    await conn.sendMessage(message.user, { audio: { url: video.music.play }, mimetype: "audio/mp4" }, { quoted: message });
  },
});
