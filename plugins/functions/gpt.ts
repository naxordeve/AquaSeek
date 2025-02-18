import fetch from 'node-fetch';

const ChatGPT = async (input: string): Promise<string> => {
  const url = `https://api.rendigital.store/endepoin/chatgpt?input=${input}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data.status) {
    throw new Error('Error fetching ChatGPT response');
  }

  return data.content;
};

const GeminiAI = async (text: string): Promise<string> => {
  const url = `https://api.ahmmikun.live/api/ai/gemini?text=${text}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data.data.status) {
    throw new Error('Error fetching GeminiAI response');
  }

  return data.data.response;
};

/*
const SimAI = async (query: string): Promise<string> => {
  const url = `https://api.ahmmikun.live/api/ai/simai?q=${query}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data.data.status) {
    throw new Error('Error fetching SimAI response');
  }

  return data.data.response;
};
*/

export { ChatGPT, GeminiAI };
