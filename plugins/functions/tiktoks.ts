import axios from "axios";  

interface Video { title: string; duration: number; region: string; videoId: string; thumbnail: string; createdAt: string; stats: any; music: any; author: any; media: any; }  
interface Searcher { status: boolean; result: Video[]; }  
interface ErrorR { error: string; }  
class TikTokS {  
  private x: string;  
  constructor(x: string) { this.x = x; }  
  async search(query: string): Promise<(Video | ErrorR)[]> {  
    try { const { data } = await axios.get<Searcher>(`${this.x}?query=${query}`);  
      return data.status ? data.result : [{ error: "No results found" }];  
    } catch (error) {  
      return [{ error: "Request failed" }];  
    }  
  }  
}  

export default TikTokS;
