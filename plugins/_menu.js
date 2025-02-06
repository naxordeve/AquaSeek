const { commands, CreatePlug } = require('../lib/commands');
const { monospace } = require('../lib/fancy');
const CONFIG = require('../config');

CreatePlug({
    command: 'menu',
    category: 'general',
    desc: 'types',
    execute: async (message, conn) => {
        await message.react('✅');
        if (!Array.isArray(commands)) return;
        const gorized = commands.reduce((acc, cmd) => {
            if (!cmd || !cmd.category || !cmd.command) return acc; 
            if (!acc[cmd.category]) acc[cmd.category] = [];
            acc[cmd.category].push(cmd.command);
            return acc;
        }, {});

        const namo = () => {
            const now = new Date();
            const date = now.toLocaleDateString('en-ZA', { timeZone: 'Africa/Johannesburg' });
            const time = now.toLocaleTimeString('en-ZA', { timeZone: 'Africa/Johannesburg' });

            return `╭──╼【 ${monospace((CONFIG.APP.BOTNAME).toUpperCase())} 】\n` +
                   `┃ ✦ Prefix  : ${CONFIG.APP.PREFIX}\n` +
                   `┃ ✦ User    : ${message.pushName}\n` +
                   `┃ ✦ Mode    : ${CONFIG.APP.MODE}\n` +
                   `┃ ✦ Date    : ${date}\n` +
                   `┃ ✦ Time    : ${time}\n` +
                   `┃ ✦ Version : ${CONFIG.APP.VERSION}\n` +
                   `╰──────────╼`;
        };

        const _cxl = (category, cmds) => {
            return `╭───╼【 *${monospace(category.toUpperCase())}* 】\n` +
                   cmds.map(cmd => `┃ ∘ \`\`\`${cmd.toLowerCase()}\`\`\``).join('\n') + '\n' +
                   `╰──────────╼`;
        };

       let msg = namo() + '\n\n';
        for (const [category, cmds] of Object.entries(gorized)) {
            msg += _cxl(category, cmds) + '\n\n';}
        msg += `made with❣️`;
        const sent = await conn.sendMessage(message.user, { text: msg.trim() }, { quoted: message });
        if (!sent) {
            await message.reply('err');
        }
    }
});

CreatePlug({
    command: 'list',
    category: 'general',
    desc: 'Displays all available commands.',
    execute: async (message, conn) => {
        await message.react('✅');
        if (!commands?.length) return;
        const voidi = `╭─── *COMMANDS LIST* ─\n\n` + 
            Object.values(commands).reduce((acc, { command, desc }) => 
                acc + `│ ✦ *${command.toLowerCase()}*\n│   ${desc}\n│\n`, '') + 
            `╰─`;
        await conn.sendMessage(message.user, { text: voidi.trim() }, { quoted: message });
    }
});



CreatePlug({
    command: 'alive',
    category: 'general',
    desc: 'alive',
    execute: async (message, conn) => {
        await message.react('✅');
        const platform = process.platform;
        const runtime = process.version;
        const uptime = process.uptime();
        const usage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const status = `\`\`\`
Bot Status:

Platform: ${platform}
Uptime: ${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s
Memory Usage: ${usage}MB\n\nMade with❣️
\`\`\``;
        await conn.sendMessage(message.user, { text: status }, {quoted: message});
    }
});                     

CreatePlug({
    command: 'ping',
    category: 'general',
    desc: 'latency',
    execute: async (message, conn) => {
        const start = Date.now();
        await message.reply('ping');
        const end = Date.now();
        await message.react('✅');
        await conn.sendMessage(message.user, { text: `\`\`\`Pong! ${end - start}ms\`\`\`` });
    }
});

    
