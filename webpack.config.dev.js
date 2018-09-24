const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  entry: {
    // component: path.resolve(__dirname, './resources/overview-component.js'),
    // componentTimeline: path.resolve(__dirname, './resources/realtime-component.js'),
    componentTimeMachine: path.resolve(__dirname, './resources/time-machine-component.js')
  },
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
                path.resolve(__dirname, 'node_modules/')
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
              exclude: path.resolve(__dirname, './node_modules'),
              use: {
                loader: 'babel-loader',
                options: {
                  plugins: [
                    'dynamic-import-webpack',
                  ],
                  presets: [
                    ['vue'],
                    ['@babel/preset-env', { 'modules': false, 'targets': { 'node': 4 }}]
                  ]
                }
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
  ],
  resolveLoader: {
  modules: [path.resolve(__dirname, './node_modules')],
  },
  resolve: {
    modules: [path.resolve(__dirname, './node_modules')],
    alias: {
      'babel-loader': path.resolve(__dirname, "./node_modules/babel-loader"),
      'document-offset': path.resolve(__dirname, "./node_modules/document-offset"),
      'lodash': path.resolve(__dirname, "./node_modules/lodash"),
      '@babel/preset-env': path.resolve(__dirname, "./node_modules/@babel/preset-env"),
      'vue': path.resolve(__dirname, "./node_modules/babel-preset-vue"),
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
