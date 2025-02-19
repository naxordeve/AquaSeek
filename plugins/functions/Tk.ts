import axios from 'axios';

interface TikTokPfp { profileImage: string; name: string; username: string; followers: number; following: number; bio: string; likes: number; }
interface TikTokP { status: boolean; BK9: TikTokPfp; }
async function TKAnnis(username: string): Promise<TikTokPfp | null> {
  const url = `https://bk9.fun/stalk/tiktok?q=${username}`;
  try { const res = await axios.get(url);
    const data: TikTokP = res.data;
    return data.status ? data.BK9 : null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`${error.message}`);
    } else {
      console.error(`${error}`);
    }
    return null;
  }
}

export { TKAnnis };
