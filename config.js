require('dotenv').config();
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, `${process.env.NODE_ENV || 'development'}.env`) });
const toBool = (x) => (x && (x.toLowerCase() === 'true' || x.toLowerCase() === 'on')) || false;

const CONFIG = {
    APP: {
        SESSION_NAME: process.env.SESSION_NAME || 'Naxor~0NYSjTwJ#fZl6Hvrhnxu369syaYqdZ35YeTSmMkP32L3ByLYYJ7U',
        BOTNAME: 'AQUASEEK',
        DATABASE_URL: process.env.DATABASE_URL || '', //mongodb url heee
        VERSION: require('./package.json').version,
        env: process.env.NODE_ENV || 'development',
        PREFIX: process.env.COMMAND || '.',
        MODE: toBool(process.env.MODE || "true"),
        CALL: toBool(process.env.CALL || "false"),
        WELCOME: toBool(process.env.WELCOME ?? "true"),
        GOODBYE: toBool(process.env.GOODBYE ?? "true"),
        WELCOME_MSG: process.env.WELCOME_MSG || "@user\nWelcome to @group\nEnjoy your stay",
        GOODBYE_MSG: process.env.GOODBYE_MSG || "@user\nLeft the group\nDusted", 
        MODS: process.env.MODS || '27686881509,27686567257',
        OWNER: process.env.ME || '27686881509,27686567257',
        STICKER_PACKNAME: process.env.STICKER_PACKNAME || 'AquaSeek, 💦',
    },
};

module.exports = CONFIG;
