import { CreatePlug } from '../lib/commands';
import axios from 'axios';

interface Song { title: string; duration: string; thumbnail: string; link: string; }
interface DownloadTB { 
  title: string; duration: string; thumbnail: string; 
  media: { type: string; size: string; link: string }[]; 
}
const Metadata = async (query: string): Promise<Song[]> => {
  const { data } = await axios.get(`https://diegoson-naxordeve.hf.space/tubidy/search?q=${query}`);
  return data;
};
const downloads = async (url: string): Promise<DownloadTB> => {
  const { data } = await axios.get(`https://diegoson-naxordeve.hf.space/tubidy/dl?url=${url}`);
  return data;
};

CreatePlug({
  command: "song",
  category: "download",
  desc: "Download a song by name",
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply("_Please provide a song name_"));
    await message.react("✅");
    const results = await Metadata(match);
    if (!results[0]) return;
    const toAudio = await downloads(results[0].link);
    const MP3DL = toAudio.media.find(m => m.type === "download")?.link;
    if (!MP3DL) return void (await message.reply("_oops_"));
    await conn.sendMessage(message.user, { 
      audio: { url: MP3DL }, mimetype: "audio/mpeg", ptt: false 
    });
  },
});
  
