const fetch = require('node-fetch');

const APIS = {
  npmSearch: async (packageName) => {
    const _api = `https://api.siputzx.my.id/api/stalk/npm?packageName=${packageName}`;
    try {
      const res = await fetch(_api);
      const result = await res.json();
      if (!result.status) {
      throw new Error("err");
      }
      const {
        name,
        versionLatest,
        versionPublish,
        versionUpdate,
        latestDependencies,
        publishDependencies,
        publishTime,
        latestPublishTime,
      } = result.data;
      return {
        packageName: name,
        latestVersion: versionLatest,
        initialVersion: versionPublish,
        updatesCount: versionUpdate,
        latestDependenciesCount: latestDependencies,
        initialDependenciesCount: publishDependencies,
        firstPublished: new Date(publishTime).toLocaleString(),
        lastUpdated: new Date(latestPublishTime).toLocaleString(),
      };
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  GIT: async (githubUser) => {
    const _api = `https://api.siputzx.my.id/api/stalk/github?user=${githubUser}`;
    try {
      const res = await fetch(_api);
      const result = await res.json();
      if (!result.status) {
      throw new Error("err");
      }
      const {
        username,
        nickname,
        bio,
        profile_pic,
        url,
        type,
        admin,
        company,
        blog,
        location,
        public_repo,
        public_gists,
        followers,
        following,
        created_at,
        updated_at,
      } = result.data;
      return {
        username,
        nickname,
        bio,
        profilePicture: profile_pic,
        profileUrl: url,
        userType: type,
        isAdmin: admin,
        company,
        blog,
        location,
        publicRepos: public_repo,
        publicGists: public_gists,
        followers,
        following,
        accountCreated: new Date(created_at).toLocaleString(),
        lastUpdated: new Date(updated_at).toLocaleString(),
      };
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },
};

module.exports = { APIS };
        
