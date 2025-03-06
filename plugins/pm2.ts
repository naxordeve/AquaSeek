import { CreatePlug, getLang } from '../lib/index';

CreatePlug({
    command: ['reboot', 'kill'],
    category: 'admin',
    desc: 'Reboot the bot',
    fromMe: true,
    execute: async (message: any): Promise<void> => {
        const msgs = getLang();
        await message.reply(msgs.reboot_msg);
        const pm2 = await import('pm2');
        pm2.restart('AquaSeek');  
    },
});
