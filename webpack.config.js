const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.ts',
    'minimat-senha': './src/minimat-senha/index.ts' 
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new webpack.DefinePlugin({
      BACKEND_URL: JSON.stringify(process.env.BACKEND_URL || 'localhost:5000')
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    }),

    // Endpoint: mtmg.com.br
    new HTMLWebpackPlugin({
      title: 'Matemagincana',
      template: 'src/index.html',
      filename: 'index.html',
      chunks: ['index']
    }),

    // Endpoint: mtmg.com.br/minimat-p3
    new HTMLWebpackPlugin({
      title: 'Minimatemagincana - Senha',
      template: 'src/minimat-senha/index.html',
      filename: 'minimat-senha/index.html',
      chunks: ['minimat-senha']
    }),
  ]
};
