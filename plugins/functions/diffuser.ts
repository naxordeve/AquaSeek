import fetch from 'node-fetch';

interface DiffuserImg {
  imageBuffer?: ArrayBuffer;
  error?: string;
}

export async function Diffuser(prompt: string, model?: string | null): Promise<DiffuserImg> {
  const models = ['3d', 'manga', 'realistic', 'anime', 'pixel', 'lofi'];
  if (!model) {
    model = models[Math.floor(Math.random() * models.length)];
  }
  if (!models.includes(model)) {
    return { error: `Supported models: ${models.join(', ')}` };
  }
  const apiUrl = `https://itzpire.com/ai/stable-diffusion?prompt=${prompt}&model=${model}`;
  try { const response = await fetch(apiUrl);
    if (!response.ok) {
      return { error: `HTTP Error: ${response.status}` };
    }
    const imageBuffer = await response.arrayBuffer();
    return { imageBuffer };
  } catch (error) {
    return { error: 'err' };
  }
}
  
