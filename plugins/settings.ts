import { CreatePlug, setWelcome, getSettings } from "../lib/index";

CreatePlug({
  command: "welcome",
  category: "group",
  desc: "Enable or disable welcome",
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    const isBotAdmin = message.isBotAdmin;
    const isAdmin = message.isAdmin;
    if (!isAdmin) return;
    if (match === "on") {
      await setWelcome(message.user, true);
      await conn.sendMessage(message.user, { text: "welcome now *enabled*" });
    } else if (match === "off") {
      await setWelcome(message.user, false);
      await conn.sendMessage(message.user, { text: "welcome now *disabled*" });
    } else {
      const msg = await getSettings(message.user);
      await conn.sendMessage(message.user, { text: `currently *${msg ? "enabled" : "disabled"}*` });
    }
  }
});
