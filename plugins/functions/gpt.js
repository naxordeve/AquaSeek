const fetch = require('node-fetch');

async function ChatGPT(input) {
  var url = `https://api.rendigital.store/endepoin/chatgpt?input=${input}`;
  var voidi = await fetch(url);
  var data = await voidi.json();
  if (!data.status) throw new Error('err');
  return data.content;
}

async function GeminiAI(text) {
  const url = `https://api.ahmmikun.live/api/ai/gemini?text=${text}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.data.status) throw new Error('err');
  return data.data.response;
}

/*async function SimAI(query) {
  const url = `https://api.ahmmikun.live/api/ai/simai?q=${query}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.data.status) throw new Error('err');
  return data.data.response;
}
*/

module.exports = { ChatGPT,GeminiAI };
