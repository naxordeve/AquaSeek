const fetch = require('node-fetch');

async function TNewsDetails() {
  const url = "https://bk9.fun/details/tnews";
  const res = await fetch(url);
  const data = await res.json();
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

module.exports = { TNewsDetails };
