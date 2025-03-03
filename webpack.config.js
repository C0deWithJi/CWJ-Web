const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './backend/queries.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new Dotenv()
  ],
  mode: 'development',
  devServer: {
    host: 'localhost',
    port: 5173,
    hot: true,
    open: true,
    client: {
      webSocketURL: 'ws://localhost:5173/ws',
    },
  },
};