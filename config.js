require('dotenv').config();
const { Sequelize } = require('sequelize')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, `${process.env.NODE_ENV || 'development'}.env`) });
const toBool = (x) => (x && (x.toLowerCase() === 'true' || x.toLowerCase() === 'on')) || false;
var DATABASE_URL = process.env.DATABASE_URL || "./lib/database.db";

const CONFIG = {
    APP: {
        SESSION_NAME: process.env.SESSION_NAME || 'Naxor~tExQ1Sqa#L42-LtY9MibAvW4zqgU3gbiIG5mqcCxY2uGTVKS0rpg',
        BOTNAME: 'AQUASEEK',
        MONGODB_URL: process.env.MONGODB_URL || 'mongodb+srv://whatsbixby:whatsbixby@cluster0.idp3t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', // MongoDB URL
        SQLDB_URL: DATABASE_URL == "./lib/database.db"
         ? new Sequelize({dialect: 'sqlite',storage: DATABASE_URL, logging: false, })
         : new Sequelize(DATABASE_URL, {dialect: 'postgres',ssl: true,protocol: 'postgres',dialectOptions: {native: true,
            ssl: { require: true, rejectUnauthorized: false },
           },
          logging: false,
        }),
        BRANCH: "master",
        VERSION: require('./package.json').version,
        env: process.env.NODE_ENV || 'development',
        PREFIX: process.env.COMMAND || '.',
        MODE: toBool(process.env.MODE || "false"),
        CALL: toBool(process.env.CALL || "false"),
        MODS: process.env.MODS || '27686881509,27686567257',
        OWNER: process.env.ME || '27686881509,27686567257',
        STICKER_PACKNAME: process.env.STICKER_PACKNAME || 'AϙᴜᴀSᴇᴇᴋ',
    },
};

module.exports = CONFIG;
        
