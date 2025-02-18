import fetch from 'node-fetch';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const ApiHandlers = {
  SoundCloud: async (url: string): Promise<ApiResponse<{ title: string; thumbnail: string; audioUrl: string }>> => {
    const search = `https://api.siputzx.my.id/api/d/soundcloud?url=${url}`;
    const res = await fetch(search);
    if (!res.ok) return { success: false, message: `${res.status}` };
    const data = await res.json();
    return data.status
      ? { success: true, data: { title: data.data.title, thumbnail: data.data.thumbnail, audioUrl: data.data.url } }
      : { success: false, message: 'err' };
  },

  CapCut: async (capcutUrl: string): Promise<ApiResponse<any>> => {
    const _api = `https://api.siputzx.my.id/api/d/capcut?url=${capcutUrl}`;
    return Apiget(_api);
  },

  MusicApple: async (musicAppleUrl: string): Promise<ApiResponse<any>> => {
    const _api = `https://api.siputzx.my.id/api/d/musicapple?url=${musicAppleUrl}`;
    return Apiget(_api);
  },

  AppleMusicSearch: async (query: string): Promise<ApiResponse<{ title: string; artist: string; link: string; image: string }[]>> => {
    const _api = `https://api.siputzx.my.id/api/s/applemusic?query=${query}`;
    const response = await fetch(_api);
    if (!response.ok) return { success: false, message: `${response.status}` };
    const data = await response.json();
    return data.status
      ? {
          success: true,
          data: data.data.result.map((item: any) => ({
            title: item.title,
            artist: item.artist,
            link: item.link,
            image: item.image,
          })),
        }
      : { success: false, message: 'err' };
  },

  YtPost: async (ytUrl: string): Promise<ApiResponse<any>> => {
    const _api = `https://api.siputzx.my.id/api/d/ytpost?url=${ytUrl}`;
    return getApiget(_api);
  },

  Pinterest: async (pinterestUrl: string): Promise<ApiResponse<any>> => {
    const _api = `https://api.siputzx.my.id/api/d/pinterest?url=${pinterestUrl}`;
    return getApiget(_api);
  },

  SaveFrom: async (videoUrl: string): Promise<ApiResponse<any>> => {
    const _api = `https://api.siputzx.my.id/api/d/savefrom?url=${videoUrl}`;
    return getApiget(_api);
  },

  Lahelu: async (laheluUrl: string): Promise<ApiResponse<any>> => {
    const _api = `https://api.siputzx.my.id/api/d/lahelu?url=${laheluUrl}`;
    return Apiget(_api);
  },
};

async function Apiget(apiUrl: string): Promise<ApiResponse<any>> {
  const response = await fetch(apiUrl);
  if (!response.ok) return { success: false, message: `${response.status}` };
  const data = await response.json();
  return data.status ? { success: true, data: data.data } : { success: false, message: 'err' };
    }
    
