import { exec } from 'child_process';
import * as baileys from '@whiskeysockets/baileys';
import * as P from 'pino';
import * as canvafy from 'canvafy';
import * as path from 'path';
import * as util from 'util';
import { File } from 'megajs';
import * as fs from 'fs';
import * as http from 'http';
import { default as getPlugins } from './lib/index.ts';
import { serialize } from './lib/Message.ts';
import { commands } from './lib/index.ts';
import CONFIG from './config';
import useMongoAuthState from './lib/models/localdb';
import NodeCache from 'node-cache';
const store = baileys.makeInMemoryStore({ logger: P.default({ level: 'silent' }).child({ level: 'silent' }) });
const cartel = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

if (process.env.PLATFORM === 'koyeb') {
  http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>AquaSeek running 💦</h1>');
    } else {
      res.writeHead(404);
      res.end('not found');
    }
  }).listen(process.env.PORT || 8080, () => console.log(`running at http://localhost:${process.env.PORT || 8080}`));
}

async function auth(): Promise<void> {
  const credz = path.join(__dirname, 'lib', 'session', 'creds.json');
  if (!fs.existsSync(credz)) {
    if (!CONFIG.APP.SESSION_NAME) {
      console.log('_session_id required_');
      return;
    }
    const cxl = CONFIG.APP.SESSION_NAME;
    const mob = cxl.replace('Naxor~', '');
    try {
      const filer = File.fromURL(`https://mega.nz/file/${mob}`);
      const n = await filer.download();
      const chunks: Buffer[] = [];
      for await (const chunk of n) {
        chunks.push(chunk);
      }
      const buf = Buffer.concat(chunks);
      fs.writeFileSync(credz, buf);
      console.log('Session file saved');
    } catch (err) {
      console.error(err);
    }
  }
}
auth();

async function startBot(): Promise<void> {
  if (CONFIG.APP.MONGODB_URL && /mongo/.test(CONFIG.APP.MONGODB_URL)) {
    await useMongoAuthState(CONFIG.APP.MONGODB_URL);}
  const auth_creds = path.join(__dirname, 'lib', 'session');
  const { state, saveCreds } = await baileys.useMultiFileAuthState(auth_creds);
  const conn = baileys.makeWASocket({
    logger: P.default({ level: 'silent' }),
    printQRInTerminal: false,
    browser: baileys.Browsers.macOS('Chrome'),
    downloadHistory: false,
    syncFullHistory: false,
    generateHighQualityLinkPreview: 1,
    emitOwnEvents: true,
    auth: state,
    version: (await baileys.fetchLatestBaileysVersion()).version,
  });

  store.bind(conn.ev);

  conn.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    msg.message = Object.keys(msg.message)[0] === 'ephemeralMessage' ? msg.message.ephemeralMessage.message : msg.message;
    const message = await serialize(msg, conn);
    if (!message || !message.key || !message.body) return;

    if (CONFIG.APP.MODE === true && !message.isFromMe) return;
    const mek = message.body.trim();
    const isCmd = mek.startsWith(CONFIG.APP.PREFIX.toLowerCase());
    const textt = mek.slice(CONFIG.APP.PREFIX.length).trim();

    if (mek.startsWith('$')) {
      if (!message.isFromMe) return;
      try {
        const code = mek.slice(1);
        let Fek = await eval(`(async () => { ${code} })()`);
        if (typeof Fek !== "string") Fek = util.inspect(Fek);
        await message.reply(Fek);
      } catch (e) {
        message.reply(util.format(e));
      }
    }

    const match = isCmd ? mek.replace(new RegExp(`^${CONFIG.APP.PREFIX}\\S+`), '').trim() : mek;
    if (isCmd) {
      const pattern = new RegExp(`^(${CONFIG.APP.PREFIX})(\\S+)`);
      const commando = mek.match(pattern);
      if (commando) {
        const command = commando[2];
        const Func = commands.find((c) => c.command && c.command.toLowerCase() === command);
        if (Func) {
          try {
            await Func.execute(message, conn, match);
          } catch (err) {
            console.error(err);
          }
        }
      }
    }

    for (const Func of commands) {
      if (Func.on && Func.on === message.type) {
        try {
          await Func.execute(message, conn, match);
        } catch (err) {
          console.error(err);
        }
      }
    }
  });

  conn.ev.on("call", async (callUpdate) => {
    for (const call of callUpdate) {
      if (call.status === "offer") {
        await conn.updateCall({
          id: call.id,
          from: call.from,
          status: "reject"
        });
        if (!CONFIG.APP.CALL) {
          conn.sendMessage(call.from, { text: `_No calls please_` });
        }
      }
    }
  });

  conn.ev.on('connection.update', async (update) => {
    const { connection } = update;
    if (connection === 'open') {
      console.log('Connection established ✅');
      await getPlugins();
      console.log('AquaSeek is online now ✅');
      const v = `\`\`\`\n[ AquaSeek Configur ]\n------------------------\nVersion   : ${CONFIG.APP.VERSION}\nPrefix  : ${CONFIG.APP.PREFIX}\nMode : ${CONFIG.APP.MODE}\n------------------------\n\`\`\``;
      await conn.sendMessage(conn.user.id, { text: v });
    }
  });
}

setTimeout(startBot, 3000);
