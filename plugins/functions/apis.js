const fetch = require('node-fetch');

async function getSpotifyBangers(query) {
  const endpoint = `https://api.rendigital.store/endepoin/spotify?query=${query}`;
  const Object = await fetch(endpoint);
  if (!Object.ok) {
   throw new Error(`${Object.status}`);
  }
  const vibes = await Object.json();
  if (vibes.status) {
    return vibes.results.map(hit => ({
      trackNum: hit.trackNumber,
      songTitle: hit.trackName,
      artist: hit.artistName,
      album: hit.albumName,
      length: hit.duration,
      link: hit.externalUrl,
    }));
  } else {
    return [];
  }
}

async function getAppRuntime() {
  const endpoint = `https://api.rendigital.store/endepoin/runtime`;
  const response = await fetch(endpoint);
  if (!response.ok) {
  throw new Error(`${response.status}`);}
  const runtimeData = await response.json();
  if (runtimeData.status) {
    return {
      runtime: runtimeData.runtime,
      creator: runtimeData.creator,
    };
  } else {
    throw new Error("err");
  }
}

module.exports = { getSpotifyBangers, getAppRuntime };
