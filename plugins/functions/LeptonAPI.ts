import axios from 'axios';

interface Leptonn { result: string; status: number; message?: string; }
class LeptonAPI {
  private apiKey: string;
  private baseURL: string = 'https://api.yanzbotz.live/api/ai/lepton';
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getResult(query: string): Promise<string> {
    try { const url = `${this.baseURL}?query=${query}&apiKey=${this.apiKey}`;
      const response = await axios.get<Leptonn>(url);
      const data = response.data;
      if (data.status !== 200) throw new Error(data.message || 'err');
      return data.result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Axios error: ${error.message}`);
      }
      throw new Error('Unknown error occurred');
    }
  }
}

export default LeptonAPI;
