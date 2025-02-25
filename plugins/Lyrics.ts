import { default as CreatePlug } from "../lib/index";
import axios from "axios";

CreatePlug({
  command: "lyrics",
  category: "search",
  desc: "Fetches lyrics based on the query",
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) {
      await message.reply("_Please provide a song name_");
      return;
    }
    await message.react("✅");
    const response = await axios.get("https://diegoson-naxordeve.hf.space/api/lyrics", {
      params: { q: match }, 
    });
    const data: any[] = response.data;
    if (!data?.length) {
      await message.reply("_No lyrics found_");
      return;
    }
    const song = data[0];
    const messagei = `🎶 *${song.trackName}*\nby *${song.artistName}*\n\n${song.plainLyrics}`;
    await message.reply(messagei);
  },
});
      
