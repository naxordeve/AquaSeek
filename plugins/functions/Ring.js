const fetch = require('node-fetch');

async function Ring(query) {
  const _api = `https://bk9.fun/download/RingTone?q=${query}`;
  try {
    const response = await fetch(_api);
    if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);}
    const data = await response.json();
    if (!data.status || !data.BK9 || data.BK9.length === 0) {
    throw new Error("No results found");}
    return data.BK9.map(item => ({
      title: item.title,
      source: item.source,
      audio: item.audio
    }));
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

module.exports = {Ring};
