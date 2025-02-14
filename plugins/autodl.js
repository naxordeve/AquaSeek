const { CreatePlug } = require("../lib/commands"); 
const { Func } = require("./functions/fbdl");
const { extractUrlFromText } = require("../lib/index.js");
const { getInstagramReelDownloadURL } = require("./functions/insta_reels"); 
const { getTikV3 } = require("./functions/tiktokv3"); 
const axios = require("axios");

CreatePlug({
  on: "text",
  execute: async (message, conn) => {
    var urls = extractUrlFromText(message.body);
    if (!urls.length) return;
    var igrex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/[^\s]+/i;
    var fbrex = /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.watch)\/[^\s]+/i;
    var tikrex = /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/[^\s]+/i;
    var ytrex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]+/i;
    
    var url = urls[0], isIg = url.match(igrex), isFB = url.match(fbrex), isTik = url.match(tikrex), isYT = url.match(ytrex);
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
    if (isTik) {
        await message.reply('_Please wait..._');
        const tiktok = await getTikV3(isTik[0]);
        if (!tiktok || !tiktok.dlv3) return message.reply('_err_');
        return conn.sendMessage(message.user, { 
            video: { url: tiktok.dlv3 }, 
            caption: `*Title:* ${tiktok.title}\n*Source:* ${isTik[0]}\n\n💦` 
        }, { quoted: message });
    }
    if (isYT) {
        await message.reply('_Please wait..._');
        try { const voidi = await axios.get(`https://diegoson-naxordeve.hf.space/tomp3?url=${isYT[0]}`);
            if (voidi.data && voidi.data.link) {
                return conn.sendMessage(message.user, { 
                    audio: { url: voidi.data.link }, 
                    mimetype: "audio/mpeg", 
                 }, { quoted: message });
            }
        } catch (error) {
            return message.reply('_err_');
        }
    }
  }
});
  
