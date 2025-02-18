import { CreatePlug } from "../lib/commands";
import * as fetch from "node-fetch";

CreatePlug({
  command: "lyrics",
  category: "search",
  desc: "lyrics based on the query",
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return message.reply("_Please provide a song name_");
    const response = await fetch(`https://diegoson-naxordeve.hf.space/api/lyrics?q=${match}`);
    const data: any[] = await response.json();

    if (!data?.[0]) return;
    
    const song = data[0]; 
    const Messag = `🎶 *${song.trackName}*\nby *${song.artistName}*\n\n${song.plainLyrics}`;
    message.reply(Messag);
  },
});
