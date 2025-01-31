const { Sticker, createSticker } = require('wa-sticker-formatter');
const { CreatePlug } = require('../lib/commands');
const CONFIG = require('../config');
const axios = require("axios");

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
        if (!message.quoted || !message.quoted.message) return await message.reply('_Reply to a sticker with the format `take packname|author`_');
        if (!match || !match.includes('|')) {
            return await message.reply('_You must provide a packname and author in the format `packname|author`_');
        }
        let [pack, author] = match.split('|').map((v) => v.trim());
        if (!pack) pack = CONFIG.APP.STICKER_PACKNAME; 
        if (!author) author = 'NaxorDevi💦'; 
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
    
