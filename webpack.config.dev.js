const path = require('path');
const definedPath = "/home/stlk/Downloads/node_modules/"

const webpack = require.resolve(path.resolve(definedPath, 'webpack/lib/webpack'));
const {
    VueLoaderPlugin
} = require(path.resolve(definedPath, 'vue-loader'));
const HtmlWebpackPlugin = require(path.resolve(definedPath, 'html-webpack-plugin'));


module.exports = {
    entry: {
        app: [
            path.resolve(__dirname, './resources/external-vue-components-import.js')
        ],
        // externalComponentsVueImport: path.resolve(__dirname, './resources/external-vue-components-import.js')
        // component: path.resolve(__dirname, './resources/overview-component.js'),
        // componentTimeline: path.resolve(__dirname, './resources/realtime-component.js'),
        // componentTimeMachine: path.resolve(__dirname, './resources/time-machine-component.js')
        // componentTimeline: path.resolve(__dirname, './resources/timeline-component.js')
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        // publicPath: "/",
        // path: path.resolve(__dirname),
        publicPath: "/wicked-wombat-56/",
        path: path.resolve(__dirname, 'assets'),

    },
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `npm.${packageName.replace('@', '')}`;
                    }
                }
            }
        }
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject: true,
            // chunks: ['vendor', 'app'],
            // chunks: ['vendor', 'app'],
            minify: {
                collapseWhitespace: false,
                removeComments: false,
                removeRedundantAttributes: false,
                removeScriptTypeAttributes: false,
                removeStyleLinkTypeAttributes: false,
                useShortDoctype: false
            }
        })
    ],
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
                            loader: 'style-loader',
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
                            require.resolve(path.resolve(definedPath, "@babel/plugin-syntax-dynamic-import")),
                        ],
                        presets: [
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
    resolveLoader: {
        modules: [path.resolve(definedPath)],
    },
    resolve: {
        modules: [path.resolve(definedPath)],
        alias: {
            '../node_modules/d3-vs': path.resolve(definedPath, 'd3-vs'),
            '../node_modules/vue-slider-component': path.resolve(definedPath, 'vue-slider-component'),
            'dynamic-import-webpack': path.resolve(definedPath, "babel-plugin-dynamic-import-webpack/lib"),
            'babel-plugin-dynamic-import-webpack': path.resolve(definedPath, "babel-plugin-dynamic-import-webpack/lib"),
            'babel-loader': path.resolve(definedPath, "babel-loader"),
            'document-offset': path.resolve(definedPath, "document-offset"),
            'lodash': path.resolve(definedPath, "lodash"),
            '@babel/preset-env': path.resolve(definedPath, "@babel/preset-env"),
            'vue': path.resolve(definedPath, "babel-preset-vue"),
            'babel-preset-vue': path.resolve(definedPath, "babel-preset-vue"),
            '/home/stlk/Downloads/node_modules/leaflet-fullscreen/dist/leaflet.fullscreen.css': path.resolve(definedPath, "leaflet-fullscreen/dist/leaflet.fullscreen.css"),
            '/home/stlk/Downloads/node_modules/leaflet/dist/leaflet.css': path.resolve(definedPath, "leaflet/dist/leaflet.css"),
            "../../node_modules/leaflet-fullscreen/dist/leaflet.fullscreen.css": path.resolve(definedPath, "leaflet-fullscreen/dist/leaflet.fullscreen.css"),
            "../../node_modules/leaflet/dist/leaflet.css": path.resolve(definedPath, "leaflet/dist/leaflet.css"),
            "/images/layers.png$": path.resolve(definedPath, "leaflet/dist/images/layers.png"),
            "/images/layers-2x.png$": path.resolve(definedPath, "leaflet/dist/images/layers-2x.png"),
            "/images/marker-icon.png$": path.resolve(definedPath, "leaflet/dist/images/marker-icon.png"),
            "/images/marker-icon-2x.png$": path.resolve(definedPath, "leaflet/dist/images/marker-icon-2x.png"),
            "/images/marker-shadow.png$": path.resolve(definedPath, "leaflet/dist/images/marker-shadow.png")
        }
    }
}