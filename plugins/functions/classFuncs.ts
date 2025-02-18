import fetch from 'node-fetch';

interface MusicIdentificationResult {
  creator?: string;
  title?: string;
  artists?: string;
  duration?: string;
  release?: string;
  genre?: string;
  score?: string;
  source?: string;
  error?: string;
}

export class WhatMusic {
  private apiUrl: string;
  private apiKey: string; 
  constructor(apiKey: string) {
    this.apiUrl = 'https://api.botcahx.eu.org/api/tools/whatmusic';
    this.apiKey = apiKey;
  }

  async identify(url: string): Promise<MusicIdentificationResult> {
    try {
      const response = await fetch(`${this.apiUrl}?url=${url}&apikey=${this.apiKey}`);
      if (!response.ok) {
        return { error: `HTTP Error: ${response.status}` };
      }
      const data = await response.json();
      if (data.status) {
        return {
          creator: data.creator,
          title: data.result.match(/Title: (.+)/)?.[1] || undefined,
          artists: data.result.match(/Artists: (.+)/)?.[1] || undefined,
          duration: data.result.match(/Duration: (.+)/)?.[1] || undefined,
          release: data.result.match(/Release: (.+)/)?.[1] || undefined,
          genre: data.result.match(/Genre: (.+)/)?.[1] || undefined,
          score: data.result.match(/Score: (.+)/)?.[1] || undefined,
          source: data.result.match(/Source: (.+)/)?.[1] || undefined,
        };
      } else {
        return { error: 'Identif err' };
      }
    } catch (error) {
      return { error: 'Request failed' };
    }
  }
}
