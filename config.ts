import 'dotenv/config';
import path from 'path';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, `${process.env.NODE_ENV || 'development'}.env`) });
const getEnv = (key: string, defaultValue: string = ''): string => process.env[key] || defaultValue;
const toBool = (x: string): boolean => ['true', 'on'].includes(x.toLowerCase());
const pkgPath: string = path.resolve(__dirname, '../package.json');
const packageJson: { version: string } = JSON.parse(readFileSync(pkgPath, 'utf-8'));

const CONFIG = {
  APP: {
    SESSION_NAME: getEnv('SESSION_NAME', 'Naxor~tExQ1Sqa#L42-LtY9MibAvW4zqgU3gbiIG5mqcCxY2uGTVKS0rpg'),
    BOTNAME: getEnv('BOTNAME', 'AQUASEEK'),
    MONGODB_URL: getEnv(
      'MONGODB_URL',
      'mongodb+srv://whatsbixby:whatsbixby@cluster0.idp3t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    ),
    BRANCH: getEnv('BRANCH', 'master'),
    VERSION: packageJson.version,
    env: getEnv('NODE_ENV', 'development'),
    PREFIX: getEnv('COMMAND', '.'),
    MODE: toBool(getEnv('MODE', 'false')),
    CALL: toBool(getEnv('CALL', 'false')),
    MODS: getEnv('MODS', '27686881509,27686567257').split(','),
    OWNER: getEnv('ME', '27686881509,27686567257').split(','),
    STICKER_PACKNAME: getEnv('STICKER_PACKNAME', 'AϙᴜᴀSᴇᴇᴋ'),
  },
};

export default CONFIG;
