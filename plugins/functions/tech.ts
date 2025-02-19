import axios from "axios";  

interface NewsData { title: string; link: string; image: string; description: string; owner: string; }  
interface NewsAPI { status: boolean; BK9: { title: string; link: string; img: string; desc: string; }; owner: string; }  
async function TNewsDetails(): Promise<NewsData | null> {  
  try { const { data } = await axios.get<NewsAPI>("https://bk9.fun/details/tnews");  
    return data.status ? { title: data.BK9.title, link: data.BK9.link, image: data.BK9.img, description: data.BK9.desc, owner: data.owner } : null;  
  } catch (error) {  
    console.error(error);  
    return null;  
  }  
}  

export { TNewsDetails };
