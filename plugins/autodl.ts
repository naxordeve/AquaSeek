import { default as CreatePlug } from "../lib/index";
import { Func } from "./functions/fbdl";
import { default as extractUrlFromText } from "../lib/index";
import { getInstagramReelDownloadURL } from "./functions/insta_reels";
import { getTikV3 } from "./functions/tiktokv3";
import axios from "axios";

CreatePlug({
  on: "text",
  execute: async (message: any, conn: any): Promise<void> => {
    const urls: string[] = extractUrlFromText(message.body);
    if (!urls.length) return;

    const fbrex = /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.watch)\/[^\s]+/i;
    const tikrex = /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/[^\s]+/i;
    const ytrex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]+/i;

    const url = urls[0];
    const isFB = url.match(fbrex);
    const isTik = url.match(tikrex);
    const isYT = url.match(ytrex);

    if (isFB) {
      const get = await Func(isFB[0]);
      if (!get) return void (await message.reply(""));
      const videoUrl = get["720p"] || get["360p"];
      if (!videoUrl) return;
      return conn.sendMessage(message.user, { 
        video: { url: videoUrl }, 
        caption: `*Quality:* ${get["720p"] ? "720p (HD)" : "360p (SD)"}\n*Source:* ${isFB[0]}\n\n💦` 
      }, { quoted: message });
    }

    if (isTik) {
      const tiktok = await getTikV3(isTik[0]);
      if (!tiktok || !tiktok.dlv3) return void (await message.reply(""));
      return conn.sendMessage(message.user, { 
        video: { url: tiktok.dlv3 }, 
        caption: `*Title:* ${tiktok.title}\n*Source:* ${isTik[0]}\n\n💦` 
      }, { quoted: message });
    }

    if (isYT) {
        try {
        const response = await axios.get(`https://diegoson-naxordeve.hf.space/tomp3?url=${isYT[0]}`);
        if (response.data && response.data.link) {
          return conn.sendMessage(message.user, { 
            audio: { url: response.data.link }, 
            mimetype: "audio/mpeg", 
          }, { quoted: message });
        }
      } catch (error) {
        return void (await message.reply(""));
      }
    }
  }
});
        
