const axios = require("axios");
const { CreatePlug } = require('../lib/commands');

CreatePlug({
  command: "ssweb",
  category: "tools",
  desc: "Take a website screenshot",
  execute: async (message, conn, match) => {
    await message.react("⏳");
    match = match || message.quoted.message.conversation;
    if (!match || !match.startsWith("http")) return message.reply("_Please provide a valid url_");
    const voidi = `https://bk9.fun/tools/screenshot?url=${match}&device=phone`;
    const ctx = await axios.get(voidi, { responseType: "arraybuffer" });
    if (!ctx || ctx.status !== 200) return;
    await conn.sendMessage(message.user, {
      image: response.data,
      caption: `📸 Screenshot of: ${match}`,
    });
  },
});
      
CreatePlug({
  command: "mrbeast",
  category: "tools",
  desc: "",
  execute: async (message, conn, match) => {
    await message.react("⏳");
    if (!match) return message.reply("_Please provide text_");
    const ctx = `https://bk9.fun/tools/tts-beast?q=${match}`;
    const voidi = await axios.get(ctx, { responseType: "arraybuffer" });
    if (!voidi || voidi.status !== 200) return;
    await message.react('🗨️');
    await conn.sendMessage(message.user, {audio: voidi.data,mimetype: "audio/mpeg",ptt: false,
    });
  },
});
