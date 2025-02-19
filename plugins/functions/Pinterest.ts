import axios from 'axios';

interface PinterestItem { uploadBy: string; fullName: string; followers: number; caption: string; image: string; source: string; }
interface Pinterests { status: string; code: number; data: PinterestItem[]; }
interface WikipediaItem { title: string; link: string; description: string; imageUrl?: string; size: string; lastUpdated: string; }
interface Wikipedias { status: string; data: string; }

async function searchPinterest(query: string): Promise<PinterestItem[] | { error: string }> {
  if (!query) return { error: 'Query is required' };
  try { const res = await axios.get(`https://itzpire.com/search/pinterest?query=${query}`);
    const data: Pinterests = res.data;
    if (data.status === "success" && data.code === 200) {
      return data.data.map(item => ({
        uploadBy: item.uploadBy, fullName: item.fullName, followers: item.followers,
        caption: item.caption, image: item.image, source: item.source
      }));
    }
    return { error: `${data.status}` };
  } catch (error) {
    console.error(error.message);
    return { error: 'eer' };
  }
}

async function searchWikipedia(query: string): Promise<string> {
  try { const res = await axios.get(`https://itzpire.com/search/wikipedia?query=${query}`);
    const data: Wikipedias = res.data;
    if (data.status !== 'success') return 'No results found';
    const results: WikipediaItem[] = JSON.parse(data.data);
    if (results.length === 0) return 'No results found for your query';
    return results.slice(0, 18).map((item, i) => 
      `**${i + 1}. ${item.title}**\n*[Link]*: ${item.link}\n*Description*: ${item.description}\n` +
      (item.imageUrl ? `Image: ${item.imageUrl}\n` : '') + `*Size*: ${item.size}\n*Last Updated*: ${item.lastUpdated}\n\n`
    ).join('\n');
  } catch (error) {
    console.error(error.message);
    return 'err';
  }
}

export { searchPinterest, searchWikipedia };
