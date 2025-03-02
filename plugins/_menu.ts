import { commands, CreatePlug } from "../lib/index";
import { monospace } from "../lib/index";
import CONFIG from "../config";

CreatePlug({
  command: "menu",
  category: "general",
  desc: "types",
  execute: async (message: any, conn: any): Promise<void> => {
    await message.react("✅");
    if (!Array.isArray(commands)) return;
    const gorized: Record<string, string[]> = commands.reduce((acc: Record<string, string[]>, cmd: any) => {
      if (!cmd || !cmd.category || !cmd.command) return acc;
      if (!acc[cmd.category]) acc[cmd.category] = [];
      acc[cmd.category].push(cmd.command);
      return acc;
    }, {});

    const namo = (): string => {
      const now = new Date();
      const date = now.toLocaleDateString("en-ZA", { timeZone: "Africa/Johannesburg" });
      const time = now.toLocaleTimeString("en-ZA", { timeZone: "Africa/Johannesburg" });
      var toStar = "✧";
      return `╭──╼【 ${monospace(CONFIG.APP.BOTNAME.toUpperCase())} 】\n` +
             `┃ ${toStar} Prefix  : ${CONFIG.APP.PREFIX}\n` +
             `┃ ${toStar} User    : ${message.pushName}\n` +
             `┃ ${toStar} Mode    : ${CONFIG.APP.MODE}\n` +
             `┃ ${toStar} Date    : ${date}\n` +
             `┃ ${toStar} Time    : ${time}\n` +
             `┃ ${toStar} Version : ${CONFIG.APP.VERSION}\n` +
             `╰──────────╼`;
    };

    const _cxl = (category: string, cmds: string[]): string => {
      return `╭───╼【 *${monospace(category.toUpperCase())}* 】\n` +
             cmds.map((cmd) => `┃ ∘ \`\`\`${cmd.toLowerCase()}\`\`\``).join("\n") + "\n" +
             `╰──────────╼`;
    };

    let msg = namo() + "\n\n";
    for (const [category, cmds] of Object.entries(gorized)) {
      msg += _cxl(category, cmds) + "\n\n";
    }
    msg += `made with❣️`;
    const sent = await conn.sendMessage(message.user, { text: msg.trim() }, { quoted: message });
    if (!sent) {
      await message.reply("err");
    }
  },
});

CreatePlug({
  command: "list",
  category: "general",
  desc: "Displays all available commands.",
  execute: async (message: any, conn: any): Promise<void> => {
    if (!commands || typeof commands !== "object" || !Object.values(commands).length) return;
    const voidi =
      `╭─── *COMMANDS LIST* ─\n\n` +
      Object.values(commands)
        .map(({ command, desc }: any) => 
          `│ ✦ *${(command || "").toString().toLowerCase()}*\n│   ${desc || "No"}\n│\n`
        ).join("") +
      `╰──────`;

    await conn.sendMessage(message.user, { text: voidi.trim() }, { quoted: message });
  },
});

CreatePlug({
  command: "alive",
  category: "general",
  desc: "alive",
  execute: async (message: any, conn: any): Promise<void> => {
    const platform = process.platform;
    const uptime = process.uptime();
    const usage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const status = `\`\`\`
Bot Status:

Platform: ${platform}
Uptime: ${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s
Memory Usage: ${usage}MB\n\nMade with💦
\`\`\``;

    await conn.sendMessage(message.user, { text: status }, { quoted: message });
  },
});

CreatePlug({
  command: "ping",
  category: "general",
  desc: "latency",
  execute: async (message: any, conn: any): Promise<void> => {
    const start = Date.now();
    await message.reply("ping");
    const end = Date.now();
    await message.react("✅");
    await conn.sendMessage(message.user, { text: `\`\`\`Pong! ${end - start}ms\`\`\`` });
  },
});
        
