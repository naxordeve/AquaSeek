const { Sticker, createSticker } = require('wa-sticker-formatter');
const { CreatePlug } = require('../lib/commands');
const CONFIG = require('../config');
const axios = require("axios");

async function translate(query = "", lang) {
    if (!query.trim()) return "";
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.append("client", "gtx");
    url.searchParams.append("sl", "auto");
    url.searchParams.append("dt", "t");
    url.searchParams.append("tl", lang);
    url.searchParams.append("q", query);
    const response = await fetch(url.href);
    const data = await response.json();
    if (data) {
        return [data[0]].map(([
        [a]
        ]) => a).join(" ");
    } else {
        return "";
    }
}

CreatePlug({
    command: 'translate',
    category: 'tools',
    desc: 'Translater',
    execute: async (message, conn, match) => {
        if (!message.quoted || !message.quoted.message.conversation) return await message.reply('_translate language_');
        const text = message.quoted.message.conversation;
        if (!match) return await message.reply('_Specify a language code. Example: translate zu_');
        const lang = match.trim();
        await message.reply('_Translating..._');
        const voidi = await translate(text, lang).catch(() => null);
        if (!voidi) return;
        await message.reply(`*${voidi}*`);
    }
});

async function Upscale(imageBuffer) {
    const response = await fetch("https://lexica.qewertyy.dev/upscale", {
        body: JSON.stringify({
        image_data: Buffer.from(imageBuffer, "base64"),
        format: "binary",
        }),
        headers: {
        "Content-Type": "application/json",
        },
        method: "POST",
    });
    if (!response.ok) return null;
    return Buffer.from(await response.arrayBuffer());
}

CreatePlug({
    command: 'upscale',
    category: 'tools',
    desc: 'Upscales an image to higher resolution',
    execute: async (message, conn, match) => {
        if (!message.quoted || !message.quoted.message.imageMessage) return await message.reply('_Reply to an image to upscale it_');
        await message.reply('_Processing image, please wait..._');
        const buffer = await message.quoted.download();
        const ups = await Upscale(buffer).catch(() => null);
        if (!ups) return;
        await conn.sendMessage(message.user, { image: ups, caption: '_Image upscaled_' });
    }
});
            
async function removebg(buffer) {
    return new Promise(async (resolve, reject) => {
        const image = buffer.toString("base64");
        let res = await axios.post(
        "https://us-central1-ai-apps-prod.cloudfunctions.net/restorePhoto", {
        image: `data:image/png;base64,${image}`,
        model: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",},);
        const data = res.data?.replace(`"`, "");
        if (!data) return reject("err");
        resolve(data);
    });
}

CreatePlug({
    command: 'removebg',
    category: 'tools',
    desc: 'Removes the background from an image',
    execute: async (message, conn, match) => {
        if (!message.quoted || !message.quoted.message.imageMessage) return await message.reply('_Reply to an image to remove its background_');
        await message.reply('_Processing image, please wait..._');
        const buffer = await message.quoted.download();
        const voidi = await removebg(buffer).catch(err => null);
        if (!voidi || typeof voidi !== "string") return;
        const o = await axios.get(voidi, { responseType: 'arraybuffer' });
        const x = Buffer.from(o.data);
        await conn.sendMessage(message.user, { image: x, caption: '_Background removed_' });
    }
});
            
CreatePlug({
    command: 'sticker',
    category: 'tools',
    desc: 'Convert an image, GIF, or video into a sticker',
    execute: async (message, conn, match) => {
        if (!message.quoted || !message.quoted.message) return await message.reply('_Reply to an image, GIF, or video to create a sticker_');
        const buffer = await message.quoted.download();
        if (!buffer) return;
        const pack = CONFIG.APP.STICKER_PACKNAME;
        const sticker = new Sticker(buffer, {
            pack, 
            type: 'full',             
            categories: ['🤖', '🎉', '💦'],  
            quality: 80,              
            id: 'sticker_cmd',
            background: '#FFFFFF'     
        });

        const voidi = await sticker.toBuffer();
        await conn.sendMessage(message.user, { sticker: voidi });
    }
});

CreatePlug({
    command: 'take',
    category: 'tools',
    desc: 'Convert an image, GIF, or video into a sticker',
    execute: async (message, conn, match) => {
        if (!message.quoted || !message.quoted.message) return await message.reply('_Reply to a sticker_');
        let pack = CONFIG.APP.STICKER_PACKNAME || 'Diego';
        let author = 'NᴀxᴏʀDᴇᴠɪ';
        if (match) {
            if (!match.includes('|')) return await message.reply('_Use the correct format: `packname|author`_');
            let [userPack, userAuthor] = match.split('|').map((v) => v.trim());
            if (!userPack || !userAuthor) return await message.reply('_Both packname and author must be provided in the format: `packname|author`_');
            pack = userPack;
            author = userAuthor;
        }
        const buffer = await message.quoted.download();
        if (!buffer) return;
        const sticker = new Sticker(buffer, {
            pack,
            author,
            type: 'full',
            quality: 80,
            id: 'sticker_cmd',
            background: '#FFFFFF'
        });

        const voidi = await sticker.toBuffer();
        await conn.sendMessage(message.user, { sticker: voidi });
    }
});
