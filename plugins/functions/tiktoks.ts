import fetch from 'node-fetch';

interface Video {
  title: string;
  duration: number;
  region: string;
  videoId: string;
  thumbnail: string;
  createdAt: string;
  stats: any;  
  music: any;  
  author: any; 
  media: any;  
}

interface Searcher {
  status: boolean;
  result: Video[];
}
interface ErrorR {
  error: string;}
class TikTokS {
  private x: string;
  constructor(x: string) {
    this.x = x;
  }

  async search(query: string): Promise<(Video | ErrorR)[]> {
    const v = `${this.x}?query=${query}`;
    const response = await fetch(v);
    const data: Searcher = await response.json();
    if (data.status) {
      return data.result.map(video => ({
        title: video.title,
        duration: video.duration,
        region: video.region,
        videoId: video.videoId,
        thumbnail: video.thumbnail,
        createdAt: video.createdAt,
        stats: video.stats,
        music: video.music,
        author: video.author,
        media: video.media
      }));
    } else {
      return [{ error: "No results found" }];
    }
  }
}

export default TikTokS;
