import axios from 'axios';

const Func = async (url: string): Promise<{ "720p": string; "360p": string } | null> => {
  const _api = `https://diegoson-naxordeve.hf.space/facebook?url=${url}`;
  try {
    const { data } = await axios.get(_api);
    if (data?.data) {
      return {
        "720p": data.data["720p (HD)"],
        "360p": data.data["360p (SD)"]
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

export { Func };
                                                                   
