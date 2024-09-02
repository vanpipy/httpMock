import https from 'https';
import http from 'http';
import type { Express } from 'express';

export const queryServerByHttps = (hasHttps: boolean, app: Express) => {
  return hasHttps ? https.createServer(app) : http.createServer(app);
};
