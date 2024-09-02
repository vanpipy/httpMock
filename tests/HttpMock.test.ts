import type { Express } from 'express';
import HttpMock from '../src/HttpMock';
import { queryServerByHttps } from '../src/utils';

jest.mock('../src/utils', () => {
  return {
    queryServerByHttps: jest.fn(),
  };
});

describe('HttpMock', () => {
  const onLuanch = jest.fn();
  const mockedListen = jest.fn();
  const httpCreateServer = jest.fn().mockImplementation(() => {
    return {
      listen: mockedListen,
    };
  });
  const httpsCreateServer = jest.fn().mockImplementation(() => {
    return {
      listen: mockedListen,
    };
  });
  const mocked = queryServerByHttps as jest.MockedFunction<typeof queryServerByHttps>;
  mocked.mockImplementation((hasHttps: boolean, app: Express) => {
    return hasHttps ? httpsCreateServer(app) : httpCreateServer(app);
  });

  it('should listen http://0.0.0.0:9002 defaultly', async () => {
    const httpMock = new HttpMock({ onLuanch });
    httpMock.createApp();
    httpMock.start();
    expect(httpCreateServer).toHaveBeenCalledWith(httpMock.app);
    expect(mockedListen).toHaveBeenCalledWith(9002, '0.0.0.0', onLuanch);
  });

  it('should listen https://0.0.0.0:9002 when the https is true', async () => {
    const httpMock = new HttpMock({ https: true, onLuanch });
    httpMock.createApp();
    httpMock.start();
    expect(httpsCreateServer).toHaveBeenCalledWith(httpMock.app);
    expect(mockedListen).toHaveBeenCalledWith(9002, '0.0.0.0', onLuanch);
  });

  it('should listen http://127.0.0.0:1080 when custom the host and port', async () => {
    const httpMock = new HttpMock({ host: '127.0.0.0', port: 1080, onLuanch });
    httpMock.createApp();
    httpMock.start();
    expect(mockedListen).toHaveBeenCalledWith(1080, '127.0.0.0', onLuanch);
  });

  it('should custom the lanuch callback', async () => {
    const onLuanch = () => {};
    const httpMock = new HttpMock({ onLuanch });
    httpMock.createApp();
    httpMock.start();
    expect(mockedListen).toHaveBeenCalledWith(9002, '0.0.0.0', onLuanch);
  });
});
