import { CreatePlug, getLang } from '../lib/index';
import * as textToSpeech from '@google-cloud/text-to-speech';
const client = new textToSpeech.TextToSpeechClient();

CreatePlug({
    command: ['tts','say'],
    category: 'convert',
    desc: 'Convert text to speech with language and gender support',
    fromMe: false,
    execute: async (message: any, conn: any, match: string): Promise<void> => {
        const msgs = getLang();
        if (!match) return void (await message.reply(msgs.query_msg));
        const args = match.split(' ');
        const lang = args.shift() || 'en'; 
        let gender = 'NEUTRAL'; 
        if (['male', 'female', 'neutral'].includes(args[0]?.toLowerCase())) {
            gender = args.shift()?.toUpperCase() || 'NEUTRAL';}
        const text = args.join(' ');
        if (!text) return await message.reply(msgs.query_msg);     
        const request = {
            input: { text },
            voice: { 
                languageCode: lang,
                ssmlGender: gender as 'NEUTRAL' | 'MALE' | 'FEMALE'
            },
            audioConfig: { 
                audioEncoding: 'MP3'
            }
        };

        const [response] = await client.synthesizeSpeech(request);
        if (!response.audioContent) return await message.reply(msgs.error_msg);
        await conn.sendMessage(message.user, {
            audio: response.audioContent,
            mimetype: 'audio/mp3',
            ptt: false
        });
    },
});
