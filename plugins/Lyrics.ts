import { CreatePlug, getLang } from "../lib/index";
import axios from "axios";

CreatePlug({
  command: "lyrics",
  category: "search",
  desc: "Fetches lyrics based on the query",
  execute: async (message: any, conn: any, match: string): Promise<void> => {
   const msgs = getLang();
    if (!match) return void (await message.reply(msgs.lyrics_msg));
    await message.react("✅");
    const response = await axios.get("https://diegoson-naxordeve.hf.space/api/lyrics", {
      params: { q: match }, 
    });
    const data: any[] = response.data;
    if (!data?.length) return void (await message.reply(msgs.lyrics_sorry));
    const song = data[0];
    const messagei = `🎶 *${song.trackName}*\nby *${song.artistName}*\n\n${song.plainLyrics}`;
    await message.reply(messagei);
  },
});
      
