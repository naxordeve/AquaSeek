import { WASocket, GroupMetadata } from "@whiskeysockets/baileys";
import { getSettings } from "./database/settings";

function monospace(text: string): string {
  return text
    .split("")
    .map((char) =>
      char >= "A" && char <= "Z"
        ? String.fromCharCode(char.charCodeAt(0) + 0x1d670 - 65)
        : char >= "a" && char <= "z"
        ? String.fromCharCode(char.charCodeAt(0) + 0x1d68a - 97)
        : char >= "0" && char <= "9"
        ? String.fromCharCode(char.charCodeAt(0) + 0x1d7f6 - 48)
        : char
    )
    .join("");
}

async function getProfilePicture(sock: WASocket, jid: string) {
  try { return await sock.profilePictureUrl(jid, "image");
  } catch {
    return "https://i.imgur.com/OC9DNy3.png"; 
  }}

export async function SettingsDB(sock: WASocket, update: any) {
  const { id, participants, action } = update;
  const v = await getSettings(id);
  if (!v) return;
  const groupMetadata: GroupMetadata = await sock.groupMetadata(id);
  const mc = groupMetadata.participants.length;
  const te = await sock.groupInviteCode(id); 
  const gc_invite = `https://chat.whatsapp.com/${te}`; 
  for (const participant of participants) {
    const num = participant.replace("@s.whatsapp.net", "");
    const At = new Date().toLocaleString("en-US", { timeZone: "Africa/Johannesburg" });
    const _pp = await getProfilePicture(sock, participant);
    let message = "";
    if (action === "add") {
      message = `${monospace("welcome")} @${num}  
${monospace("Joined at:")} ${monospace(At)}  
${monospace("Member count:")} ${monospace(mc.toString())}\n\n 
\`\`\`Have a great time! Read the group description so you can stay *WAKAWAKA*\`\`\``;
      await sock.sendMessage(id, {
        image: { url: _pp },
        caption: message,
        mentions: [participant],
        contextInfo: {
          externalAdReply: {
            title: "",
            body: "",
            thumbnail: { url: _pp },
            sourceUrl: gc_invite, 
            mediaType: 1,
            renderLargerThumbnail: false,
          },
        },
      });
    } else if (action === "remove") {
      message = `${monospace("Goodbye")} @${num}  
${monospace("Remaining members:")} ${monospace(mc.toString())}  
Take care *VIRGIN*`;
      await sock.sendMessage(id, {
        image: { url: _pp },
        caption: message,
        mentions: [participant],
        contextInfo: {
          externalAdReply: {
            title: "Goodbye",
            body: "",
            thumbnail: { url: _pp },
            sourceUrl: gc_invite,
            mediaType: 1,
            renderLargerThumbnail: false,
          },
        },
      });
    }
  }
}
