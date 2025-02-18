import { CreatePlug } from '../lib/commands';
import * as fetch from 'node-fetch';

interface Song {
  title: string;
  duration: string;
  thumbnail: string;
  link: string;
}

interface DownloadTB {
  title: string;
  duration: string;
  thumbnail: string;
  media: { type: string; size: string; link: string }[];
}
const searchSong = async (query: string): Promise<Song[]> => {
  const response = await fetch(`https://diegoson-naxordeve.hf.space/tubidy/search?q=${query}`);
  const data = await response.json();
  return data;
};
const downloadSong = async (url: string): Promise<DownloadTB> => {
  const response = await fetch(`https://diegoson-naxordeve.hf.space/tubidy/dl?url=${url}`);
  const data = await response.json();
  return data;
};

CreatePlug({
  command: "song",
  category: "download",
  desc: "Download a song by name",
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return message.reply("_Please provide a song name_");
    const results = await searchSong(match);
    if (!results[0]) return;
    const toAudio = await downloadSong(results[0].link);
    if (!toAudio.media[0]) return;
    const MP3DL = toAudio.media.find((m) => m.type === "download")?.link;
    if (!MP3DL) return message.reply("_oops_");
    await conn.sendMessage(message.user, { 
      audio: { url: MP3DL }, mimetype: "audio/mpeg",
      ptt: false 
    });
  },
});
