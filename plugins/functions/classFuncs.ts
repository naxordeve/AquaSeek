import axios from 'axios';

interface MusicIdentification { creator?: string; title?: string; artists?: string; duration?: string; release?: string; genre?: string; score?: string; source?: string; error?: string; }
export class WhatMusic {
  private apiUrl: string = 'https://api.botcahx.eu.org/api/tools/whatmusic';
  private apiKey: string;
  constructor(apiKey: string) { this.apiKey = apiKey; }
  async identify(url: string): Promise<MusicIdentification> {
    try { const { data } = await axios.get(`${this.apiUrl}?url=${url}&apikey=${this.apiKey}`);
      if (!data.status) return { error: 'Identif err' };
      return { creator: data.creator, title: data.result.match(/Title: (.+)/)?.[1], artists: data.result.match(/Artists: (.+)/)?.[1], duration: data.result.match(/Duration: (.+)/)?.[1], release: data.result.match(/Release: (.+)/)?.[1], genre: data.result.match(/Genre: (.+)/)?.[1], score: data.result.match(/Score: (.+)/)?.[1], source: data.result.match(/Source: (.+)/)?.[1] };
    } catch { return { error: 'erro' }; }
  }
}
