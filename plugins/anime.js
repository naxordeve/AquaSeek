const { CreatePlug } = require('../lib/commands');
const ZenlessZone = require('./functions/zonelesszero');

CreatePlug({
    command: 'zzzlist',
    category: 'game',
    desc: 'Lists all Zenless Zone Zero characters',
    execute: async (message, conn, match) => {
        await message.reply('_Fetching character list..._');
        const charList = await ZenlessZone.list().catch(() => null);
        if (!charList || charList.length === 0) return;
        const result = charList.map((ch) => `*${ch.name}* - [Info](${ch.url})`).join('\n');
        await message.reply(`*Zenless Zone Zero:*\n\n${result}`);
    }
});

CreatePlug({
    command: 'zzzchara',
    category: 'game',
    desc: 'Get details of a specific Zenless Zone Zero character',
    execute: async (message, conn, match) => {
        if (!match) return await message.reply('_Use: zzzchara character_name_');
        await message.reply('_Fetching character info..._');
        const charData = await ZenlessZone.chara(match).catch(() => null);
        if (!charData || !charData.info.name) return;
        let charInfo = `*${charData.info.name}*\nElement: ${charData.info.element}\n`;
        if (charData.stats.length > 0) 
            charInfo += '\n*Stats:*\n' + charData.stats.map(s => `${s.name}: ${s.value}`).join('\n');
        if (charData.skills.length > 0) 
            charInfo += '\n\n*Skills:*\n' + charData.skills.map(s => `_${s.name}_ - ${s.description}`).join('\n');
        await conn.sendMessage(message.user, { image: { url: charData.info.image }, caption: charInfo });
    }
});
  
