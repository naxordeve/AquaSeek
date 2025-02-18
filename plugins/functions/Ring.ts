import fetch from 'node-fetch';

interface RingToneItem { title: string; source: string; audio: string; }
interface RingToneResponse { status: boolean; BK9: RingToneItem[]; }
async function Ring(query: string): Promise<RingToneItem[] | null> {
  const _api = `https://bk9.fun/download/RingTone?q=${query}`;
  try {
    const response = await fetch(_api);
    if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
    const data: RingToneResponse = await response.json();
    if (!data.status || !data.BK9 || data.BK9.length === 0) throw new Error("No results found");
    return data.BK9.map(item => ({ title: item.title, source: item.source, audio: item.audio }));
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export { Ring };
