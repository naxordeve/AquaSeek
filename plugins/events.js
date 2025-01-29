const { CreatePlug } = require('../lib/commands');
var CONFIG = require('../config');

CreatePlug({
    command: 'antilink?(*)',
    category: 'group',
    desc: 'manage',
    execute: async (message, conn, match) => {
        if (!message.isGroup) return;
        if (!message.isBotAdmin) return message.reply('_I am not an admin_');
        if (!message.isAdmin) return;
        if (!match || !['on', 'off'].includes(match.toLowerCase())) {
            return await message.reply(
                "Usage: *antilink on* or *antilink off*\nEnable or disable anti-link system"
            );
        }
        await message.react('✅');
        const toggle = match.toLowerCase();
        
        if (toggle === 'on') {
            CONFIG.app.ANTILINK = true;
            await message.reply("Anti-link has been *enabled*");
        } else if (toggle === 'off') {
            CONFIG.app.ANTILINK = false;
            await message.reply("Anti-link has been *disabled*");
        }
    },
});

CreatePlug({
    command: 'mode',
    category: 'admin',
    execute: async (message, conn, match) => {
        if (!message.isFromMe) return;
        if (!match || !['private', 'public'].includes(match.toLowerCase())) {
            return await message.reply("*mode private* or *mode public*");
        }
        await message.react('✅');
        const toggle = match.toLowerCase();
        
        if (toggle === 'public') {
            CONFIG.app.MODE = true;
            await message.reply("_Mode has switched to *Public*_");
        } else if (toggle === 'private') {
            CONFIG.app.MODE = false;
            await message.reply("_Mode has switched to *Private*_");
        }
    },
});
