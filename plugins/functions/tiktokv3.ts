import axios from 'axios';

interface TikTokData { title: string; thumbnail: string; download: Array<{ title: string; link: string; }>; }
interface TTTT { title: string; thumbnail: string; dlv3: string | null; dlmp3: string | null; }
async function getTikV3(voidi: string): Promise<TTTT | { error: string }> {
  const url = `https://diegoson-naxordeve.hf.space/tiktok/v3?url=${voidi}`;
  try { const { data }: { data: TikTokData } = await axios.get(url);
    const title = data.title || "aqua";
    const thumbnail = data.thumbnail || "";
    const dlv3 = data.download?.find(item => item.title.toLowerCase().includes("video"))?.link || null;
    const dlmp3 = data.download?.find(item => item.title.toLowerCase().includes("mp3"))?.link || null;
    return { title, thumbnail, dlv3, dlmp3 };
  } catch (error) {
    return { error: 'Request failed' };
  }
}

export { getTikV3 };
