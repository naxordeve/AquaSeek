const { CreatePlug } = require("../lib/commands"); 
const { Func } = require("./functions/fbdl");
const { extractUrlFromText } = require("../lib/index.js");
const { getInstagramReelDownloadURL } = require("./functions/insta_reels"); 

CreatePlug({
  on: "text",
  execute: async (message, conn) => {
    var urls = extractUrlFromText(message.body);
    if (!urls.length) return;
    var igrex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/[^\s]+/i;
    var fbrex = /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.watch)\/[^\s]+/i;
    var url = urls[0], isIg = url.match(igrex), isFB = url.match(fbrex);
    if (isIg) {
        await message.reply('_Please wait..._');
        const insta = await getInstagramReelDownloadURL(isIg[0]);
        return insta
            ? conn.sendMessage(message.user, { video: { url: insta }, caption: `*Source:* ${isIg[0]}\n\n💦` }, { quoted: message })
            : message.reply('_err_');
    } 
    if (isFB) {
        await message.reply('_Please wait..._');
        const get = await Func(isFB[0]);
        if (!get) return message.reply('_err_');
        const videoUrl = get["720p"] || get["360p"];
        if (!videoUrl) return;
        return conn.sendMessage(message.user, { 
            video: { url: videoUrl }, 
            caption: `*Quality:* ${get["720p"] ? "720p (HD)" : "360p (SD)"}\n*Source:* ${isFB[0]}\n\n💦` 
        }, { quoted: message });
    }
  }
});
