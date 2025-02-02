import GhostAdminAPI from '@tryghost/admin-api';

interface GhostConfig {
  apiUrl: string;
  adminApiKey: string;
  version: string;
}

export const getConfig = (): GhostConfig => {
  const apiUrl = process.env.GHOST_API_URL;
  const adminApiKey = process.env.GHOST_ADMIN_API_KEY;

  if (!apiUrl || !adminApiKey) {
    throw new Error('GHOST_API_URL and GHOST_ADMIN_API_KEY environment variables are required');
  }

  return {
    apiUrl,
    adminApiKey,
    version: 'v5.0'
  };
};

export const createGhostApi = (): GhostAdminAPI => {
  const config = getConfig();
  return new GhostAdminAPI({
    url: config.apiUrl,
    key: config.adminApiKey,
    version: config.version
  });
};