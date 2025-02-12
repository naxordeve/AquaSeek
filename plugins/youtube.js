var { CreatePlug } = require('./lib/commands');
var fetch = require('node-fetch');

CreatePlug({
    command: 'song',
    category: 'download',
    desc: 'Download songs',
    execute: async (message, conn, match) => {
        if (!match) return message.reply('_Please provide a song name_');
        await message.react("✅");
        let find = `https://diegoson-naxordeve.hf.space/tubidy/search?q=${match}`;
        let x = await fetch(find);
        let avoidi = await x.json();
        if (!avoidi.length) return message.reply('_No results found_');
        let toBuffer = avoidi[0];
        let toBuffu = `https://diegoson-naxordeve.hf.space/tubidy/dl?url=${toBuffer.link}`;
        let get = await fetch(toBuffu);
        let toAudio = await get.json();
        if (!toAudio.media || !toAudio.media.length) return;
        let naxor_api = toAudio.media.find(m => m.type === 'download')?.link;
        if (!naxor_api) return;
        await conn.sendMessage(message.user, { 
            audio: { url: naxor_api }, 
            mimetype: 'audio/mpeg', 
            fileName: `${find.title}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: find.title,
                    body: `Duration: ${find.duration}`, 
                    thumbnailUrl: find.thumbnail, 
                    mediaType: 1,
                    renderLargerThumbnailUrl: true,
                    mediaUrl: find.link,  
                    sourceUrl: find.link 
                }
            }
        });
    }
});
      
    
