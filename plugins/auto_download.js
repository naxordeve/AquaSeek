const { CreatePlug } = require("../lib/commands"); 
const { Func } = require("./functions/fbdl"); 
const { getInstagramReelDownloadURL } = require("./functions/insta_reels"); 

CreatePlug({
  on: "text",
  execute: async (message, conn, match) => {
    if (match.startsWith("https://facebook.com") && !match.includes("fb.watch")) {
       return message.reply('_Provide a valid fb url_');}
    const get = await Func(match);
    if (!get) return;
    await message.reply('_Please wait..._');
    const q = get["720p"] ? "720p (HD)" : "360p (SD)";
    const voidi = get["720p"] || get["360p"];
    if (!voidi) return;
    await conn.sendMessage(message.user, { 
        video: { url: voidi }, 
        caption: `*Quality:* ${q}\n*Source:* ${match}\n\n💦` 
    }, { quoted: message });
    if (match.startsWith("https://www.instagram.com") || match.startsWith("https://instagram.com")) {
        await message.reply('_Please wait..._');
        const insta = await getInstagramReelDownloadURL(match);
        if (insta) {
            await conn.sendMessage(message.user, { 
                video: { url: insta }, 
                caption: `*Source:* ${match}\n\n💦` 
            }, { quoted: message });
        } else {
            await message.reply('_err_');
        }
    }
  }
});
          
