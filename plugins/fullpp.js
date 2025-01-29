const { CreatePlug } = require('../lib/commands');
const Jimp = require('jimp');

CreatePlug({
  command: 'fullpp',
  category: 'owner',
  desc: 'fullpp profile',
  execute: async (message, conn, match) => {
    if (!message.isFromMe) return;
    if (!message.quoted || message.quoted.type !== 'imageMessage') return message.reply('_Please provide an image_');
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

    return message.reply('Profile picture updated successfully');
  },
});
