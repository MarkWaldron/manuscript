'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlPlugin = require('webpack-html-plugin');
var HasteResolverPlugin = require('haste-resolver-webpack-plugin');
const fs = require('fs-extra');
const CUSTOM_NODE_MODULES = fs.readJSONSync(path.resolve(__dirname, '../content/config/custom_node_modules.json'));

var IP = '0.0.0.0';
var PORT = 3000;
var NODE_ENV = process.env.NODE_ENV;
var ROOT_PATH = path.resolve(__dirname, '..');
var PROD = 'production';
var DEV = 'development';
let isProd = NODE_ENV === 'production';

var config = {
  paths: {
    src: path.join(ROOT_PATH, '.'),
    index: path.join(ROOT_PATH, 'index.web'),
  },
};

module.exports = {
  ip: IP,
  port: PORT,
  devtool: 'source-map',
  resolve: {
    alias: {
      'react-native': 'react-web',
      'ReactNativeART': 'react-art',
    },
    extensions: ['', '.js', '.jsx'],
  },
  entry: isProd? [
    config.paths.index
  ]: [
    'webpack-dev-server/client?http://' + IP + ':' + PORT,
    'webpack/hot/only-dev-server',
    config.paths.index,
  ],
  output: {
    path: path.join(__dirname, 'output'),
    filename: 'bundle.js'
  },
  plugins: [
    new HasteResolverPlugin({
      platform: 'web',
      nodeModules: ['react-web']
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(isProd? PROD: DEV),
      }
    }),
    isProd? new webpack.ProvidePlugin({
      React: "react"
    }): new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlPlugin(),
  ],
  module: {
    loaders: [{
      test: /\.json$/,
      loader: 'json',
    }, {
      test: /\.jsx?$/,
      loader: 'react-hot',
      include: [config.paths.src],
      exclude: [/node_modules/],
    }, {
      test: /\.js?$/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'react','react-native', 'latest'],
      },
      include: [config.paths.src],
      exclude: [/node_modules/],
    }, {
      test: /\.js?$/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'react','react-native', 'latest'],
        plugins: CUSTOM_NODE_MODULES['babel-plugins'],
      },
      //add your modules here
      include:  CUSTOM_NODE_MODULES['react-native-components'].map((native_component)=>{
        // console.log('list of mods',path.join(ROOT_PATH, `node_modules/${native_component.name}`))
        return path.join(ROOT_PATH, `node_modules/${native_component.name}`);
      }),
      
      // exclude:[/\.png$/gi]
    }, { 
      test: /\.css$/, 
      loader: 'style-loader!css-loader' 
    },
    {
      test   : /\.(ttf|eot|png|jpg|jpeg|svg|woff(2)?)(\?[a-z0-9-=&.]+)?$/,
      loader : 'file-loader'
    }]
  }
};