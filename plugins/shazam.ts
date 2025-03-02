import { CreatePlug } from "../lib/index"; 
import acrcloud from "acrcloud";
import axios from "axios";

const acr = new acrcloud({
  host: "identify-ap-southeast-1.acrcloud.com",
  access_key: "ee1b81b47cf98cd73a0072a761558ab1",
  access_secret: "ya9OPe8onFAnNkyf9xMTK8qRyMGmsghfuHrIMmUI",
});

CreatePlug({
  command: "find",
  category: "search",
  desc: "Identify a song from an audio message.",
  execute: async (message: any, conn: any): Promise<void> => {
    if (!message.quoted || !message.quoted.message) {
      await message.reply("_Reply to an audio or video message to identify the song_");
      return;
    }

    const buffer: Buffer = await message.quoted.download();
    const song = await FinderBro(buffer);
    if (!song) return;
    const toBool = `*Title:* ${song.title}\n` +
      `*Artist:* ${song.artist}\n` +
      `*Release Date:* ${song.release}\n` +
      `*Duration:* ${song.duration}\n` +
      `*Score:* ${song.score}\n` +
      `*Url:* ${song.url}\n`;
    const toThumb = await getThumbnail(song);
    if (toThumb) {
      await conn.sendMessage(message.user, {
        image: { url: toThumb },
        caption: toBool.trim(),
      });
    } else {
      await conn.sendMessage(message.user, {
        text: toBool.trim(),
      });
    }
  },
});

async function FinderBro(buffer: Buffer): Promise<Song | null> {
  const response = await acr.identify(buffer);
  const music = response?.metadata?.music?.[0]; 
  if (!music) return null;
  let url = "";
  if (music.external_metadata?.youtube) {
    url = `https://youtu.be/${music.external_metadata.youtube.vid}`;
  } else if (music.external_metadata?.spotify) {
    url = `https://open.spotify.com/track/${music.external_metadata.spotify.track.id}`;
  } else if (music.external_metadata?.deezer) {
    url = `https://www.deezer.com/us/track/${music.external_metadata.deezer.track.id}`;
  } else {
    return null; }
  return {
    title: music.title,
    artist: music.artists.map((a: any) => a.name)[0],
    score: music.score,
    release: new Date(music.release_date).toLocaleDateString("id-ID"),
    duration: toTime(music.duration_ms),
    url
  };
}

async function getThumbnail(song: Song): Promise<string | null> {
  if (song.url.includes("youtube.com") || song.url.includes("youtu.be")) {
    return getYouTube(song.url);
  } else if (song.url.includes("deezer.com")) {
    return getDeezer(song.url);
  }
  return null;
}

function getYouTube(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;}
function extractYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:v=|\/|youtu.be\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null; }
async function getDeezer(url: string): Promise<string | null> {
  const trackId = url.split("/track/")[1]?.split("?")[0];
  if (!trackId) return null;
  try { const { data } = await axios.get(`https://api.deezer.com/track/${trackId}`);
    return data?.album?.cover_big ?? null;
  } catch (error) {
    return null;
  }}

function toTime(ms: number): string {
  const minutes = Math.floor(ms / 60000) % 60;
  const seconds = Math.floor(ms / 1000) % 60;
  return [minutes, seconds].map((v) => v.toString().padStart(2, "0")).join(":");}
interface Song {title: string; artist: string; score: number; release: string; duration: string; url: string;
      }
    
