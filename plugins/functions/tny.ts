import fetch from 'node-fetch';

interface ShortenR {
  status: boolean;
  result: {
    link: string;
  };
}

class TinyURL {
  private urll: string;
  constructor(urll: string) {
    this.urll = urll;
}
  async shortenUrl(url: string): Promise<string> {
    const res = await fetch(`${this.urll}${url}`);
    if (!res.ok) {
      throw new Error(`${res.statusText}`);}
    const data: ShortenR = await res.json();
    if (!data.status) {
      throw new Error('Err');}
    return data.result.link;
  }
}

export default TinyURL;
