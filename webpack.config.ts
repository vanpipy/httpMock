import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
  target: 'node',
  mode: 'production',
  devtool: 'source-map',
  entry: './src/index.ts',
  output: {
    clean: true,
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

export default config;
