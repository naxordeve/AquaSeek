import { default as CreatePlug } from "../lib/index";
import axios from 'axios';

CreatePlug({
  command: "lyrics",
  category: "search",
  desc: "lyrics based on the query",
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply("_Please provide a song name_"));
    await message.react("✅");
    const response = await axios.get(`https://diegoson-naxordeve.hf.space/api/lyrics?q=${match}`);
    const data: any[] = response.data;,
    if (!data?.[0]) return;
    const song = data[0]; 
    const Messag = `🎶 *${song.trackName}*\nby *${song.artistName}*\n\n${song.plainLyrics}`;
    return void (message.reply(Messag));
  },
});
