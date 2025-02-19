import axios from 'axios';

interface BingResult { title: string; link: string; snippet: string; image: string; }
class BingSearch {
  private base: string;
  constructor(base: string) {
    if (!base) throw new Error("API base URL is required");
    this.base = base;
  }

  async Res(query: string): Promise<BingResult[]> {
    if (!query) throw new Error("Query parameter is required");
    try { const response = await axios.get<{ status: boolean; data: BingResult[] }>(`${this.base}${query}`);
      const mek = response.data;
      if (!mek.status || !Array.isArray(mek.data)) throw new Error("Invalid response format");
      return mek.data.map(item => ({ title: item.title, link: item.link, snippet: item.snippet, image: item.image }));
    } catch (error) {
      if (axios.isAxiosError(error)) throw new Error(`Axios error: ${error.message}`);
      throw new Error("Unknown error occurred");
    }
  }
}

export default BingSearch;
    
