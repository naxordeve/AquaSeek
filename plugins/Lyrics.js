var {CreatePlug} = require('../lib/commands');
var fetch = require('node-fetch');

CreatePlug({
    command: 'lyrics',
    category: 'search',
    desc: 'lyrics based on the query',
    execute: async (message, conn, match) => {
        if (!match) return message.reply('_Please provide a song name_');
        const voidi = await fetch(`https://diegoson-naxordeve.hf.space/api/lyrics?q=${match}`);
        const data = await voidi.json();
        if (!data?.[0]) return;
        const song = data[0]; 
        const Messagei = `🎶 *${song.trackName}* by *${song.artistName}*\n\n${song.plainLyrics}`;
        message.reply(Messagei);
    }
});
          
