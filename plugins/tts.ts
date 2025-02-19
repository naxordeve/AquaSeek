import { CreatePlug } from '../lib/commands';
import gTTS from 'gtts';

CreatePlug({
    command: 'tts',
    category: 'convert',
    desc: 'speech',
    execute: async (message: any, conn: any, match: string): Promise<void> => {
        if (!match) return void (await message.reply('_Need text_'));
        await message.react("✅");
        const tts = new gTTS(match, 'en');
        const path = '/tmp/tts.mp3';
        tts.save(path, async (err: Error) => {
            if (err) {
                console.error(err);
                return;
            }try {
                await conn.sendMessage(message.user, { audio: { url: path }, mimetype: 'audio/mp4' });
            } catch (err) {
                console.error(err);
            }
        });
    }
});
