import { CreatePlug } from '../lib/index';
import * as Jimp from 'jimp';

CreatePlug({
  command: 'fullpp',
  category: 'owner',
  desc: 'fullpp profile',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!message.isFromMe) return;
    if (!message.quoted || !message.quoted.message.imageMessage) {
      return void (await message.reply('_Please provide an image_'));
    }
    await message.react("✅");
    const sk = await message.quoted.download();
    const v = await Jimp.read(sk);
    const min = v.getWidth();
    const max = v.getHeight();
    const c = v.clone().crop(0, 0, min, max);
    const s = await c.scaleToFit(720, 720);
    const proUrl = await s.getBufferAsync(Jimp.MIME_JPEG);
    await conn.query({
      tag: 'iq',
      attrs: {
        to: '@s.whatsapp.net',
        type: 'set',
        xmlns: 'w:profile:picture',
      },
      content: [
        {
          tag: 'picture',
          attrs: {
            type: 'image',
          },
          content: proUrl,
        },
      ],
    });

    return void (await message.reply('_Profile picture updated_'));
  },
});
