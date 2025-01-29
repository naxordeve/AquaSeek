const fetch = require('node-fetch'); 

async function getMorphic(query) {
  const mor = `https://itzpire.com/ai/morphic?q=${query}`;
  const rese = await fetch(mor);
  if (!rese.ok) return { error: ` ${rese.status}` };
  const data = await rese.json();
  if (data.status === "success" && data.code === 200) {
    return {
    author: data.author,
    result: data.data.result,
    related: data.data.related,
    };
  }

  return { error: `${data.status}` };
 }

module.exports = { getMorphic };
