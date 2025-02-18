import { CreatePlug } from '../lib/commands';

CreatePlug({
  command: 'neonglitch',
  category: 'tools',
  desc: 'Generate a neon glitch text image',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    await message.react('🤗');
    const maker = match;
    if (!maker) return message.reply("Please provide text to generate a neon glitch image");
    const api = `https://vapis.my.id/api/neonglitch?q=${maker}`;
    await conn.sendMessage(message.user, { image: { url: api }, caption: "*Here is your neon glitch*" });
  },
});

CreatePlug({
  command: 'flag3dtext',
  category: 'tools',
  desc: 'Generate a 3D flag text image',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return message.reply("Please provide text to generate a 3D flag image");
    const api = `https://vapis.my.id/api/flag3dtext?q=${match}`;
    await conn.sendMessage(message.user, { image: { url: api }, caption: "*Here is your 3D flag*" });
  },
});

CreatePlug({
  command: 'pixelglitch',
  category: 'tools',
  desc: 'Generate a pixel glitch text image',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return message.reply("Please provide text to generate a pixel glitch image");
    const api = `https://vapis.my.id/api/pixelglitch?q=${match}`;
    await conn.sendMessage(message.user, { image: { url: api }, caption: "*Here is your pixel glitch*" });
  },
});

CreatePlug({
  command: 'logomaker',
  category: 'tools',
  desc: 'Generate a logo with your input text',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return message.reply("Please provide text to generate a logo");
    const api = `https://vapis.my.id/api/logomaker?q=${match}`;
    await conn.sendMessage(message.user, { image: { url: api }, caption: "*Here is your logo*" });
  },
});

CreatePlug({
  command: 'writetext',
  category: 'tools',
  desc: 'Generate an image with your input text written on it',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return message.reply("Please provide text to generate an image");
    const api = `https://vapis.my.id/api/writetext?q=${match}`;
    await conn.sendMessage(message.user, { image: { url: api }, caption: "*Here is your text*" });
  },
});

CreatePlug({
  command: 'sandsummer',
  category: 'tools',
  desc: 'Generate a sand summer text image with your input',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return message.reply("Please provide text to generate a sand summer image");
    const api = `https://vapis.my.id/api/sandsummer?q=${match}`;
    await conn.sendMessage(message.user, { image: { url: api }, caption: "*Here is your sand summer*" });
  },
});
