import { rm } from 'fs/promises';
import supertest from 'supertest';
import { resolve } from 'path';
import HttpMock from '../src/HttpMock';
import { setFixturePkg } from './utils';

describe('HttpMock', () => {
  const repoCwd = process.cwd();
  const defaultMocks = resolve(__dirname, '../mocks');

  beforeAll(async () => {
    await setFixturePkg('demo', defaultMocks);
  });

  afterAll(async () => {
    await rm(defaultMocks, { recursive: true, force: true });
  });

  it('should be 500 when the mock directory does not exist', async () => {
    const httpMock = new HttpMock({ mockDir: 'didNotExist' });
    httpMock.createApp();
    const request = supertest(httpMock.app);
    const response = await request.get('/');
    expect(response.text).toBe(`Cannot find the mock directory didNotExist in ${process.cwd()}`);
    expect(response.status).toBe(500);
  });

  it('should be 404 when the path access does not exist', async () => {
    const httpMock = new HttpMock({ cwd: repoCwd });
    httpMock.createApp();
    const request = supertest(httpMock.app);
    const response = await request.get('/root/not-exist');
    expect(response.text).toBe('Cannot find GET /root/not-exist');
    expect(response.status).toBe(404);
  });

  it('should be 200 and get the expected mocked data when the path access exists', async () => {
    const httpMock = new HttpMock({ cwd: repoCwd });
    httpMock.createApp();
    const request = supertest(httpMock.app);
    const response = await request.get('/root/api/1.0/role/query');
    expect(response.text).toEqual(JSON.stringify({ id: 'root-get' }));
    expect(response.status).toBe(200);
  });
});
