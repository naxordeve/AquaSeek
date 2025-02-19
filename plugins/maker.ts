import { CreatePlug } from '../lib/index';

CreatePlug({
  command: 'neonglitch',
  category: 'tools',
  desc: 'Generate a neon glitch text image',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    const maker = match;
    if (!maker) return void (await message.reply("Please provide text to generate a neon glitch image"));
    await message.react("✅");
    const api = `https://vapis.my.id/api/neonglitch?q=${maker}`;
    await conn.sendMessage(message.user, { image: { url: api }, caption: "*Here is your neon glitch*" });
  },
});

CreatePlug({
  command: 'flag3dtext',
  category: 'tools',
  desc: 'Generate a 3D flag text image',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply("Please provide text to generate a 3D flag image"));
    await message.react("✅");
    const api = `https://vapis.my.id/api/flag3dtext?q=${match}`;
    await conn.sendMessage(message.user, { image: { url: api }, caption: "*Here is your 3D flag*" });
  },
});

CreatePlug({
  command: 'pixelglitch',
  category: 'tools',
  desc: 'Generate a pixel glitch text image',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply("Please provide text to generate a pixel glitch image"));
    await message.react("✅");
    const api = `https://vapis.my.id/api/pixelglitch?q=${match}`;
    await conn.sendMessage(message.user, { image: { url: api }, caption: "*Here is your pixel glitch*" });
  },
});

CreatePlug({
  command: 'logomaker',
  category: 'tools',
  desc: 'Generate a logo with your input text',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply("Please provide text to generate a logo"));
    await message.react("✅");
    const api = `https://vapis.my.id/api/logomaker?q=${match}`;
    await conn.sendMessage(message.user, { image: { url: api }, caption: "*Here is your logo*" });
  },
});

CreatePlug({
  command: 'writetext',
  category: 'tools',
  desc: 'Generate an image with your input text written on it',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply("Please provide text to generate an image"));
    await message.react("✅");
    const api = `https://vapis.my.id/api/writetext?q=${match}`;
    await conn.sendMessage(message.user, { image: { url: api }, caption: "*Here is your text*" });
  },
});

CreatePlug({
  command: 'sandsummer',
  category: 'tools',
  desc: 'Generate a sand summer text image with your input',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply("Please provide text to generate a sand summer image"));
    await message.react("✅");
    const api = `https://vapis.my.id/api/sandsummer?q=${match}`;
    await conn.sendMessage(message.user, { image: { url: api }, caption: "*Here is your sand summer*" });
  },
});
