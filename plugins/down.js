const { CreatePlug } = require('../lib/commands');
const gTTS = require('gtts');

CreatePlug({
    command: 'tts',
    category: 'convert',
    desc: 'speech',
    execute: async (message, conn, match) => {
        if (!match) return message.reply('_need text_');
        const tts = new gTTS(match, 'en');
        const path = '/tmp/tts.mp3';
        tts.save(path, async (err) => {
            if (err) {
                console.error(err);
                return;}
            conn.sendMessage(message.user, { audio: { url: path }, mimetype: 'audio/mp4' }).catch((err) => {
                console.error(err);
                   });
        });
    }
});
