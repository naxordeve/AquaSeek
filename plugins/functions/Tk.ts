import fetch from 'node-fetch';

interface TikTokPfp { profileImage: string; name: string; username: string; followers: number; following: number; bio: string; likes: number; }
interface TikTokResponse { status: boolean; BK9: TikTokPfp; }
async function TKAnnis(username: string): Promise<TikTokPfp | null> {
  const url = `https://bk9.fun/stalk/tiktok?q=${username}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data: TikTokResponse = await res.json();
    return data.status ? data.BK9 : null;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export { TKAnnis };
