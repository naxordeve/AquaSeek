import { CreatePlug, getLang } from '../lib/index';
import { exec } from 'child_process';

CreatePlug({
    command: ['update', 'up'],
    category: 'admin',
    desc: 'Update bot from Git',
    fromMe: true,
    execute: async (message: any, conn: any, match: string): Promise<void> => {
        if(!message.isSelf) return;
        const msgs = getLang();
        await message.reply(msgs.update);
        exec('git pull', async (err, stdout, stderr) => {
            if (err) {
              await message.reply(msgs.error_msg);
                exec(`git pull https://github.com/naxordeve/AquaSeek.git master`, (fallbackErr, fallbackOut, fallbackErrOut) => {
                    if (fallbackErr) { message.reply(`${fallbackErrOut}`);
                    } else {
                        message.reply(`\n${fallbackOut}`);
                        exec('pm2 restart aquaseek');
                    }
                });
            } else {
                message.reply(`_Updated Dun:_\n${stdout}`);
                exec('pm2 restart aquaseek');
            }
        });
    },
});

CreatePlug({
    command: ['reboot', 'kill'],
    category: 'admin',
    desc: 'Reboot the bot',
    fromMe: true,
    execute: async (message: any): Promise<void> => {
        if(!message.isSelf) return;
        const msgs = getLang();
        await message.reply(msgs.reboot_msg);
        const pm2 = await import('pm2');
        pm2.restart('aquaseek');  
    },
});

CreatePlug({
    command: ['pm2status', 'pm2s'],
    category: 'admin',
    desc: 'Show PM2 process status',
    fromMe: true,
    execute: async (message: any, conn: any, match: string): Promise<void> => {
        if(!message.isSelf) return;
        const pm2 = await import('pm2');
        pm2.list((err, processList) => {
            const status = processList.map(proc => `${proc.name}: ${proc.pm2_env?.status}`).join('\n');
            message.reply(`${status}`);
        });
    },
});

CreatePlug({
    command: 'disk',
    category: 'admin',
    desc: 'Check server disk usage',
    fromMe: true,
    execute: async (message: any, conn: any, match: string): Promise<void> => {
        if(!message.isSelf) return;
        exec('df -h', (err, stdout) => {
            message.reply(`*_Disk usage:_*\n${stdout}`);
        });
    },
});
    
