const { CreatePlug } = require('../lib/commands');
const CONFIG = require('../config');


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
    category: 'Utility',
    desc: 'latency',
    execute: async (message, conn) => {
        const start = Date.now();
        const end = Date.now();
        await message.react('✅');
        await conn.sendMessage(message.user, { text: `\`\`\`Pong! ${end - start}ms\`\`\`` });
    }
});

