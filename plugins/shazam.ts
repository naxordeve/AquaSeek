import acrcloud from "acrcloud";
import { CreatePlug } from "../lib/index";

const acr = new acrcloud({
  host: "identify-ap-southeast-1.acrcloud.com",
  access_key: "ee1b81b47cf98cd73a0072a761558ab1",
  access_secret: "ya9OPe8onFAnNkyf9xMTK8qRyMGmsghfuHrIMmUI",
});

interface SongInfo {
  title: string;
  artist: string;
  score: number;
  release: string;
  duration: string;
  youtubeUrl: string | null;
}

async function Shazam(buffer: Buffer): Promise<SongInfo[] | null> {
  const data = (await acr.identify(buffer)).metadata;
  if (!data.music) return null;

  return data.music.map((a: any) => ({
    title: a.title,
    artist: a.artists?.[0]?.name || "Unknown",
    score: a.score,
    release: a.release_date ? new Date(a.release_date).toLocaleDateString("id-ID") : "N/A",
    duration: toTime(a.duration_ms),
    youtubeUrl: a.external_metadata?.youtube
      ? "https://youtu.be/" + a.external_metadata.youtube.vid
      : null,
  }));
}

function toTime(ms: number): string {
  const m = Math.floor(ms / 60000);
  const s = Math.floor(ms / 1000) % 60;
  return [m, s].map((v) => v.toString().padStart(2, "0")).join(":");
}

CreatePlug({
  command: "find",
  category: "search",
  desc: "Identify a song from an audio message.",
  execute: async (message: any, conn: any): Promise<void> => {
    if (!message.quoted || !message.quoted.message) {
      return void (await message.reply("_Reply to an audio or video message to identify the song_"));
    }
    await message.react("✅");
    const buffer: Buffer = await message.quoted.download();
    const result = await Shazam(buffer);
    if (!result || result.length === 0) return;
    for (const song of result) {
      const responseText = `*🎧Title:* ${song.title}\n` +
                           `*👤Artist:* ${song.artist}\n` +
                           `*⌚Duration:* ${song.duration}\n` +
                           `*🗓️Release:* ${song.release}\n`;

      if (song.youtubeUrl) {
        await conn.sendMessage(message.user, {
          text: responseText,
          contextInfo: {
            externalAdReply: {
              title: song.title,
              body: `By: ${song.artist}`,
              thumbnailUrl: `https://i.ytimg.com/vi/${song.youtubeUrl.split("youtu.be/")[1]}/hqdefault.jpg`,
              mediaType: 1,
              renderLargerThumbnail: true,
              mediaUrl: song.youtubeUrl,
              sourceUrl: song.youtubeUrl,
            },
          },
        });
      }
    }
  },
});
