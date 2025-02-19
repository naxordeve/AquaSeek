import axios from 'axios';

const ChatGPT = async (input: string): Promise<string> => {
  try { const { data } = await axios.get(`https://api.rendigital.store/endepoin/chatgpt?input=${input}`);
    if (!data.status) throw new Error('Error fetching ChatGPT response');
    return data.content;
  } catch { throw new Error('Request failed'); }
};

const GeminiAI = async (text: string): Promise<string> => {
  try { const { data } = await axios.get(`https://api.ahmmikun.live/api/ai/gemini?text=${text}`);
    if (!data.data.status) throw new Error('Error fetching GeminiAI response');
    return data.data.response;
  } catch { throw new Error('Request failed'); }
};

/*
const SimAI = async (query: string): Promise<string> => {
  try { const { data } = await axios.get(`https://api.ahmmikun.live/api/ai/simai?q=${query}`);
    if (!data.data.status) throw new Error('Error fetching SimAI response');
    return data.data.response;
  } catch { throw new Error('Request failed'); }
};
*/

export { ChatGPT, GeminiAI };
