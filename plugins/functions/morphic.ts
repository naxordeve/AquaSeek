import fetch from 'node-fetch';

interface Morphicc {
  author: string;
  result: string;
  related: string[];
}

interface APIResponse {
  status: string;
  code: number;
  author?: string;
  data?: {
    result: string;
    related: string[];
  };
}

async function getMorphic(query: string): Promise<Morphicc | { error: string }> {
  const url = `https://itzpire.com/ai/morphic?q=${query}`;
  try { const res = await fetch(url);
    if (!res.ok) return { error: `${res.status}` };
    const data: APIResponse = await res.json();
    if (data.status === "success" && data.code === 200 && data.data) {
      return {
        author: data.author || "Unknown",
        result: data.data.result,
        related: data.data.related,
      };
    }
    return { error: `${data.status}` };
  } catch (error: any) {
    console.error(error.message);
    return { error: "Request failed" };
  }
}

export { getMorphic };
