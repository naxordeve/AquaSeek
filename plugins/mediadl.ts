import { CreatePlug, getLang, extractUrlFromText } from '../lib/index';
import { Func } from './functions/media';
import tiktokdl from './functions/tiktokdl';
import LeptonAPI from './functions/LeptonAPI';

CreatePlug({
  command: 'lepton',
  category: 'Artificial',
  desc: 'lepton ai',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    const msgs = getLang();
    if (!match) return void (await message.reply(msgs.gpt_msg));
    await message.react("✅");
    const apiKey = 'jawa';
    const lepton = new LeptonAPI(apiKey);
    const result = await lepton.getResult(match);
    if (result) {
      const res = `*\n\n${result.answer}\n\n*Sources:*\n${result.sources
        .map((source: any, index: number) => `${index + 1}. [${source.name}](${source.url})`)
        .join('\n')}`;
      return void (await message.reply(res));
    }
  },
});

CreatePlug({
  command: 'tiktok',
  category: 'download',
  desc: 'Download TikTok videos',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    const msgs = getLang();
    match = extractUrlFromText(match || message.message?.conversation); 
    if (!match) return void (await message.reply(msgs.tiktok_mgs));
    await message.react("✅");
    const videos = await tiktokdl(match).catch((error: Error) => message.reply(`${error.message}`));
    if (videos) {
      await conn.sendMessage(message.user, {
        video: { url: videos.hdVideoUrl },
        caption: `*Title:* ${videos.title}\n *Music*: ${videos.musicAuthor}\nMade with❣️`,
      }).catch((error: Error) => message.reply(`${error.message}`));
    }
  },
});

CreatePlug({
  command: 'instagram',
  category: 'download',
  desc: 'Download Instagram videos',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    const msgs = getLang();
    match = extractUrlFromText(match || message.message?.conversation); 
    if (!match) return void (await message.reply(msgs.instagram_msg));
    await message.react("✅");
    const result = await Func(match, 'instagram');
    if (result.platform === 'instagram' && result.mediaUrl) {
      await conn.sendMessage(message.user, {
        video: { url: result.mediaUrl },
        caption: `*Insta*\nMade with❣️`,
      });
    }
  },
});
                             
