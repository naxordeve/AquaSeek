import { CreatePlug } from '../lib/commands';
import CONFIG from '../tsconfig';
import * as Jimp from "jimp";

CreatePlug({
  command: "setgcpp",
  category: "group",
  desc: "Set a new group profile picture",
  execute: async (message: any, conn: any) => {
    if (!message.isGroup) return;
    if (!message.isBotAdmin) return message.reply("_I need to be an admin to perform this action_");
    if (!message.isAdmin) return;
    if (!message.quoted || !message.quoted.message.imageMessage) return message.reply("_Please provide an image_");
    const buffer = await message.quoted.download();
    if (!buffer) return message.reply("_Failed to download image_");
    const jimp = await Jimp.read(buffer);
    const min = Math.min(jimp.getWidth(), jimp.getHeight());
    const cropped = jimp.crop(0, 0, min, min);
    const img = await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG);
    const preview = await cropped.scaleToFit(100, 100).getBufferAsync(Jimp.MIME_JPEG);
    await conn.query({
      tag: "iq",
      attrs: { to: message.user, type: "set", xmlns: "w:profile:picture" },
      content: [{ tag: "picture", attrs: { type: "image" }, content: preview }],
    });
    await conn.updateGroupPicture(message.user, img)
      .then(() => message.reply("_Group profile picture updated_"))
      .catch(() => message.reply("_err_"));
  },
});

CreatePlug({
  command: 'setdesc',
  category: 'group',
  desc: 'Change the group description',
  execute: async (message: any, conn: any, match: string) => {
    if (!message.isGroup) return;
    if (!message.isBotAdmin) return message.reply('_Im not admin_');
    if (!message.isAdmin) return;
    const args = match || message?.message?.text?.split(' ').slice(1).join(' ');
    if (!args) return message.reply('_Please provide a new group description_');
    await conn.groupUpdateDescription(message.user, args);
    message.reply(`_Group description has been updated to: "${args}"_`);
  },
});

CreatePlug({
  command: 'add',
  category: 'group',
  desc: 'Add a user to the group',
  execute: async (message: any, conn: any, match: string) => {
    if (!message.isGroup) return;
    if (!message.isBotAdmin) return message.reply('_Bot is not an admin_');
    if (!message.isAdmin) return;
    const user = message.body.includes('@')
      ? message.body.split('@')[1].split(' ')[0] + '@s.whatsapp.net'
      : match?.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    if (!user || (match?.trim() === '' && !message.body.includes('@'))) {
      return conn.sendMessage(message.user, { text: '_Provide a valid number to add_' });
    }
    const voidi = await conn.groupParticipantsUpdate(message.user, [user], 'add');
    if (voidi?.status === 403 || voidi?.status === 'failed') {
      await conn.sendMessage(message.user, {
        text: `Couldn't add ${message.body.includes('@') ? `@${message.body.split('@')[1].split(' ')[0]}` : match.trim()}`,
        mentions: [user],
      });
    } else {
      await conn.sendMessage(message.user, {
        text: `_Added_ ${message.body.includes('@') ? `@${message.body.split('@')[1].split(' ')[0]}` : match.trim()}`,
        mentions: [user],
      });
    }
  },
});

CreatePlug({
  command: 'approve',
  category: 'group',
  desc: 'Approve users from group joining',
  execute: async (message: any, conn: any, match: string) => {
    if (!message.isGroup) return;
    if (!message.isBotAdmin) return message.reply('_not admin_');
    if (!message.isAdmin) return;
    const res = await conn.groupRequestParticipantsList(message.user);
    if (!res || res.length === 0) return;
    for (const participant of res) {
      const jid = participant.jid || `${participant.id}@s.whatsapp.net`;
      await conn.groupRequestParticipantsUpdate(message.user, [jid], 'approve');
    }
    message.reply(`_Approved ${res.length} user(s)_`);
  },
});

