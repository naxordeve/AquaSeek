const { commands, CreatePlug } = require('../lib/commands');
const { monospace } = require('../lib/monospace');
const CONFIG = require('../config');

CreatePlug({
    command: 'menu',
    category: 'general',
    desc: 'types',
    execute: async (message, conn) => {
        await message.react('✅');
        if (!Array.isArray(commands)) return;
        const gorized = commands.reduce((acc, cmd) => {
            if (!cmd || !cmd.category || !cmd.command) return acc; // Skip invalid commands
            if (!acc[cmd.category]) acc[cmd.category] = [];
            acc[cmd.category].push(cmd.command);
            return acc;
        }, {});

        const namo = () => {
            const now = new Date();
            const date = now.toLocaleDateString('en-ZA', { timeZone: 'Africa/Johannesburg' });
            const time = now.toLocaleTimeString('en-ZA', { timeZone: 'Africa/Johannesburg' });

            return `╭──╼【 ${monospace((CONFIG.app.botname || 'BOT').toUpperCase())} 】\n` +
                   `┃ ✦ Prefix  : ${CONFIG.app.prefix}\n` +
                   `┃ ✦ User    : ${message.pushName}\n` +
                   `┃ ✦ Mode    : ${process.env.MODE}\n` +
                   `┃ ✦ Date    : ${date}\n` +
                   `┃ ✦ Time    : ${time}\n` +
                   `┃ ✦ Version : ${CONFIG.app.version}\n` +
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
    desc: 'Display commands list_',
    execute: async (message, conn) => {
        await message.react('✅');
        if (!Array.isArray(commands)) return;
        let _cmd = `\`\`\`*Commands:*\n\n\`\`\``;
        commands.forEach(cmd => {
        _cmd += `\`\`\`∘ ${cmd.command.toLowerCase()}\n\n${cmd.desc}\n\`\`\``;});
        const sent = await conn.sendMessage(message.user, { text: _cmd.trim() }, { quoted: message });
        if (!sent) {
            await message.reply('err');
        }
    }
});

                                                                                 
