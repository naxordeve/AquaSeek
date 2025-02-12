const id3 = require("browser-id3-writer");
const { fromBuffer } = require("file-type");
const axios = require('axios')
const fs = require('fs');

async function getBuffer(url, options = {}) {
  try {
    const res = await axios({
      method: "GET",
      url,
      headers: {
        DNT: 1,
        "Upgrade-Insecure-Request": 1,
      },
      ...options,
      responseType: "arraybuffer",
    });
    return res.data;
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
}

AddMetaData: async (
    songbuffer,
    coverBuffer,
    options = { title: "AquaSeek Bot", artist: ["Diegoson"] }
  ) => {
    if (!Buffer.isBuffer(songbuffer)) {
      songbuffer = await getBuffer(songbuffer);}
    if (!Buffer.isBuffer(coverBuffer)) {
    coverBuffer = await getBuffer(coverBuffer);}
    const writer = new id3(songbuffer);
    writer
      .setFrame("TIT2", options.title)
      .setFrame("TPE1", ["Diegoson"])
      .setFrame("APIC", {
        type: 3,
        data: coverBuffer,
        description: "By AquaSeek",
      });

    writer.addTag();
    return Buffer.from(writer.arrayBuffer);
  },

    module.exports = {
        getBuffer,
        AddMetaData
    };
