const path = require('path');
// var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}


module.exports = {
  // entry: './resources/script.js',
  entry: './resources/d3-metric.js',
    // entry: './resources/libraries.js',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, 'resources'),
    publicPath: "/"
  },
  module: {
    rules: [{
      test: /\.vue$/,
       include: [
                path.resolve(__dirname, 'node_modules'),
                path.resolve(__dirname, './node_modules/d3-vs/src/components/d3Metric/d3Metric.vue'), // <== This solved the issue
            ],
      loader: 'vue-loader',
      options: {
        loaders: {
          css: ['vue-style-loader', {
            loader: 'css-loader',
          }],
          js: [
            'babel-loader',
          ],
        },
        cacheBursting: true,
        
      },
    },
            {
              test: /\.js$/,
              // exclude: path.resolve(__dirname, 'node_modules/'),
              loader: 'babel-loader',
              options: {
                // plugins: ['lodash'],
                // plugins: ['dynaimic-import-webpack'],
                presets: [
                  ['vue'],
                  ['env', { 'modules': false, 'targets': { 'node': 4 }}]
                ]
                // 'presets': [['env', { 'modules': false, 'targets': { 'node': 4 } }]]
              }
            },
            {
              test: /\.css$/,
              loader: 'style-loader!css-loader',
             },
            {
              test: /\.(png|jpg|gif|svg)$/,
              loader: 'file-loader',
              options: {
                name: '[name].[ext]?[hash]'
              }
            },
           ]
  },
  plugins: [
    new VueLoaderPlugin(),
    // new LodashModuleReplacementPlugin
  ],
  resolveLoader: {
    modules: ['/home/stlk/projects/jolly-fish-42/node_modules'],
  },
  resolve: {
    modules: ['/home/stlk/projects/jolly-fish-42/node_modules'],
    alias: {
      '../../node_modules/leaflet-fullscreen/dist/leaflet.fullscreen.css': path.resolve(__dirname, "./node_modules/leaflet-fullscreen/dist/leaflet.fullscreen.css"),
      '../../node_modules/leaflet/dist/leaflet.css': path.resolve(__dirname, "./node_modules/leaflet/dist/leaflet.css"),
      "./images/layers.png$": path.resolve(__dirname, "./node_modules/leaflet/dist/images/layers.png"),
      "./images/layers-2x.png$": path.resolve(__dirname, "./node_modules/leaflet/dist/images/layers-2x.png"),
      "./images/marker-icon.png$": path.resolve(__dirname, "./node_modules/leaflet/dist/images/marker-icon.png"),
      "./images/marker-icon-2x.png$": path.resolve(__dirname, "./node_modules/leaflet/dist/images/marker-icon-2x.png"),
      "./images/marker-shadow.png$": path.resolve(__dirname, "./node_modules/leaflet/dist/images/marker-shadow.png")
    }
  }
}
