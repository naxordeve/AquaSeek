import axios from 'axios';

interface RingToneItem { title: string; source: string; audio: string; }
interface RingTones { status: boolean; BK9: RingToneItem[]; }
async function Ring(query: string): Promise<RingToneItem[] | null> {
  const _api = `https://bk9.fun/download/RingTone?q=${query}`;
  try { const response = await axios.get(_api);
    const data: RingTones = response.data;
    if (!data.status || !data.BK9 || data.BK9.length === 0) throw new Error("No results found");
    return data.BK9.map(item => ({ title: item.title, source: item.source, audio: item.audio }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`${error.message}`);
    } else {
      console.error(`${error}`);
    }
    return null;
  }
}

export { Ring };
