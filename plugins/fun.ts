import { CreatePlug, getLang } from '../lib/index';
import axios from 'axios';

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
