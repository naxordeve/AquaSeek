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
