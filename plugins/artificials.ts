import { CreatePlug } from '../lib/commands';
import { ChatGPT, GeminiAI } from './functions/gpt';
import { Yousearch, BlackBox, AoyoContent, Venice, Mistral } from './functions/naxor';
import { getMorphic } from './functions/morphic';
import { Diffuser } from './functions/diffuser';

CreatePlug({
  command: 'diffuser',
  category: 'Artificial',
  desc: 'Generate an image based on a prompt',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (message.reply('Please provide a prompt'));
    return void (await message.react("✅"));
    const voidi = await Diffuser(match);
    await conn.sendMessage(message.user, { image: voidi, caption: 'Diffuser\nMade with❣️' });
  }
});

CreatePlug({
  command: 'morphic',
  category: 'Artificial',
  desc: 'morphic ai hehe',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (message.reply('_Need a prompt_'));
    return void (await message.react("✅"));
    const voidi = await getMorphic(match);
    if (voidi.error) return void (await message.reply(` ${voidi.error}`));
    const _msg = `\n\n**${voidi.result}**\n\n**${voidi.related.join('\n')}**`;
    return void (await message.reply(_msg));
  }
});

CreatePlug({
  command: 'gemini',
  category: 'Artificial',
  desc: 'Ask Gemini AI anything',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply('_Please provide a query_'));
    return void (await message.react("✅"));
    const voidi = await GeminiAI(match);
    return void (await message.reply(voidi));
  }
});

CreatePlug({
  command: 'ai',
  category: 'Artificial',
  desc: 'Ask ChatGPT anything',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply('_Please provide a prompt_'));
    return void (await message.react("✅"));
    const voidi = await ChatGPT(match);
    return void (await message.reply(voidi));
  }
});

CreatePlug({
  command: 'yousearch',
  category: 'Artificial',
  desc: '',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply('Please provide a query'));
    return void (await message.react("✅"));
    const voidi = await Yousearch(match);
    return void (await message.reply(voidi));
  }
});

CreatePlug({
  command: 'venice',
  category: 'Artificial',
  desc: 'Interact with the Venice AI',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply('Please provide a prompt'));
    return void (await message.react("✅"));
    const voidi = await Venice(match);
    return void (await message.reply(voidi));
  }
});

CreatePlug({
  command: 'blackbox',
  category: 'Artificial',
  desc: 'bbb_',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply('_Please provide content_'));
    return void (await message.react("✅"));
    const voidi = await BlackBox(match);
    return void (await message.reply(voidi));
  }
});

CreatePlug({
  command: 'mistral',
  category: 'Artificial',
  desc: 'Interact with the Mistral-7B Instruct',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply('Please provide content'));
    return void (await message.react("✅"));
    const res = await Mistral(match);
    return void (await message.reply(res));
  }
});
