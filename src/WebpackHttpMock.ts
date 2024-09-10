import { Compiler } from 'webpack';
import HttpMock from './HttpMock';

class WebpackHttpMock {
  mocker!: HttpMock;

  apply(compiler: Compiler) {
    compiler.hooks.run.tap('WebpackHttpMock', async () => {
      this.mocker = new HttpMock({
        onLuanch: () => {
          console.log('Http mock server is running');
        },
      });
      this.mocker.start();
    });
    compiler.hooks.shutdown.tap('WebpackHttpMock', async () => {
      this.mocker.server.close();
      console.log('Http mock server is closed');
    })
  }
}

export default WebpackHttpMock;
