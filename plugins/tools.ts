import axios from "axios";
import { CreatePlug } from "../lib/commands";

CreatePlug({
  command: "ssweb",
  category: "tools",
  desc: "Take a website screenshot",
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    match = match || message.quoted?.message?.conversation;
    if (!match || !match.startsWith("http")) return void (await message.reply("_Please provide a valid URL_"));
    return void (await message.react("✅"));
    const screenshotUrl = `https://bk9.fun/tools/screenshot?url=${match}&device=phone`;
    try { const response = await axios.get(screenshotUrl, { responseType: "arraybuffer" });
      if (response.status !== 200) return;
      await conn.sendMessage(message.user, {
        image: response.data,
        caption: `📸 Screenshot of: ${match}`,
      });
    } catch (error) {
      console.error(error);
    }
  },
});

CreatePlug({
  command: "mrbeast",
  category: "tools",
  desc: "Generate MrBeast TTS voice",
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply("_Please provide text_"));
    const ttsUrl = `https://bk9.fun/tools/tts-beast?q=${match}`;
    try { const response = await axios.get(ttsUrl, { responseType: "arraybuffer" });
      if (response.status !== 200) return;
      return void (await message.react("✅"));
      await conn.sendMessage(message.user, {
        audio: response.data,
        mimetype: "audio/mpeg",
        ptt: false,
      });
    } catch (error) {
      console.error(error);
    }
  },
});
