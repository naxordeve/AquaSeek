import axios from 'axios';
import * as cheerio from 'cheerio';
import { default as CreatePlug } from '../lib/index';

interface Track {
  url: string;
  title: string;
}

const search = async (query: string): Promise<Track[]> => {
  try {
    const { data } = await axios.get(`https://soundcloud.com/search?q=${query}`);
    const $ = cheerio.load(data);
    const ajg: string[] = [];
    $("#app > noscript").each((u, i) => {
      ajg.push($(i).html() || '');
    });
    
    const _$ = cheerio.load(ajg[1]);
    const results: Track[] = [];
    _$("ul > li > h2 > a").each((i, u) => {
      const href = $(u).attr("href") || '';
      if (href.split("/").length === 3) {
        const link = `https://soundcloud.com${href}`;
        const title = $(u).text().trim();
        results.push({ url: link, title: title || "No title" });
      }
    });

    return results.length ? results : [{ url: '', title: 'No results found' }];
  } catch (error) {
    console.error(error);
    return [{ url: '', title: 'Error occurred while searching' }];
  }
};

CreatePlug({
  command: 'cloudsearch',
  category: 'music',
  desc: 'Search for SoundCloud tracks',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply('Please provide a search term'));
    await message.react("✅");
    const results = await search(match);
    if (results[0]?.title === 'No results found') return;
    const voidi = results
      .map((track, index) => `${index + 1}. [${track.title}](${track.url})`)
      .join("\n");
    
    return void (await message.reply(voidi));
  }
});
  
