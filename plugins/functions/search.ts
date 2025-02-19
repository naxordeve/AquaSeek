import axios from 'axios';

const APIS = {
  npmSearch: async (packageName: string): Promise<{ packageName: string; latestVersion: string; initialVersion: string; updatesCount: number; latestDependenciesCount: number; initialDependenciesCount: number; firstPublished: string; lastUpdated: string } | null> => {
    const _api = `https://api.siputzx.my.id/api/stalk/npm?packageName=${packageName}`;
    try { const { data } = await axios.get(_api);
      if (!data.status) {
        throw new Error("Err");}
      const { name, versionLatest, versionPublish, versionUpdate, latestDependencies, publishDependencies, publishTime, latestPublishTime } = data.data;
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
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  },

  GIT: async (githubUser: string): Promise<{ username: string; nickname: string; bio: string; profilePicture: string; profileUrl: string; userType: string; isAdmin: boolean; company: string; blog: string; location: string; publicRepos: number; publicGists: number; followers: number; following: number; accountCreated: string; lastUpdated: string } | null> => {
    const _api = `https://api.siputzx.my.id/api/stalk/github?user=${githubUser}`;
    try { const { data } = await axios.get(_api);
      if (!data.status) {
        throw new Error("Err");}
      const { username, nickname, bio, profile_pic, url, type, admin, company, blog, location, public_repo, public_gists, followers, following, created_at, updated_at } = data.data;
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
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  },
};

export { APIS };
                                            
