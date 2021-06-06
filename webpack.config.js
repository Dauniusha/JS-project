const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');


const devServer = (isDev) => !isDev ? {} : {
  devServer: {
    open: true,
    hot: true,
    port: 8080,
    contentBase: path.join(__dirname, '/dist'),
  },
};

const esLintPlugin = (isDev) => isDev ? [] : [ new ESLintPlugin({ extensions: ['ts', 'js'] }) ];

module.exports = ({development})=>( { //деструктуризация
  mode: development ? 'development' : 'production',
  devtool: development ? 'inline-source-map' : false, 
  entry: './async-race/src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'assets/[hash][ext]', //хеширование изменяемых файлов
  },
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'], //чем загружать
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ],
    
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    ...esLintPlugin(development),
    new ESLintPlugin({ extensions: ['ts', 'js'] }),
    new HtmlWebpackPlugin({
      title: 'Async-race',
      // template: './src/index.html',
    }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }), 
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    //копирование файлов не требуемых хеширования (без последующего изменения)
    //!без содержимого папки public билд не соберется
    /*  new CopyPlugin({ 
      patterns: [
        { from: 'async-race/public' },
      ],
    }),*/
  ],
  ...devServer(development)
});