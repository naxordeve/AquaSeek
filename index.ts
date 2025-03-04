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
import { serialize } from './lib/index.ts';
import { commands } from './lib/index.ts';
import { getGoFileDownload } from './lib/auth';
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


const spkg = path.join(__dirname, 'lib', 'session', 'creds.json');
const pr = 'AquaSeek~';
async function auth(): Promise<void> {
    if (fs.existsSync(spkg)) {
    return;}
    if (!CONFIG.APP.SESSION_ID || !CONFIG.APP.SESSION_ID.startsWith(pr)) {
    console.log('_Valid session ID with AquaSeek~ prefix is required_');
    return; }
    const cdn = CONFIG.APP.SESSION_ID.replace(SESSION_PREFIX, '');
    try { const dl = await getGoFileDownload(cdn);
        if (!dl) {
            console.log('err');
            return;
        }
        const res = await fetch(dl);
        if (!res.ok) throw new Error(`${res.statusText}`);
        const fileBuffer = await res.arrayBuffer();
        const sessionDir = path.dirname(spkg);
        if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });
        fs.writeFileSync(sessionFilePath, Buffer.from(fileBuffer));
        console.log('Session saved');
    } catch (error) {
        console.error(error);
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
    getMessage: async (key: { remoteJid?: string; id?: string }): Promise<string | object | null> => {
    if (store) {
        const jid = key.remoteJid;
        const msg_id = key.id;
        if (jid && msg_id) {
            const chat = store.messages[jid];
            if (chat) {
                const msg = chat.get(msg_id);
                return (
                    msg?.message?.conversation ||
                    msg?.message?.extendedTextMessage?.text ||
                    msg?.message?.imageMessage?.caption ||
                    msg?.message?.videoMessage?.caption ||
                    msg?.message || 
                    null
                );
            }
        }
    }
    return null;
},

getGroupMetadata: async (jid: string): Promise<any | null> => {
    let metadata = cartel.get(jid);
    if (metadata) {
        return metadata;
    }try {
        metadata = await conn.groupMetadata(jid);
        cartel.set(jid, metadata);
        return metadata;
    } catch (error) {
        console.error(error);
        return null;
    }
}
  });

  store.bind(conn.ev);
  conn.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;
    msg.message = Object.keys(msg.message)[0] === 'ephemeralMessage' ? msg.message.ephemeralMessage.message : msg.message;
    const message = await serialize(msg, conn);
    if (!message || !message.key || !message.body) return;
    const x: string | undefined = message.key.remoteJid;
  if ( x && 
     message.sender !== x && ['protocolMessage', 'reactionMessage'].includes(message.type) && 
        x === 'status@broadcast') {
    if (!Object.keys(store.groupMetadata).length) {
    store.groupMetadata = await conn.groupFetchAllParticipating();
    }
  return;
}  if (CONFIG.APP.MODE === true && !message.isSelf) return;
    const mek = message.body.trim();
    const isCmd = mek.startsWith(CONFIG.APP.PREFIX.toLowerCase());
    const textt = mek.slice(CONFIG.APP.PREFIX.length).trim();
    if (mek.startsWith('$')) {
    if (!message.isSelf) return;
    try { const code: string = mek.slice(1);
    const Fek: unknown = await (async () => eval(code))();
    const result: string = typeof Fek === 'string' ? Fek : util.inspect(Fek);
    await message.reply(result);
  } catch (e) {
    const Mesa: string = util.format(e);
    await message.reply(Mesa);
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
