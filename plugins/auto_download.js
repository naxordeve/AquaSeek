const { CreatePlug } = require("../lib/commands"); 
const { getBuffer } = require("./functions/funcs"); 
const { Func } = require("./functions/fbdl"); 

CreatePlug({
  on: "text",
  execute: async (message, conn, match) => {
    await message.react('✅');
    if (!match.includes("facebook.com") && !match.includes("fb.watch")) return message.reply('_Provide valid url lol_');
    const get = await Func(match);
    if (!get) return;
    await message.reply('_Please wait..._');
    const q = get["720p"] ? "720p (HD)" : "360p (SD)";
    const voidi = get["720p"] || get["360p"];
    if (!voidi) return;
    const toVideo = await getBuffer(voidi);
    await conn.sendMessage(message.user, { video:{url: toVideo}, caption: `*Quality:* ${q}\n*Source:* ${match}\n\n💦` }, { quoted: message });
  }
});
        
