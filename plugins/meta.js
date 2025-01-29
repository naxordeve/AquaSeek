const { CreatePlug } = require('../lib/commands');
const { Func } = require('./functions/media');
const tiktokdl = require('./functions/tiktokdl'); 
const LeptonAPI = require('./functions/LeptonAPI'); 

CreatePlug({
  command: 'lepton', 
  category: 'Artficial',
  desc: 'lepton ai',
  execute: async (message, conn, match) => {
    await message.react('❣️'); 
    if (!match) return message.reply('Please provide a prompt'); 
    const apiKey = 'jawa'; 
    const lepton = new LeptonAPI(apiKey);
    const result = await lepton.getResult(match);
    if (result) {
      const res = `*\n\n${result.answer}\n\n*Sources:*\n${result.sources
        .map((source, index) => `${index + 1}. [${source.name}](${source.url})`)
        .join('\n')}`;
      return message.reply(res);
    } 
  },
});

CreatePlug({
  command: 'tiktok',
  category: 'download',
  desc: 'Download TikTok videos',
  execute: async (message, conn, match) => {
    await message.react('❣️');
    if (!match) return message.reply('_Please provide a TikTok URL_');
    const videos = await tiktokdl(match).catch(error => message.reply(`${error}`));
    await conn.sendMessage(message.user, { video: { url: videos.hdVideoUrl }, caption: `*Title:* ${videos.title}\n *Music*: ${videos.musicAuthor}\nMade with❣️`, }).catch(error => message.reply(`${error}`));
  },
});

CreatePlug({
  command: 'instagram',
  category: 'download',
  desc: 'Download Instagram videos',
  execute: async (message, conn, match) => {
    await message.react('❣️');
    if (!match) return message.reply('_Please provide an Instagram video URL_');
    const result = await Func(match, 'instagram');
    if (result.platform === 'instagram' && result.mediaUrl) {
      await conn.sendMessage(message.user, {
        video: { url: result.mediaUrl },
        caption: `*Insta*\nMade with❣️`,
      });
    } else {}
  },
});
