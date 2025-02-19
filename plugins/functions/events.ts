import axios from 'axios';

interface ApiGet<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const ApiHandlers = {
  SoundCloud: async (url: string): Promise<ApiGet<{ title: string; thumbnail: string; audioUrl: string }>> => {
    const search = `https://api.siputzx.my.id/api/d/soundcloud?url=${url}`;
    try { const res = await axios.get(search);
      const data = res.data;
      return data.status
        ? { success: true, data: { title: data.data.title, thumbnail: data.data.thumbnail, audioUrl: data.data.url } }
        : { success: false, message: 'err' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  CapCut: async (capcutUrl: string): Promise<ApiGet<any>> => {
    const _api = `https://api.siputzx.my.id/api/d/capcut?url=${capcutUrl}`;
    return getApiget(_api);
  },
  MusicApple: async (musicAppleUrl: string): Promise<ApiGet<any>> => {
    const _api = `https://api.siputzx.my.id/api/d/musicapple?url=${musicAppleUrl}`;
    return getApiget(_api);
  },
  AppleMusicSearch: async (query: string): Promise<ApiGet<{ title: string; artist: string; link: string; image: string }[]>> => {
    const _api = `https://api.siputzx.my.id/api/s/applemusic?query=${query}`;
    try { const response = await axios.get(_api);
      const data = response.data;
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
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  YtPost: async (ytUrl: string): Promise<ApiGet<any>> => {
    const _api = `https://api.siputzx.my.id/api/d/ytpost?url=${ytUrl}`;
    return getApiget(_api);
  },
  Pinterest: async (pinterestUrl: string): Promise<ApiResponse<any>> => {
    const _api = `https://api.siputzx.my.id/api/d/pinterest?url=${pinterestUrl}`;
    return getApiget(_api);
  },
  SaveFrom: async (videoUrl: string): Promise<ApiGet<any>> => {
    const _api = `https://api.siputzx.my.id/api/d/savefrom?url=${videoUrl}`;
    return getApiget(_api);
  },
  Lahelu: async (laheluUrl: string): Promise<ApiGet<any>> => {
    const _api = `https://api.siputzx.my.id/api/d/lahelu?url=${laheluUrl}`;
    return getApiget(_api);
  },
};

async function getApiget(apiUrl: string): Promise<ApiGet<any>> {
  try { const response = await axios.get(apiUrl);
    const data = response.data;
    return data.status ? { success: true, data: data.data } : { success: false, message: 'err' };
  } catch (error) {
    return { success: false, message: error.message };
  }
        }
                    
