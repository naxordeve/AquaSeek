import fetch from 'node-fetch';

const Func = async (url: string): Promise<{ "720p": string; "360p": string } | null> => {
  const _api = `https://diegoson-naxordeve.hf.space/facebook?url=${url}`;
  try {
    const res = await fetch(_api);
    const data = await res.json();

    if (data && data.data) {
      return {
        "720p": data.data["720p (HD)"],
        "360p": data.data["360p (SD)"]
      };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export { Func };
