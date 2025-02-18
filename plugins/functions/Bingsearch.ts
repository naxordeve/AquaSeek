import fetch from 'node-fetch';

interface BingResult { title: string; link: string; snippet: string; image: string; }
class BingSearch {
  private base: string;
  constructor(base: string) {
    if (!base) throw new Error("api_needed");
    this.base = base;
  }

  async Res(query: string): Promise<BingResult[]> {
    if (!query) throw new Error("Query parameter is required");
    try {
      const get = await fetch(`${this.base}${query}`);
      if (!get.ok) throw new Error(`${get.status}`);
      const mek = await get.json();
      if (!mek.status || !Array.isArray(mek.data)) throw new Error("Invalid");
      return mek.data.map((item: any) => ({ title: item.title, link: item.link, snippet: item.snippet, image: item.image }));
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default BingSearch;
        
