import fetch from 'node-fetch';

interface LeptonResponse { result: string; status: number; message?: string; }
class LeptonAPI {
  private apiKey: string; private baseURL: string = 'https://api.yanzbotz.live/api/ai/lepton';
  constructor(apiKey: string) { this.apiKey = apiKey; }
  async getResult(query: string): Promise<string> {
    const url = `${this.baseURL}?query=${query}&apiKey=${this.apiKey}`;
    const get = await fetch(url);
    if (!get.ok) throw new Error(`${get.status}`);
    const data: LeptonResponse = await get.json();
    if (data.status !== 200) throw new Error(`${data.message || 'err'}`);
    return data.result;
  }
}

export default LeptonAPI;
