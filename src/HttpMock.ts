import { join } from 'path';
import { unescape } from 'querystring';
import http from 'http';
import https from 'https';
import express from 'express';
import cors from 'cors';
import { match } from 'path-to-regexp';
import type { Express, NextFunction, Request, Response } from 'express';
import { queryServerByHttps } from './utils';

type Config = {
  cwd?: string;
  host?: string;
  port?: number;
  https?: boolean;
  mockDir?: string;
  onLuanch?: () => void;
};

type MockApi = {
  path: string;
  method: string;
  match: (path: string) => unknown;
  mock: Record<string, unknown>;
};

type MockApis = {
  [key: string]: MockApi;
};

const MOCK_SEPARATOR = ' ';
const DEFAULT_MOCK_DIR = 'mocks';

const collectMockFiles = async (cwd: string, mockDir: string) => {
  const dirPath = join(cwd, mockDir, 'api.js');
  const { default: mocks } = await import(dirPath);
  return Object.keys(mocks).reduce((result: MockApis, key) => {
    const [method, path] = key.split(MOCK_SEPARATOR);
    const mock = mocks[key];
    const matcher = match(path, { decode: unescape });
    result[key] = { path, method, match: matcher, mock };
    return result;
  }, {});
};

const compareMockApis = (method: string, path: string, mockApis: MockApis) => {
  const key = `${method}${MOCK_SEPARATOR}${path}`;

  if (key in mockApis) {
    return mockApis[key];
  }

  let i = 0;
  const keys = Object.keys(mockApis);
  while (i < keys.length) {
    const mockApi = mockApis[keys[i]];
    if (mockApi.match(path)) {
      return mockApi;
    }
    i++;
  }
};

const createMockMiddleware = (params: { cwd: string; mockDir: string }) => {
  const { cwd, mockDir } = params;
  return async (req: Request, res: Response, next: NextFunction) => {
    const { method, path } = req;
    let mockApis: MockApis = {};
    try {
      mockApis = await collectMockFiles(cwd, mockDir);
    } catch (err) {
      console.error(err);
      res.status(500);
      res.send(`Cannot find the mock directory ${mockDir} in ${cwd}`);
      return next();
    }
    try {
      const matched = compareMockApis(method, path, mockApis);
      if (matched) {
        const { mock } = matched;
        res.send(mock);
      } else {
        res.status(404);
        res.send(`Cannot find ${method} ${path}`);
      }
    } catch (err) {
      console.error(err);
      res.status(500);
      res.send(`Cannot find ${method} ${path}`);
      return next();
    }
    return next();
  };
};

class HttpMock {
  public readonly config: Config;

  public app!: Express;

  public server!: http.Server | https.Server;

  constructor(config?: Config) {
    this.config = { host: '0.0.0.0', port: 9002, https: false, ...config };
  }

  public createApp() {
    const { cwd = process.cwd(), mockDir = DEFAULT_MOCK_DIR } = this.config;
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(createMockMiddleware({ cwd, mockDir }));
  }

  public start(): http.Server | https.Server {
    const { app } = this;
    const { host, port, onLuanch } = this.config;
    this.server = queryServerByHttps(Boolean(this.config.https), app);
    this.server.listen(port, host, onLuanch);
    return this.server;
  }
}

export default HttpMock;
