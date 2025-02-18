import { Sticker } from 'wa-sticker-formatter';
import { CreatePlug } from '../lib/commands';
import CONFIG from '../tsconfig';
import axios from 'axios';

async function translate(query: string = "", lang: string): Promise<string> {
    if (!query.trim()) return "";
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.append("client", "gtx");
    url.searchParams.append("sl", "auto");
    url.searchParams.append("dt", "t");
    url.searchParams.append("tl", lang);
    url.searchParams.append("q", query);
    const response = await fetch(url.href);
    const data = await response.json();
    return data ? data[0].map(([a]: [string]) => a).join(" ") : "";
}

CreatePlug({
    command: 'translate',
    category: 'tools',
    desc: 'Translator',
    execute: async (message: any, conn: any, match: string) => {
        if (!message.quoted?.message?.conversation) 
            return await message.reply('_translate language_');
        const text = message.quoted.message.conversation;
        if (!match) return await message.reply('_Specify a language code. Example: translate zu_');
        await message.reply('_Translating..._');
        const translatedText = await translate(text, match.trim()).catch(() => null);
        
        if (translatedText) {
            await message.reply(`*${translatedText}*`);
        }
    }
});

async function Upscale(imageBuffer: Buffer): Promise<Buffer | null> {
    const response = await fetch("https://lexica.qewertyy.dev/upscale", {
        body: JSON.stringify({
            image_data: imageBuffer.toString("base64"),
            format: "binary",
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
    });

    if (!response.ok) return null;
    return Buffer.from(await response.arrayBuffer());
}

CreatePlug({
    command: 'upscale',
    category: 'tools',
    desc: 'Upscales an image to higher resolution',
    execute: async (message: any, conn: any) => {
        if (!message.quoted?.message?.imageMessage) 
            return await message.reply('_Reply to an image to upscale it_');
        await message.reply('_Processing image, please wait..._');
        const buffer = await message.quoted.download();
        const upscaledImage = await Upscale(buffer).catch(() => null);
        if (upscaledImage) {
            await conn.sendMessage(message.user, { image: upscaledImage, caption: '_Image upscaled_' });
        }
    }
});

async function removebg(buffer: Buffer): Promise<string | null> {
    const image = buffer.toString("base64");
    try {
        const response = await axios.post(
            "https://us-central1-ai-apps-prod.cloudfunctions.net/restorePhoto",
            {
                image: `data:image/png;base64,${image}`,
                model: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
            }
        );
        return response.data?.replace(`"`, "") || null;
    } catch {
        return null;
    }
}

CreatePlug({
    command: 'removebg',
    category: 'tools',
    desc: 'Removes the background from an image',
    execute: async (message: any, conn: any) => {
        if (!message.quoted?.message?.imageMessage) 
            return await message.reply('_Reply to an image to remove its background_');
        await message.reply('_Processing image, please wait..._');
        const buffer = await message.quoted.download();
        const bgRemovedUrl = await removebg(buffer).catch(() => null);
        if (bgRemovedUrl) {
            const imageResponse = await axios.get(bgRemovedUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(imageResponse.data);
            await conn.sendMessage(message.user, { image: imageBuffer, caption: '_Background removed_' });
        }
    }
});

CreatePlug({
    command: 'sticker',
    category: 'tools',
    desc: 'Convert an image, GIF, or video into a sticker',
    execute: async (message: any, conn: any) => {
        if (!message.quoted?.message) 
            return await message.reply('_Reply to an image, GIF, or video to create a sticker_');
        const buffer = await message.quoted.download();
        if (!buffer) return;
        const pack = CONFIG.APP.STICKER_PACKNAME || 'Sticker Pack';
        const sticker = new Sticker(buffer, {
            pack,
            type: 'full',
            categories: ['🤖', '🎉', '💦'],
            quality: 80,
            id: 'sticker_cmd',
            background: '#FFFFFF',
        });

        const stickerBuffer = await sticker.toBuffer();
        await conn.sendMessage(message.user, { sticker: stickerBuffer });
    }
});

CreatePlug({
    command: 'take',
    category: 'tools',
    desc: 'Convert an image, GIF, or video into a sticker with custom packname and author',
    execute: async (message: any, conn: any, match: string) => {
        if (!message.quoted?.message) 
            return await message.reply('_Reply to a sticker_');
        let pack = CONFIG.APP.STICKER_PACKNAME || 'Diego';
        let author = 'NᴀxᴏʀDᴇᴠɪ';
        if (match) {
            const [userPack, userAuthor] = match.split('|').map((v) => v.trim());
            if (!userPack || !userAuthor) 
                return await message.reply('_Use the correct format: `packname|author`_');
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
            background: '#FFFFFF',
        });

        const stickerBuffer = await sticker.toBuffer();
        await conn.sendMessage(message.user, { sticker: stickerBuffer });
    }
});

CreatePlug({
    command: 'flux',
    category: 'media',
    desc: 'Flux image generator',
    execute: async (message: any, conn: any, match: string) => {
        await message.react('❣️');
        if (!match) return message.reply('_Please provide a prompt_');
        const imageUrl = `https://api.siputzx.my.id/api/ai/flux?prompt=${encodeURIComponent(match)}`;
        await message.reply('_Loading..._');

        await conn.sendMessage(message.user, {
            image: { url: imageUrl },
            caption: '**FluxImg**\nMade with ❣️',
        });
    },
});

CreatePlug({
    command: 'diffusion',
    category: 'media',
    desc: 'Stable Diffusion image generator',
    execute: async (message: any, conn: any, match: string) => {
        await message.react('❣️');
        if (!match) return message.reply('_Please provide a prompt_');
        const imageUrl = `https://api.siputzx.my.id/api/ai/stable-diffusion?prompt=${encodeURIComponent(match)}`;
        await message.reply('_Loading..._');

        await conn.sendMessage(message.user, {
            image: { url: imageUrl },
            caption: '**Diffuser**\nMade with ❣️',
        });
    },
});

