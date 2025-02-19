import { CreatePlug } from "../lib/index";

CreatePlug({
  command: "block",
  category: "admin",
  desc: "Block a user",
  execute: async (message: any, conn: any): Promise<void> => {
    if (!message.isFromMe) return;
    const target = message.quoted
      ? message.quoted.sender
      : !message.isGroup
      ? message.user
      : null;
    if (!target) return conn.sendMessage(message.user, { text: "Please reply to a user" });
    await conn.updateBlockStatus(target, "block");
    conn.sendMessage(message.user, {
      text: `_Blocked_ @${target.split("@")[0]}`,
      mentions: [target],
    });
  },
});

CreatePlug({
  command: "unblock",
  category: "admin",
  desc: "Unblock a user",
  execute: async (message: any, conn: any): Promise<void> => {
    if (!message.isFromMe) return;
    const target = message.quoted
      ? message.quoted.sender
      : !message.isGroup
      ? message.user
      : null;
    if (!target) return conn.sendMessage(message.user, { text: "Please reply to a user" });
    await conn.updateBlockStatus(target, "unblock");
    conn.sendMessage(message.user, {
      text: `_Unblocked_ @${target.split("@")[0]}`,
      mentions: [target],
    });
  },
});
        
