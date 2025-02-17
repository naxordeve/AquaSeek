import { CreatePlug } from '../lib/commands';
import { searchPinterest, searchWikipedia } from './functions/Pinterest';
import BingSearch from './functions/Bingsearch';
import fetch from 'node-fetch';
import TinyURL from './functions/tny';

CreatePlug({
  command: 'tinyurl',
  category: 'tools',
  desc: 'Shorten a URL using TinyURL API',
  execute: async (message: any, conn: any, match: string) => {
    if (!match) return message.reply("Please provide a url");
    const tin = new TinyURL('https://api.diioffc.web.id/api/tools/tinyurl?url=');
    const msg = await tin.shortenUrl(match);
    await message.reply(`*Here it Is*:\n ${msg}`);
  },
});

CreatePlug({
  command: 'bingsearch',
  category: 'search',
  desc: 'Searches via bing for a given query',
  execute: async (message: any, conn: any, match: string) => {
    if (!match) return message.reply('You need to provide a query to search');
    const voidi = new BingSearch('https://apiikann.vercel.app/api/bingsrc?q=');
    const results = await voidi.Res(match);
    if (results.length === 0) return;
    const exec = results.map((result: any, i: number) => 
      `*${i + 1}. ${result.title}*\n_${result.link}_\n${result.snippet}`
    ).join('\n\n');
    message.reply(`*Bing Search:*\n\n${exec}\n\nMade with❣️`);
  }
});

CreatePlug({
  command: 'wpkid',
  category: 'search',
  desc: 'Searches Wikipedia for a given query',
  execute: async (message: any, conn: any, match: string) => {
    const query = match;
    if (!query) return message.reply('_Please provide a search query_');
    const wiki = await searchWikipedia(query);
    await message.reply(wiki);
  }
});

CreatePlug({
  command: 'searchpint',
  category: 'search',
  desc: 'Search on Pinterest by a query',
  execute: async (message: any, conn: any, match: string) => {
    await message.react('❣️');
    if (!match) return message.reply('_Please provide a query to search for_');
    const voidi = await searchPinterest(match);
    await message.reply('Loading...');
    if (voidi.error) return message.reply(`${voidi.error}`);
    if (voidi.length === 0) return;
    for (const { caption, fullName, followers, image, source } of voidi.slice(0, 3)) {
      await conn.sendMessage(message.user, {
        image: { url: image },
        caption: `**Caption**: ${caption}\n**Uploaded by**: ${fullName}\n**Followers**: ${followers}\n**Source**: ${source}\n\nMade with❣️`
      });
    }
  }
});
