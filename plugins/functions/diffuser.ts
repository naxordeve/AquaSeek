import axios from 'axios';

interface DiffuserImg {
  imageBuffer?: ArrayBuffer;
  error?: string;
}
export async function Diffuser(prompt: string, model?: string | null): Promise<DiffuserImg> {
  const models = ['3d', 'manga', 'realistic', 'anime', 'pixel', 'lofi'];
  if (!model) {
    model = models[Math.floor(Math.random() * models.length)];}
  if (!models.includes(model)) {
    return { error: `Supported models: ${models.join(', ')}` };}
  const apiUrl = `https://itzpire.com/ai/stable-diffusion?prompt=${encodeURIComponent(prompt)}&model=${model}`;
  try {
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    return { imageBuffer: response.data };
  } catch (error) {
    return { error: 'err' };
  }
}
