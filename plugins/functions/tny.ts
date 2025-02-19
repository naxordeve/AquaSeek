import axios from 'axios';

interface ShortenR { status: boolean; result: { link: string; }; }
class TinyURL {
  private urll: string;
  constructor(urll: string) {
    this.urll = urll;
  }
  async shortenUrl(url: string): Promise<string> {
    try { const { data }: { data: ShortenR } = await axios.get(`${this.urll}${url}`);
      if (!data.status) {
       throw new Error('Could not shorten URL');}
      return data.result.link;
    } catch (error) {
      throw new Error(`${(error as Error).message}`);
    }
  }
}

export default TinyURL;
