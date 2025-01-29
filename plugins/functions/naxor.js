const fetch = require('node-fetch');

module.exports = {
  Yousearch: async function (query) {
    const ap = `https://api.siputzx.my.id/api/ai/yousearch?text=${query}`;
    try {
      const res = await fetch(ap);
      const data = await res.json();
      if (data.status) {
      return data.data;
      } else {
      throw new Error('err');
      }
    } catch (error) {
      console.error(error.message);
      return 'try again later';
    }
  },

  Venice: async function (prompt) {
    const ap = `https://api.siputzx.my.id/api/ai/venice?prompt=${prompt}`;
    try {
      const res = await fetch(ap);
      const data = await res.json();
      if (data.status) {
      return data.message; 
      } else {
      throw new Error('err');
      }
    } catch (error) {
      console.error( error.message);
      return 'Please try again later';
    }
  },

  Diffuser: async function (prompt) {
    const ap = `https://api.siputzx.my.id/api/ai/stable-diffusion?prompt=${prompt}`;
    try {
      const res = await fetch(ap);
      const data = await res.json();
      if (data.status) {
      return data.data;
      } else {
      throw new Error('err');
      }
    } catch (error) {
      console.error(error.message);
      return 'try again later';
    }
  },

  BlackBox: async function (content) {
    const ap = `https://api.siputzx.my.id/api/ai/blackboxai?content=${content}`;
    try {
      const res = await fetch(ap);
      const data = await res.json();
      if (data.status) {
      return data.data; 
      } else {
      throw new Error('err');
      }
    } catch (error) {
      console.error(error.message);
      return 'try again later';
    }
  },

 AoyoContent: async function (content) {
    const ap = `https://api.siputzx.my.id/api/ai/aoyo?content=${content}`;
    try {
      const res = await fetch(ap);
      const data = await res.json();
      if (data.status) {
      return data.data;
      } else {
      throw new Error('err');
      }
    } catch (error) {
      console.error(error.message);
      return 'try again later';
    }
  },

  Mistral: async function (content) {
    const ap = `https://api.siputzx.my.id/api/ai/mistral-7b-instruct-v0.2?content=${content}`;
    try {
      const res = await fetch(ap);
      const data = await res.json();
      if (data.status) {
      return data.data; 
      } else {
      throw new Error('err');
      }
    } catch (error) {
      console.error(error.message);
      return 'try again later';
    }
  }
};
                                                                                        
