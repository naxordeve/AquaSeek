import axios from 'axios';

interface Morphicc { author: string; result: string; related: string[]; }  
interface APIget { status: string; code: number; author?: string; data?: { result: string; related: string[]; }; }  
async function getMorphic(query: string): Promise<Morphicc | { error: string }> {  
  const url = `https://itzpire.com/ai/morphic?q=${query}`;  
  try { const { data } = await axios.get<APIget>(url);  
    return data.status === "success" && data.code === 200 && data.data ? { author: data.author || "Unknown", result: data.data.result, related: data.data.related } : { error: `${data.status}` };  
  } catch (error) {  
    console.error(error);  
    return { error: "Request failed" };  
  }  
}  

export { getMorphic };
