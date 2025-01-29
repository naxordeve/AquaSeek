const fetch = require('node-fetch'); 

async function searchPinterest(query) {
  if (!query) 
  return { error: 'Query is required' };
  const vote = `https://itzpire.com/search/pinterest?query=${query}`;
  const res = await fetch(vote);
  if (!res.ok) 
  return { error: `${res.status}` };
  const data = await res.json();
  if (data.status === "success" && data.code === 200) {
    return data.data.map((item) => ({
      uploadBy: item.upload_by,
      fullName: item.fullname,
      followers: item.followers,
      caption: item.caption,
      image: item.image,
      source: item.source,
    }));
  }

  return { error: `${data.status}` };
}

async function searchWikipedia(query) {
  const res = await fetch(`https://itzpire.com/search/wikipedia?query=${query}`);
  const data = await res.json();
  if (data.status !== 'success') 
  return 'err hehe negro';
  const results = JSON.parse(data.data);
  if (results.length === 0) 
  return 'No results found for your query';
  const limitedResults = results.slice(0, 18); 
  return limitedResults.map((item, index) => {
    return `**${index + 1}. ${item.title}**\n` +
           `*[Link]*: ${item.link}\n` +
           `*Description*: ${item.description}\n` +
           (item.imageUrl ? `Image: ${item.imageUrl}\n` : '') +
           `*Size*: ${item.size}\n` +
           `*Last Updated*: ${item.lastUpdated}\n\n`;
  }).join('\n');
}


module.exports = { searchPinterest, searchWikipedia };
