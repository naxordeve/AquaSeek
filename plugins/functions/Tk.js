const fetch = require('node-fetch');

async function TKAnnis(username) {
  const url = `https://bk9.fun/stalk/tiktok?q=${username}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status) {
    return {
      profileImage: data.BK9.profile,
      name: data.BK9.name,
      username: data.BK9.username,
      followers: data.BK9.followers,
      following: data.BK9.following,
      bio: data.BK9.bio,
      likes: data.BK9.likes,
    };
  }
  return null;
}

module.exports = { TKAnnis };
    
