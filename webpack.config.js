const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.ts',
    tafacil: './src/tafacil/index.ts'
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

    // Endpoint: mtmg.com.br/tafacil
    new HTMLWebpackPlugin({
      title: 'Matemagincana 11 - ???',
      template: 'src/tafacil/index.html',
      filename: 'tafacil/index.html',
      chunks: ['tafacil']
    })
  ]
};
