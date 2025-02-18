import fetch from "node-fetch";

interface NewsData {
  title: string;
  link: string;
  image: string;
  description: string;
  owner: string;
}

interface NewsAPI {
  status: boolean;
  BK9: {
    title: string;
    link: string;
    img: string;
    desc: string;
  };
  owner: string;
}

async function TNewsDetails(): Promise<NewsData | null> {
  const url = "https://bk9.fun/details/tnews";
  const res = await fetch(url);
  const data: NewsAPI = await res.json();
  if (data.status) {
    return {
      title: data.BK9.title,
      link: data.BK9.link,
      image: data.BK9.img,
      description: data.BK9.desc,
      owner: data.owner,
    };
  }
  return null;
}

export { TNewsDetails };
  