CreatePlug({
  command: 'reject',
  category: 'group',
  desc: 'Rejects users from group joining',
  execute: async (message: any, conn: any, match: string) => {
    if (!message.isGroup) return;
    if (!message.isBotAdmin) return message.reply('_not admin_');
    if (!message.isAdmin) return;
    const res = await conn.groupRequestParticipantsList(message.user);
    if (!res || res.length === 0) return;
    for (const participant of res) {
      const jid = participant.jid || `${participant.id}@s.whatsapp.net`;
      await conn.groupRequestParticipantsUpdate(message.user, [jid], 'reject');
    }
    message.reply('_Pending rejected_');
  },
});

CreatePlug({
  command: 'kick',
  category: 'group',
  desc: 'Kick members by country code or kick all members',
  execute: async (message: any, conn: any, args: string[]) => {
    if (!message.isGroup || !message.isBotAdmin || !message.isAdmin) return;
    const arg = args[1];
    if (arg === 'all') {
      const { participants } = await conn.groupMetadata(message.user);
      const com = participants.filter(member => !member.admin && member.id !== conn.user.id);
      if (com.length === 0) return;
      for (const user of com) {
        await conn.groupParticipantsUpdate(message.user, [user.id], 'remove');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      return message.reply(`${arg.length} _user(s) removed_`);
    }
    if (!arg || isNaN(arg.replace('+', ''))) {
      return message.reply('Please provide a valid country code (e.g., `kick +27`).');
    }
    const { participants } = await conn.groupMetadata(message.user);
    const cam = participants.filter(member => member.id.split('@')[0].startsWith(arg.replace('+', '')));
    if (cam.length === 0) return;
    for (const user of cam) {
      await conn.groupParticipantsUpdate(message.user, [user.id], 'remove');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    return message.reply(`${cam.length} _user(s) removed_`);
  },
});


CreatePlug({
  command: 'kickall',
  category: 'group',
  desc: 'kick all_',
  execute: async (message: any, conn: any, args: string[]) => {
    if (!message.isGroup) return;
    if (!message.isBotAdmin) return;
    if (!message.isAdmin) return;
    const memb = await conn.groupMetadata(message.user);
    const part = memb.participants.filter(member => !member.admin);
    const parti = part.map(member => member.id);
    if (parti.length === 0) return;
    for (let i = 0; i < parti.length; i++) {
      await conn.groupParticipantsUpdate(message.user, [parti[i]], 'remove');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  },
});

CreatePlug({
  command: 'lockinvite',
  category: 'group',
  desc: 'Lock the group invite',
  execute: async (message: any, conn: any) => {
    if (!message.isGroup) return;
    if (!message.isBotAdmin) return message.reply('_um not admin_');
    if (!message.isAdmin) return;
    await conn.groupSettingUpdate(message.user, 'locked');
    message.reply('_Done_');
  },
});

CreatePlug({
  command: 'tagall',
  category: 'group',
  desc: 'Tag all users in the group',
  execute: async (message: any, conn: any, args: string[]) => {
    if (!message.isGroup) return;
    var data = await conn.groupMetadata(message.user);
    var participants = data.participants.map(p => p.id.replace('@s.whatsapp.net', ''));
    const msg = `🔰⛊──⛾「 Tag All 」⛾──⛊🔰\n\n👥 Mentioning all:\n`;
    const _object = participants.map(p => `@${p}`).join('\n');
    const _m = msg + _object;
    conn.sendMessage(message.user, {
      text: _m,
      mentions: participants.map(p => p + '@s.whatsapp.net'),
    });
  },
});

CreatePlug({
  command: 'promote',
  category: 'group',
  desc: 'Promote members',
  execute: async (message: any, conn: any, args: string[]) => {
    if (!message.isGroup) return;
    if (!message.isBotAdmin) return message.reply('_not an admin_');
    if (!message.isAdmin) return;
    if (!args) return message.reply('_Please mention the user_');
    let target: string | undefined;
    if (message.message.extendedTextMessage && message.message.extendedTextMessage.contextInfo) {
      target = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else {
      target = args.includes('@s.whatsapp.net') ? args : args + '@s.whatsapp.net';
    }
    if (!target) return;
    await conn.groupParticipantsUpdate(message.user, [target], 'promote');
    message.reply(`_promoted_ ${target.replace('@s.whatsapp.net', '')} as admin`);
  },
});

CreatePlug({
  command: 'demote',
  category: 'group',
  desc: 'Demote members',
  execute: async (message: any, conn: any, args: string[]) => {
    if (!message.isGroup) return;
    if (!message.isBotAdmin) return message.reply('_um not an admin_');
    if (!message.isAdmin) return;
    if (!args) return message.reply('_Please mention the user_');
    let target: string | undefined;
    if (message.message.extendedTextMessage && message.message.extendedTextMessage.contextInfo) {
      target = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else {
      target = args.includes('@s.whatsapp.net') ? args : args + '@s.whatsapp.net';
    }
    if (!target) return;
    await conn.groupParticipantsUpdate(message.user, [target], 'demote');
    message.reply(`_demoted_ ${target.replace('@s.whatsapp.net', '')}`);
  },
});

CreatePlug({
  command: 'group',
  category: 'group',
  desc: 'Open or close the group',
  execute: async (message: any, conn: any, args: string[]) => {
    if (!message.isGroup) return;
    if (!message.isBotAdmin) return message.reply('_I need to be an admin to perform this action_');
    if (!message.isAdmin) return;
    if (!args || args.length === 0) return message.reply('_Usage: group open/close_');
    const action = args[0].toLowerCase();
    const data = await conn.groupMetadata(message.user);
    if (action === 'close') {
      if (data.announce) return message.reply('_The group is already closed_');
      await conn.groupSettingUpdate(message.user, 'announcement');
      message.reply('_The group has been muted (closed)_');
    } else if (action === 'open') {
      if (!data.announce) return message.reply('_The group is already open_');
      await conn.groupSettingUpdate(message.user, 'not_announcement');
      message.reply('_The group has been unmuted (opened)_');
    } else {
      message.reply('_Invalid option. Use: group open/close_');
    }
  },
});


CreatePlug({
  command: 'remove',
  category: 'group',
  desc: 'Remove a member from the group',
  execute: async (message: any, conn: any, args: string[]) => {
    if (!message.isGroup) return;
    if (!message.isBotAdmin) return message.reply('_um not admin_');
    if (!message.isAdmin) return;
    if (!args) return message.reply('_Please mention a member_');
    let target: string | undefined = message.message.extendedTextMessage?.contextInfo?.mentionedJid[0] || (args.includes('@s.whatsapp.net') ? args : args + '@s.whatsapp.net');
    if (!target) return;
    await conn.groupParticipantsUpdate(message.user, [target], 'remove')
      .then(() => message.reply(`_removed_ ${target.replace('@s.whatsapp.net', '')}`))
      .catch((error) => { 
        console.error(error); 
        message.reply('err'); 
      });
  },
});

CreatePlug({
  command: 'info',
  category: 'group',
  desc: 'Get information about the group',
  execute: async (message: any, conn: any) => {
    if (!message.isGroup) return;
    const groupMetadata = await conn.groupMetadata(message.user);
    const name = groupMetadata.subject;
    const desc = groupMetadata.desc;
    const count = groupMetadata.participants.length;
    const img = await conn.profilePictureUrl(message.user);
    await conn.sendMessage(message.user, {
      image: { url: img }, 
      caption: `*Name*: ${name}\n*Members*: ${count}`
    });
  }
});

CreatePlug({
  command: 'invite',
  category: 'group',
  desc: 'group_invites',
  execute: async (message: any, conn: any) => {
    const isAdmin = message.isAdmin;
    if (!isAdmin) return;
    const _invites = await conn.groupInviteCode(message.user);
    await message.reply(`*Group Link*:\nhttps://chat.whatsapp.com/${_invites}`);
  }
});
