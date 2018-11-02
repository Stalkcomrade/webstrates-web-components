const path = require('path');
const definedPath = "/home/stlk/Downloads/node_modules/"

const webpack = require.resolve(path.resolve(definedPath, 'webpack/lib/webpack'));
const {
    VueLoaderPlugin
} = require(path.resolve(definedPath, 'vue-loader'));

module.exports = {
    entry: {
        // component: path.resolve(__dirname, './resources/overview-component.js'),
        // componentTimeline: path.resolve(__dirname, './resources/realtime-component.js'),
        // componentTimeMachine: path.resolve(__dirname, './resources/time-machine-component.js')
        componentTimeline: path.resolve(__dirname, './resources/timeline-component.js')
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
                    path.resolve(definedPath)
                ],
                loader: 'vue-loader',
                options: {
                    hotReload: true,
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
                exclude: path.resolve(definedPath),
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            require.resolve(path.resolve(definedPath, 'babel-plugin-dynamic-import-webpack')),
                        ],
                        presets: [
                            [require.resolve(path.resolve(definedPath, "babel-preset-vue"))],
                            [require.resolve(path.resolve(definedPath, "@babel/preset-env"), {
                                'modules': false,
                                'targets': {
                                    'node': 4
                                }
                            })]
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
        modules: [path.resolve(definedPath)],
    },
    resolve: {
        modules: [path.resolve(definedPath)],
        alias: {
            '../node_modules/d3-vs': path.resolve(definedPath, 'd3-vs'),
            'dynamic-import-webpack': path.resolve("/home/stlk/Downloads/node_modules/babel-plugin-dynamic-import-webpack/lib"),
            'babel-plugin-dynamic-import-webpack': path.resolve("/home/stlk/Downloads/node_modules/babel-plugin-dynamic-import-webpack/lib"),
            'babel-loader': path.resolve("/home/stlk/Downloads/node_modules/babel-loader"),
            'document-offset': path.resolve("/home/stlk/Downloads/node_modules/document-offset"),
            'lodash': path.resolve(definedPath, "lodash"),
            '@babel/preset-env': path.resolve("/home/stlk/Downloads/node_modules/@babel/preset-env"),
            'vue': path.resolve("/home/stlk/Downloads/node_modules/babel-preset-vue"),
            'babel-preset-vue': path.resolve("/home/stlk/Downloads/node_modules/babel-preset-vue"),
            '/home/stlk/Downloads/node_modules/leaflet-fullscreen/dist/leaflet.fullscreen.css': path.resolve("/home/stlk/Downloads/node_modules/leaflet-fullscreen/dist/leaflet.fullscreen.css"),
            '/home/stlk/Downloads/node_modules/leaflet/dist/leaflet.css': path.resolve("/home/stlk/Downloads/node_modules/leaflet/dist/leaflet.css"),
            "/images/layers.png$": path.resolve("/home/stlk/Downloads/node_modules/leaflet/dist/images/layers.png"),
            "/images/layers-2x.png$": path.resolve("/home/stlk/Downloads/node_modules/leaflet/dist/images/layers-2x.png"),
            "/images/marker-icon.png$": path.resolve("/home/stlk/Downloads/node_modules/leaflet/dist/images/marker-icon.png"),
            "/images/marker-icon-2x.png$": path.resolve("/home/stlk/Downloads/node_modules/leaflet/dist/images/marker-icon-2x.png"),
            "/images/marker-shadow.png$": path.resolve("/home/stlk/Downloads/node_modules/leaflet/dist/images/marker-shadow.png")
        }
    }
}