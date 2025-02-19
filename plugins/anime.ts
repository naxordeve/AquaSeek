import { CreatePlug } from '../lib/commands';
import axios from 'axios';
import ZenlessZone from './functions/zonelesszero';
import * as Steam from './functions/stream';
import fakeUserAgent from 'fake-useragent';
import * as  FormData from 'form-data';
import { fromBuffer } from 'file-type';

const uploadToCatbox = async (content: Buffer): Promise<string> => {
    const fileType = await fromBuffer(content);
    const ext = fileType?.ext || 'bin';
    const formData = new FormData();
    formData.append('fileToUpload', content, `file.${ext}`);
    formData.append('reqtype', 'fileupload');

    const response = await axios.post<string>('https://catbox.moe/user/api.php', formData, {
        headers: {
            ...formData.getHeaders(),
            'User-Agent': fakeUserAgent(),
        },
    });

    return response.data.trim();
};

CreatePlug({
    command: 'tourl',
    category: 'tools',
    desc: 'Uploads media and returns a URL',
    execute: async (message: any, conn: any): Promise<void> => {
        if (!message.quoted || !message.quoted.message) {
            return void (await message.reply('_Reply to an image, video, document, or mp3_'));
        }
        const buffer = await message.quoted.download();
        if (!buffer) return;
        return void (await message.reply('_Uploading..._'));
        const url = await uploadToCatbox(buffer);
        return void (await message.reply(url));
    },
});

CreatePlug({
    command: 'steam',
    category: 'game',
    desc: 'Search for games on Steam',
    execute: async (message: any, conn: any, match: string): Promise<void> => {
        if (!match) return void (await message.reply('_Use: steam game_name_'));
        return void (await message.reply('_Searching for game..._'));
        const results = await Steam.search(match).catch(() => null);
        if (!results || results.length === 0) return;
        const games = results
            .map(
                (game: any, index: number) =>
                    `*${index + 1}. ${game.name}*\n🆔 ID: ${game.id}\n💰 Price: ${game.price}\n⭐ Score: ${game.score}\n🖥️ Platform: ${game.platform}\nhttps://store.steampowered.com/app/${game.id})\n`
            )
            .join('\n');
        return void (await message.reply(`*Steam Game Search:*\n\n${games}`));
    },
});

CreatePlug({
    command: 'steaminfo',
    category: 'game',
    desc: 'Get detailed info of a Steam game by ID',
    execute: async (message: any, conn: any, match: string): Promise<void> => {
        if (!match) return void (await message.reply('_Use: steaminfo game_id_'));
        return void (await message.reply('_Fetching game details..._'));
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
                caption: gameInfo,
            });
        } else {
            return void (await message.reply(gameInfo));
        }

        if (gameDetails.movies.length > 0) {
            const videoUrl = gameDetails.movies[0].videos.max || gameDetails.movies[0].videos[720] || gameDetails.movies[0].videos[480];
            await conn.sendMessage(message.user, { video: { url: videoUrl }, caption: `🎥 *Trailer: ${gameDetails.movies[0].title}*` });
        }
    },
});

CreatePlug({
    command: 'zzzlist',
    category: 'game',
    desc: 'Lists all Zenless Zone Zero characters',
    execute: async (message: any, conn: any): Promise<void> => {
       return void (await message.reply('_Fetching character list..._'));
        const charList = await ZenlessZone.list().catch(() => null);
        if (!charList || charList.length === 0) return;
        const result = charList.map((ch: any) => `*${ch.name}* - [Info](${ch.url})`).join('\n');
        return void (await message.reply(`*Zenless Zone Zero:*\n\n${result}`));
    },
});

CreatePlug({
    command: 'zzzchara',
    category: 'game',
    desc: 'Get details of a specific Zenless Zone Zero character',
    execute: async (message: any, conn: any, match: string): Promise<void> => {
        if (!match) return void (await message.reply('_Use: zzzchara character_name_'));
        return void (await message.reply('_Fetching character info..._'));
        const charData = await ZenlessZone.chara(match).catch(() => null);
        if (!charData || !charData.info.name) return;
        let charInfo = `*${charData.info.name}*\nElement: ${charData.info.element}\n`;
        if (charData.stats.length > 0) {
            charInfo += '\n*Stats:*\n' + charData.stats.map((s: any) => `${s.name}: ${s.value}`).join('\n');
        }
        if (charData.skills.length > 0) {
            charInfo += '\n\n*Skills:*\n' + charData.skills.map((s: any) => `_${s.name}_ - ${s.description}`).join('\n');}
        await conn.sendMessage(message.user, { image: { url: charData.info.image }, caption: charInfo });
    },
});
