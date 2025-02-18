import fetch from 'node-fetch';

interface NpmPackage {
  packageName: string;
  latestVersion: string;
  initialVersion: string;
  updatesCount: number;
  latestDependenciesCount: number;
  initialDependenciesCount: number;
  firstPublished: string;
  lastUpdated: string;
}

interface GitHubUser {
  username: string;
  nickname: string;
  bio: string;
  profilePicture: string;
  profileUrl: string;
  userType: string;
  isAdmin: boolean;
  company: string;
  blog: string;
  location: string;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  accountCreated: string;
  lastUpdated: string;
}

const APIS = {
  npmSearch: async (packageName: string): Promise<NpmPackage | null> => {
    const _api = `https://api.siputzx.my.id/api/stalk/npm?packageName=${packageName}`;
    try {
      const res = await fetch(_api);
      const result = await res.json();
      if (!result.status) {
        throw new Error("Error fetching npm package data");
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
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  },

  GIT: async (githubUser: string): Promise<GitHubUser | null> => {
    const _api = `https://api.siputzx.my.id/api/stalk/github?user=${githubUser}`;
    try {
      const res = await fetch(_api);
      const result = await res.json();
      if (!result.status) {
        throw new Error("Error fetching GitHub user data");
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
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  },
};

export { APIS };
