const { exec } = require('child_process');
const { makeWASocket, fetchLatestBaileysVersion, useMultiFileAuthState, makeInMemoryStore, Browsers } = require('@whiskeysockets/baileys');
const P = require('pino');
const canvafy = require("canvafy");
const path = require('path');
const util = require('util');
const { File } = require('megajs');
const fs = require('fs');
const http = require('http');
const { getPlugins } = require('./lib/plugins');
const { serialize } = require('./lib/client');
const { commands } = require('./lib/commands');
const CONFIG = require('./config');
const store = makeInMemoryStore({logger: P({ level: 'silent' }).child({ level: 'silent' }),});
const fetch = require('node-fetch');
globalThis.fetch = fetch;

if (process.env.PLATFORM === 'koyeb') require('http').createServer((req, res) => {
req.method === 'GET' && req.url === '/' ? res.writeHead(200, { 'Content-Type': 'text/html' }) && res.end('<h1>X Astral running👍</h1>') : res.writeHead(404) && res.end('not found');
}).listen(process.env.PORT || 8080, () => console.log(`running at http://localhost:${process.env.PORT || 8080}`));
async function auth() {
    const credz = path.join(__dirname, 'lib', 'session', 'creds.json');
    if (!fs.existsSync(credz)) {
      if (!CONFIG.APP.SESSION_NAME) {
         console.log('_session_id required_'); return;}
        const cxl = CONFIG.APP.SESSION_NAME;
        const mob = cxl.replace('Naxor~', '');
        try { const filer = File.fromURL(`https://mega.nz/file/${mob}`);
            const n = await filer.download();
            const chunks = [];
            for await (const chunk of n) { chunks.push(chunk); }
            const buf = Buffer.concat(chunks);
            fs.writeFileSync(credz, buf);
            console.log('Session file saved');
          } catch (err) { console.error(err); }
    }}
auth();

async function startBot() {
    await CONFIG.APP.POST_GET.sync();
    console.log('Database connected ✅');
    const auth_creds = path.join(__dirname, 'lib', 'session');
    let { state, saveCreds } = await useMultiFileAuthState(auth_creds);
    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS('Chrome'),
        syncFullHistory: true,
        emitOwnEvents: true,
        auth: state,
        version: (await fetchLatestBaileysVersion()).version,
    });

    store.bind(conn.ev);
    conn.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;
    msg.message = Object.keys(msg.message)[0] === 'ephemeralMessage' ? msg.message.ephemeralMessage.message : msg.message;
    const message = await serialize(msg, conn);
    if (!message || !message.key || !message.body) return;
    const x = message.key.remoteJid;
     if (message.sender !== x && ['protocolMessage', 'reactionMessage'].includes(message.type) && x === 'status@broadcast') {
      if (!Object.keys(store.groupMetadata).length) store.groupMetadata = await conn.groupFetchAllParticipating();
        return;}
    if (CONFIG.APP.MODE === true && !message.isFromMe) return;
    const mek = message.body.trim(); 
    const isCmd = mek.startsWith(CONFIG.APP.PREFIX.toLowerCase()); 
    const textt = mek.slice(CONFIG.APP.PREFIX.length).trim(); 
    if (mek.startsWith('$')) {
        if (!message.isFromMe && !CONFIG.APP.MODS) return;
        try { const code = mek.slice(1); 
            var Fek = await eval(`(async () => { ${code} })()`);
        if (typeof Fek !== "string") Fek = util.inspect(Fek);
        await message.reply(Fek);
       }catch(e){message.reply(util.format(e));
     }}
     console.log("------------------\n" +`User: ${message.sender}\n` +`Message: ${message.body}\n` +
      `From: ${message.isGroup ? message.subject : "Private Chat"}\n` +
      "------------------"
    );
    if (isCmd) {
    const pattern = new RegExp(`^(${CONFIG.APP.PREFIX})(\\S+)`);
    const commando = mek.match(pattern);
    if (commando) {
        const command = commando[2];
        const match = message.body.trim().split(/ +/).slice(1).join(" ");
        const args = match;
        const Func = commands.find((c) => c.command.toLowerCase() === command);
        if (Func) {
            try {
                await Func.execute(message, conn, match, args);
            } catch (err) {
                console.error(err);
            }
        } else if (message.body && Func?.on) {  
            if (
                (message.type === "text" && conversation) ||
                message.type === "videoMessage" ||
                message.type === "audioMessage" ||
                message.type === "stickerMessage" ||
                message.type === "imageMessage"
            ) {
                try {
                    await Func.execute(message, conn, match, args);
                } catch (err) {
                    console.error(err);
                }
            }
        }}
   }
    });

    conn.ev.on("call", async (callUpdate) => {
    for (const call of callUpdate) {
        if (call.status === "offer") {
            const voidi = call.from.includes("@") ? call.from.split("@")[0] : call.from;
            await conn.updateCall({
                id: call.id,
                from: call.from,
                status: "reject"
            });
            if (voidi.includes("+") || voidi.includes(":")) {
              return conn.sendMessage(call.from, { text: "_No calls please🙏_" });} 
              if (!CONFIG.APP.CALL) { 
                return conn.sendMessage(call.from, { text: `_No calls please, ${voidi}_` });
            }
        }
    }
});

conn.ev.on("group-participants.update", async ({ id, participants, action }) => {
    for (const user of participants) {
        if ((action === "add" && !CONFIG.APP.WELCOME) || (action === "remove" && !CONFIG.APP.GOODBYE)) return;
        const e = `@${user.split("@")[0]} || ${message.pushName}`;
        const groupMetadata = await conn.groupMetadata(id);
        const a = groupMetadata.subject || "this group";
        const count = groupMetadata.participants.length;
        const ppUrl = await conn.profilePictureUrl(user, "image").catch(() => "https://via.placeholder.com/500");
        let img;
        let tt = action === "add" ? "WELCOME" : "GOODBYE";
        let des = action === "add" 
            ? `Hello ${e}, welcome to **${a}**`
            : `Goodbye ${e}, **${a}**`;
        img = await new canvafy.WelcomeLeave()
            .setAvatar(ppUrl)
            .setBackground("image", "https://png.pngtree.com/thumb_back/fw800/background/20240911/pngtree-surreal-moonlit-panorama-pc-wallpaper-image_16148136.jpg")
            .setTitle(tt) 
            .setDescription(des) 
            .setBorder("#2a2e35") 
            .setAvatarBorder("#2a2e35") 
            .setOverlayOpacity(0.3) 
            .build();
        const mgs = action === "add"
            ? CONFIG.APP.WELCOME_MSG.replace('@user', e).replace('@group', a)
            : CONFIG.APP.GOODBYE_MSG.replace('@user', e).replace('@group', a);
        await conn.sendMessage(id, { image: img, caption: mgs, mentions: [user], footer: action === "add" ? "Welcome" : "Goodbye" });
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

setTimeout(startBot, 3000)
