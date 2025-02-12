var { CreatePlug } = require('../lib/commands');
var fetch = require('node-fetch');
const { getBuffer, AddMetaData } = require('./functions/functions');

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
        if (!avoidi.length) return;
        let toBuffer = avoidi[0]; 
        let toBuffu = `https://diegoson-naxordeve.hf.space/tubidy/dl?url=${toBuffer.link}`;
        let get = await fetch(toBuffu);
        let toAudio = await get.json();
        if (!toAudio.media || !toAudio.media.length) return;
        let naxor_api = toAudio.media.find(m => m.type === 'download')?.link;
        if (!naxor_api) return;
      //  let cover = await getBuffer(toBuffer.thumbnail);
        //let toMetadata = await AddMetaData(naxor_api, toBuffer.title, toBuffer.author);
        await conn.sendMessage(message.user, { 
            audio: { url: naxor_api }, 
            mimetype: 'audio/mpeg', 
            fileName: `${toBuffer.title}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: toBuffer.title,
                    body: `${toBuffer.duration}`, 
                    thumbnailUrl: toBuffer.thumbnail, 
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    mediaUrl: toBuffer.link,  
                    sourceUrl: toBuffer.link 
                }
            }
        });
    }
});

      
CreatePlug({
    command: 'video',
    category: 'download',
    desc: 'Download videos',
    execute: async (message, conn, match) => {
        if (!match) return message.reply('_Please provide a video name eg video hope by xxx_');
        let ytdl = `https://diegoson-naxordeve.hf.space/tubidy/search?q=${match}`;
        let res = await fetch(ytdl);
        let results = await res.json();
        if (!results.length) return;
        let voidi = results[0];
        let vidl = `https://diegoson-naxordeve.hf.space/tubidy/dl?url=${voidi.link}`;
        let res2 = await fetch(vidl);
        let data = await res2.json();
        if (!data.media || !data.media.length) return;
        let dlink = data.media.find(m => m.type === 'download')?.link;
        if (!dlink) return;
        await conn.sendMessage(message.user, { 
            video: { url: dlink }, 
            mimetype: 'video/mp4', 
            fileName: `${voidi.title}.mp4`,
            contextInfo: {
                externalAdReply: {
                    title: voidi.title,
                    body: `${voidi.duration}`,  
                    thumbnailUrl: voidi.thumbnail, 
                    mediaType: 1,
                    mediaUrl: voidi.link,  
                    sourceUrl: voidi.link  
                }
            }
        });
    }
});
    
