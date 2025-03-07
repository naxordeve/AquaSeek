import { CreatePlug, getLang } from '../lib/index';
import axios from 'axios';

const tomeme = [
    'https://meme-api.com/gimme',
    'https://api.imgflip.com/get_memes',
    'https://some-random-api.com/meme', 
    'https://meme-api.deta.dev/' 
];

async function Getem(): Promise<{ url: string, title: string } | null> {
    for (const api of tomeme) {
        try {
            const { data } = await axios.get(api);
            if (api.includes('imgflip')) {
                const meme = data.data.memes[Math.floor(Math.random() * data.data.memes.length)];
                return { url: meme.url, title: meme.name };
            } else if (api.includes('some-random-api')) {
                return { url: data.image, title: 'Random Meme' };
            } else {
                return { url: data.url, title: data.title || 'Meme' };
            }
        } catch (err) {
          }
    }
    return null; 
}

CreatePlug({
    command: 'meme',
    category: 'fun',
    desc: 'Get a random meme from multiple sources',
    execute: async (message: any, conn: any, match: string): Promise<void> => {
        const meme = await Getem();
        const msgs = getLang();
        if (!meme) return void (await message.reply(msgs.error_msg));
        await conn.sendMessage(message.user, {
            image: { url: meme.url },
            caption: meme.title
        });
    },
});

CreatePlug({
    command: 'quote',
    category: 'fun',
    desc: 'Get a random quote',
    execute: async (message: any, conn: any, match: string): Promise<void> => {
            const res = await axios.get('https://api.quotable.io/random');
            const quote = `"${res.data.content}"\n- ${res.data.author}`;
            await message.reply(quote);
    }
});

CreatePlug({
    command: 'joke',
    category: 'fun',
    desc: 'Get a random joke',
    execute: async (message: any, conn: any, match: string): Promise<void> => {
            const css = await axios.get('https://official-joke-api.appspot.com/random_joke');
            const _joke = `${css.data.setup}\n\n${css.data.punchline}`;
            await message.reply(_joke);
            }
});

CreatePlug({
    command: 'hack',
    category: 'fun',
    desc: 'Fake hack someone for fun',
    execute: async (message: any, conn: any, match: string): Promise<void> => {
        const msgs = getLang();
        if (!match) return void (await message.reply(msgs.mention_user));
        await message.reply(msgs.wait_msg);
        setTimeout(async () => await message.reply(msgs.bypass), 2000);
        setTimeout(async () => await message.reply(msgs.pass), 4000);
        setTimeout(async () => await message.reply(msgs.send), 6000);
        setTimeout(async () => await message.reply(msgs.complete), 8000);
    },
});
