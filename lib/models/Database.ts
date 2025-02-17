import { QuickMongo } from 'quickmongo';
import * as QuickDB from 'quick.db';

declare global {
    var db: QuickMongo | undefined;
}

export function useMongoAuthState(mongO: string): Promise<QuickMongo> {
    if (!mongO) {
        console.error("MongoDB url is required");
        process.exit(1);
    }

    if (global.db) return Promise.resolve(global.db);
    const db = new QuickMongo(mongO);
    db.setStorage(new QuickDB.Database());

    return db.connect().then(() => {
        console.log("✅ MongoDB Connected");
        global.db = db;
        return db;
    }).catch((err) => {
        console.error(err);
        process.exit(1);
    });
        }
