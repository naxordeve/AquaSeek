import { CreatePlug, getLang } from '../lib/index';
import axios from 'axios';

CreatePlug({
    command: 'scrape',
    category: 'tools',
    desc: 'Scrape webpage',
    fromMe: false,
    execute: async (message: any, conn: any, match: string): Promise<void> => {
        const msgs = getLang();
        if (!match) return void (await message.reply(msgs.scrape_msg));
        const web = `https://api.api-ninjas.com/v1/webscraper?url=${match}`;
        const res = await axios.get(web, {
            headers: {
                'X-Api-Key': 'hm/Y7uty6y6wo7Q1N0zcKA==ci0qEajTnrXHHzEQ'
            }});
        const data = res.data;
        if (data && data.content) {
            const p = data.content.slice(0, 400);  
            await message.reply(`${p}${data.content.length > 400 ? '...' : ''}`);
        } else {
            await message.reply(msgs.notfound_msg);
        }
    },
});
  
