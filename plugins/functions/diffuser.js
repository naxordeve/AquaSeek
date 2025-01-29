const fetch = require('node-fetch');

async function Diffuser(prompt, model = null) {
  const modi = ['3d', 'manga', 'realistic', 'anime', 'pixel', 'lofi'];
  if (!model) {
   model = modi[Math.floor(Math.random() * modi.length)];
   }
  if (!modi.includes(model)) {
    return { error: `${modi.join(', ')}` };
  }

  const ap = `https://itzpire.com/ai/stable-diffusion?prompt=${prompt}&model=${model}`;
  const res = await fetch(ap);
  if (!res.ok) {
    return { error: `${res.status}` };
  }

  const imageBuffer = await res.arrayBuffer(); 
  return { imageBuffer }; 
}

module.exports = { Diffuser };
