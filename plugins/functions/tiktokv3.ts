import fetch from 'node-fetch';

interface TikTokData {
  title: string;
  thumbnail: string;
  download: Array<{
    title: string;
    link: string;
  }>;
}

interface TikTokResponse {
  title: string;
  thumbnail: string;
  dlv3: string | null;
  dlmp3: string | null;
}

async function getTikV3(voidi: string): Promise<TikTokResponse | { error: string }> {
  const x = `https://diegoson-naxordeve.hf.space/tiktok/v3?url=${voidi}`;
  const y = await fetch(x);
  if (!y.ok) {
    return { error: `${y.status}` };
  }
  const data: TikTokData = await y.json();
  
  const title = data.title || "aqua";
  const thumbnail = data.thumbnail || "";
  const dlv3 = data.download?.find(item => item.title.toLowerCase().includes("video"))?.link || null;
  const dlmp3 = data.download?.find(item => item.title.toLowerCase().includes("mp3"))?.link || null;
  return { title, thumbnail, dlv3, dlmp3 };
}

export { getTikV3 };
