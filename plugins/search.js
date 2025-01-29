const { CreatePlug } = require('../lib/commands');
const { getSpotifyBangers, getAppRuntime } = require('./functions/apis'); 
const { searchPinterest,searchWikipedia } = require('./functions/Pinterest'); 
const BingSearch = require('./functions/Bingsearch');
const fetch = require('node-fetch');
const TinyURL = require('./functions/tny');

CreatePlug({
    command: 'toclass',
    category: 'Utility',
    execute: async (message, conn, match) => {
        await message.react('🗣️');
        if (!match) return message.reply('_Please provide a code_');
        const rv_v = (code) => {
            const exec = code.trim().split('\n');
            let inTry = false, ctr = '', ctm = '', ctc = '';
            exec.forEach((line) => {
                const get = line.trim();
                if (get.startsWith('try {')) { inTry = true; return; }
                if (inTry && get === '}') { inTry = false; return; }
                if (!inTry) {
                    if (/^(let|const|var)\s+\w+\s*=/.test(get)) ctr += `this.${get.replace(/^(let|const|var)\s+/, '')}\n`;
                    else if (/^function\s+\w+\s*\(.*\)\s*{/.test(get)) ctm += `${get.replace('function ', '')}\n`;
                    else if (/^const\s+\w+\s*=\s*\(.*\)\s*=>\s*{/.test(get)) {
                        const namo = get.match(/^const\s+(\w+)/)[1];
                        const Object = get.replace(/^const\s+\w+\s*=\s*/, '');
                        ctm += `${namo} ${Object}\n`;
                    } else ctc += `${line}\n`;
                }
            });
            return `class ChangeThis{constructor(){${ctr}}${ctm}execute(){${ctc}}}`;
        }; try {
            const mode = rv_v(match);
            await conn.sendMessage(message.user, { text: mode });
        } catch (error) {
            console.error(error);
        }
    }
});

CreatePlug({
  command: 'convertjs',
  category: 'Utility',
  execute: async (message, conn, match) => {
   await message.react('👍');
    if (!match) return message.reply("_Please provide CommonJS code. eg: *convertjs const fs = require('fs');_");
    const voidi = match
      .replace(/const (.+) = require\((['"`].+['"`])\);/g, 'import $1 from $2;')
      .replace(/module\.exports\s*=\s*(.+);/, 'export default $1;')
      .replace(/exports\.(.+)\s*=\s*(.+);/g, 'export const $1 = $2;');
    await conn.sendMessage(message.user, { text: `\n\n\`\`\`javascript\n${voidi}\n\`\`\`` });
  },
});

CreatePlug({
  command: 'tinyurl',
  category: 'tools',
  desc: 'Shorten a URL using TinyURL API',
  execute: async (message, conn, match) => {
    await message.react('🗣️');
    if (!match) return message.reply("Please provide a url");
    const tin = new TinyURL(`https://api.diioffc.web.id/api/tools/tinyurl?url=`);
    const msg = await tin.shortenUrl(match);
    await message.reply(`*Here it Is*:\n ${msg}`);
  },
});
        
CreatePlug({
  command: 'bingsearch',
  category: 'search',
  desc: 'Searches via bing for a given query',
  execute: async (message, conn, match) => {
    await message.react('🗣️');
    if (!match) return message.reply('You need to provide a query to search');
    const voidi = new BingSearch('https://apiikann.vercel.app/api/bingsrc?q=');
    const results = await voidi.Res(match);
    if (results.length === 0) return;
    const exec = results.map((result, i) => `*${i + 1}. ${result.title}*\n_${result.link}_\n${result.snippet}`).join('\n\n');
    message.reply(`*Bing Search:*\n\n${exec}\n\nMade with❣️`);
  }
});

CreatePlug({
  command: 'wpkid',
  category: 'search',
  desc: 'Searches Wikipedia for a given query',
  execute: async (message, conn, match) => {
    const query = match; 
    await message.reply('🗣️');
    if (!query) return  message.reply('_Please provide a search query_')
    const wiki = await searchWikipedia(query)
    await message.reply(wiki);
  }
});


CreatePlug({
  command: 'searchpint',
  category: 'search',
  desc: 'Search on Pinterest by a query',
  execute: async (message, conn, match) => {
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

CreatePlug({
command: 'findSpotify',
category: 'search',
desc: 'Fetches Spotify tracks based on a query',
execute: async (message, conn, match) => {
  await message.react('🎵');
  if (!match) return message.reply('Provide a query to search for tracks');
  const tracks = await getSpotifyBangers(match);
  if (tracks.length === 0) return;
  const voidi = tracks.map(track => 
    `*SPOTIFY MUSIC SEARCH*\n\n*${track.songTitle}*\n*Artist*: ${track.artist}\n*Album*: ${track.album}\n*Duration*: ${track.length}\n*Url*: ${track.link}\n\nMade with❣️`
  ).join('\n\n');
  await conn.sendMessage(message.user, {
    text: voidi,
    contextInfo: {
      externalAdReply: {
        title: 'Spotify Track Search',
        body: `Found ${tracks.length} track(s)`,
        thumbnailUrl: tracks[0].thumbnail || '', 
        mediaType: 2,
        mediaUrl: tracks[0].link, 
        sourceUrl: 'https://spotify.com',
      },
    },
  });
},});

CreatePlug({
  command: 'runtime',
  category: 'mics',
  desc: 'Displays the app runtime',
  execute: async (message, conn) => {
    await message.react('⏳');
    const { runtime } = await getAppRuntime();
    await message.reply(`*Runtime: ${runtime}*`);
  },
});
    
