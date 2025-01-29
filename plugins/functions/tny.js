const fetch = require('node-fetch'); // For Node.js versions below 18

const TinyURL = class {
  constructor(urll) {
    this.urll = urll;
  }

  async shortenUrl(url) {
    const res = await fetch(`${this.urll}${url}`);
    if (!res.ok) 
    throw new Error(`${res.statusText}`);
    const data = await res.json();
    if (!data.status)
    throw new Error("err");
    return data.result.link;
  }
};

module.exports = TinyURL;
