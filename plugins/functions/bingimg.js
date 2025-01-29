const fetch = require("node-fetch");

function BingImageGen() {
this.API_URL = "https://api.siputzx.my.id/api/s/bimg";}
BingImageGen.prototype.fetchImages = async function (query) {
  try {
    const voidi = await fetch(`${this.API_URL}?query=${query}`);
    if (!voidi.ok) {
    throw new Error(`${voidi.status}`);}
    const data = await voidi.json();
    if (data.status && Array.isArray(data.data)) {
    return data.data;
    } else {
    console.warn(data);
    return [];
    }
  } catch (error) {
    console.error(`${error.message}`);
    return [];
  }
};

mmodule.exports = {BingImageGen};
