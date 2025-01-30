const { Sticker } = require('wa-sticker-formatter');
const { CreatePlug } = require('../lib/commands');
const CONFIG = require('../config'); 

CreatePlug({
    command: 'take',
    category: 'tools',
    desc: 'Convert an image, GIF, or video into a sticker',
    execute: async (message, conn, match) => {
        if (!message.quoted || (!message.quoted.message)) return await message.reply('_Reply to_sticker_');
        let [pack, author] = match.split('|').map((v) => v.trim());
        pack = pack || CONFIG.APP.PACKNAME; 
        author = author || 'NaxorDevi'; 
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
                                
