const { CreatePlug } = require('../lib/commands');


CreatePlug({
    command: 'flux',
    category: 'media',
    desc: 'flux img gen',
    execute: async (message, conn, match) => {
        await message.react('❣️');
        if (!match) return message.reply('_Please provide a prompt_');
        const txt = `https://api.siputzx.my.id/api/ai/flux?prompt=${match}`;
        await message.reply('_Loading..._');
        await conn.sendMessage(message.user, { image: { url: txt }, caption: '**FluxImg**\nMade with❣️' });
    }
});

CreatePlug({
    command: 'diffusion',
    category: 'media',
    desc: 'diffusion img gen',
    execute: async (message, conn, match) => {
        await message.react('❣️');
        if (!match) return message.reply('_Please provide a prompt_');
        const txt = `https://api.siputzx.my.id/api/ai/stable-diffusion?prompt=${match}`;
        await message.reply('_Loading..._');
        await conn.sendMessage(message.user, { image: { url: txt }, caption: '**Diffuser**\nMade with❣️' });
    }
});
