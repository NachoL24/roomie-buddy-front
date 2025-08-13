import { environment as buildEnv } from './env';

export interface Environment {
  API_BASE_URL: string;
  auth0: {
    domain: string;
    clientId: string;
    audience: string;
  };
}

export function getEnvironment(): Environment {
  const w = window as any;
  const env = (w && w.__env) ? w.__env : {};

  return {
    API_BASE_URL: env.API_BASE_URL || "buildEnv.API_BASE_URL",
    auth0: {
      domain: env.AUTH0_DOMAIN || "buildEnv.auth0.domain",
      clientId: env.AUTH0_CLIENT_ID || "buildEnv.auth0.clientId",
      audience: env.AUTH0_AUDIENCE || "buildEnv.auth0.audience",
    },
  };
}
