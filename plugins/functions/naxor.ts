import fetch from 'node-fetch';

interface APIResponse<T> {
  status: boolean;
  data?: T;
  message?: string;
}

const API_BASE_URL = "https://api.siputzx.my.id/api/ai";
const AI_APIS = {
  Yousearch: async (query: string): Promise<any | string> => {
    const url = `${API_BASE_URL}/yousearch?text=${query}`;
    try {
      const res = await fetch(url);
      const data: APIResponse<any> = await res.json();
      if (data.status) {
        return data.data;
      } else {
        throw new Error('Error fetching Yousearch results');
      }
    } catch (error: any) {
      console.error(error.message);
      return 'Try again later';
    }
  },

  Venice: async (prompt: string): Promise<string> => {
    const url = `${API_BASE_URL}/venice?prompt=${prompt}`;
    try {
      const res = await fetch(url);
      const data: APIResponse<string> = await res.json();
      if (data.status) {
        return data.message || '';
      } else {
        throw new Error('Error fetching Venice results');
      }
    } catch (error: any) {
      console.error(error.message);
      return 'Please try again later';
    }
  },

  Diffuser: async (prompt: string): Promise<any | string> => {
    const url = `${API_BASE_URL}/stable-diffusion?prompt=${prompt}`;
    try {
      const res = await fetch(url);
      const data: APIResponse<any> = await res.json();
      if (data.status) {
        return data.data;
      } else {
        throw new Error('Error fetching Diffuser results');
      }
    } catch (error: any) {
      console.error(error.message);
      return 'Try again later';
    }
  },

  BlackBox: async (content: string): Promise<any | string> => {
    const url = `${API_BASE_URL}/blackboxai?content=${content}`;
    try {
      const res = await fetch(url);
      const data: APIResponse<any> = await res.json();
      if (data.status) {
        return data.data;
      } else {
        throw new Error('Error fetching BlackBox results');
      }
    } catch (error: any) {
      console.error(error.message);
      return 'Try again later';
    }
  },

  AoyoContent: async (content: string): Promise<any | string> => {
    const url = `${API_BASE_URL}/aoyo?content=${content}`;
    try {
      const res = await fetch(url);
      const data: APIResponse<any> = await res.json();
      if (data.status) {
        return data.data;
      } else {
        throw new Error('Error fetching AoyoContent results');
      }
    } catch (error: any) {
      console.error(error.message);
      return 'Try again later';
    }
  },

  Mistral: async (content: string): Promise<any | string> => {
    const url = `${API_BASE_URL}/mistral-7b-instruct-v0.2?content=${content}`;
    try {
      const res = await fetch(url);
      const data: APIResponse<any> = await res.json();
      if (data.status) {
        return data.data;
      } else {
        throw new Error('Error fetching Mistral results');
      }
    } catch (error: any) {
      console.error(error.message);
      return 'Try again later';
    }
  }
};

export { AI_APIS };
    
