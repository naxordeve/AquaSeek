const { CreatePlug } = require('../lib/commands');
const { WhatMusic } = require('./functions/classFuncs');


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

CreatePlug({
    command: 'whatmusic',
    category: 'tools',
    desc: 'Identifies music',
    execute: async (message, conn, match) => {
        await message.react('❣️');
        if (!match) return message.reply('Please provide a music url');
        const audi = new WhatMusic('B43qPnho');
        const result = await audi.identify(match);
        if (result.error) return message.reply(`${result.error}`);
       await message.reply(`**Title:** ${result.title}\n**Artists:** ${result.artists}\n**Duration:** ${result.duration}\n**Release Date:** ${result.release}\n**Genre:** ${result.genre}\n**Score:** ${result.score}\n**Source:** ${result.source}\nMade with❣️`
        );
    }
});
