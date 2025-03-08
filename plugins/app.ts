import { CreatePlug, monospace } from '../lib/index';
import axios from 'axios';

CreatePlug({
    command: 'app',
    category: 'download',
    desc: 'Download APK files',
    execute: async (message: any, conn: any, match: string): Promise<void> => {
        if (!match) return void (await message.reply(msgs.apk_msg));
        const { data } = await axios.get(`https://diegoson-naxordeve.hf.space/download/apk?q=${match}`);
        if (!data.download) return void (await message.reply(msgs.app_not));
        await conn.sendMessage(message.user, {
            image: { url: data.image },
            caption: `乂  *A P K  I N F O*\n\n` +
                     `📦 *App:* ${monospace(data.title)}\n` +
                     `🛠 *Developer:* ${data.developer}\n` +
                     `📌 *Version:* ${monospace(data.version)}\n` +
                     `🔗 *Size:* ${data.size || 'mb'}\n\n` 
        }, { quoted: message });
        await conn.sendMessage(message.user, {
            document: { 
                url: data.download 
            },
            fileName: `${data.title}.apk`,
            mimetype: "application/vnd.android.package-archive",
            caption: "*By AquaSeek*"
        }, { quoted: message });
    },
});
      
