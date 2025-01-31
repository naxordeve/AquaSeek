const { Sticker, createSticker } = require('wa-sticker-formatter');
const { CreatePlug } = require('../lib/commands');
const CONFIG = require('../config');

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
    
