import * as QuickDB from "quick.db";

const db = new QuickDB.Database();
export async function setWelcome(groupId: string, enabled: boolean) {
await db.set(`welcome_${groupId}`, enabled);}
export async function getSettings(groupId: string): Promise<boolean> {
return await db.get(`welcome_${groupId}`) || false;
}
