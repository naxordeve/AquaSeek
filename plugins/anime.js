const { CreatePlug } = require('../lib/commands');
const axios = require("axios");
const ZenlessZone = require('./functions/zonelesszero');
const Steam = require('./functions/stream'); 
const fakeUserAgent = require("fake-useragent");
const FormData = require("form-data");
const { fromBuffer } = require("file-type");

const uploadToCatbox = async (content) => {
    const { ext } = (await fromBuffer(content)) || {};
    const formData = new FormData();
    formData.append("fileToUpload", content, `file.${ext}`);
    formData.append("reqtype", "fileupload");
    const response = await axios.post("https://catbox.moe/user/api.php", formData, {
        headers: {
            ...formData.getHeaders(),
            "User-Agent": fakeUserAgent(),
        },
    });

    return response.data.trim();
};

CreatePlug({
    command: 'tourl',
    category: 'tools',
    desc: 'Uploads media and returns a URL',
    execute: async (message, conn) => {
        if (!message.quoted || !message.quoted.message) return await message.reply('_Reply to an image, video, or document or mp3_');
        const buffer = await message.quoted.download();
        if (!buffer) return;
        await message.reply('_Uploading..._');
        const url = await uploadToCatbox(buffer);
        await message.reply(`${url}`);
    }
});

CreatePlug({
    command: 'steam',
    category: 'game',
    desc: 'Search for games on Steam',
    execute: async (message, conn, match) => {
        if (!match) return await message.reply('_Use: steam game_name_');
        await message.reply('_Searching for game..._');
        const results = await Steam.search(match).catch(() => null);
        if (!results || results.length === 0) return;
        const games = results
         .map((game, index) => `*${index + 1}. ${game.name}*\n🆔 ID: ${game.id}\n💰 Price: ${game.price}\n⭐ Score: ${game.score}\n🖥️ Platform: ${game.platform}\nhttps://store.steampowered.com/app/${game.id})\n`)
         .join('\n');
        await message.reply(`*Steam Game Search:*\n\n${games}`);
    }
});

CreatePlug({
    command: 'steaminfo',
    category: 'game',
    desc: 'Get detailed info of a Steam game by ID',
    execute: async (message, conn, match) => {
        if (!match) return await message.reply('_Use: steaminfo game_id_');
        await message.reply('_Fetching game details..._');
        const gameDetails = await Steam.detail(match).catch(() => null);
        if (!gameDetails || !gameDetails.metadata.title) return;
        let gameInfo = `*${gameDetails.metadata.title}*\n\n`;
        gameInfo += `📅 Release Date: ${gameDetails.metadata.release}\n`;
        gameInfo += `🎮 Genre: ${gameDetails.metadata.genre.join(', ')}\n`;
        gameInfo += `👨‍💻 Developer: ${gameDetails.metadata.developer.join(', ')}\n`;
        gameInfo += `📝 Description: ${gameDetails.metadata.description.slice(0, 500)}...\n\n`;
        gameInfo += `https://store.steampowered.com/app/${match})\n`;
        if (gameDetails.screenshot.length > 0) {
            await conn.sendMessage(message.user, {
                image: { url: gameDetails.screenshot[0] },
                caption: gameInfo
            });
        } else {
            await message.reply(gameInfo);}
         if (gameDetails.movies.length > 0) {
            const voidi = gameDetails.movies[0].videos.max || gameDetails.movies[0].videos[720] || gameDetails.movies[0].videos[480];
            await conn.sendMessage(message.user, { video: { url: voidi }, caption: `🎥 *Trailer: ${gameDetails.movies[0].title}*` });
        }
    }
});

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
  
