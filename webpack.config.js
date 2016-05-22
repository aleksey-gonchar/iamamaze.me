const webpack = require('webpack')
const path = require('path')
const srcPath = path.join(__dirname, 'src')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('konphyg')(process.cwd() + '/config')
const serverCfg = config('server')
const frontCfg = config('front-end')

const apiBaseUrl = serverCfg.api.mountPoint

let plugins = [
  new webpack.DefinePlugin({
    __FETCH_STATE__: true,
    __API_BASE_URL__: JSON.stringify(apiBaseUrl),
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  }),
  new webpack.optimize.CommonsChunkPlugin('common.bundle', 'common.bundle.js'),
  new ExtractTextPlugin('[name].css', { allChunks: true })
]

if (process.env.NODE_ENV === 'development')  {
  plugins = plugins.concat([
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map',
      exclude: [/\.css/]
    })
  ])
}

module.exports = {
  target: 'web',
  cache: true,
  entry: {
    'index.bundle': path.join(srcPath, 'front-end/js/index.js'),
    'common.bundle': [
      'lodash', 'jquery', 'moment', 'superagent',
      'react', 'react-router', 'react-bootstrap', 'react-router-bootstrap',
      'redux', 'react-redux', 'redux-actions', 'js-cookie', 'lodash', 'marked'
    ],
    'vendor.bundle': path.join(srcPath, 'vendor/js/index.js')
  },
  resolve: {
    root: srcPath,
    extensions: ['', '.js', '.jsx', '.scss'],
    modulesDirectories: ['node_modules',
      'src', 'src/front-end/styles',
      'src/vendor/js/jquery-plugins']
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    pathInfo: true
  },

  module: {
    loaders: [
      { test: /(\.js|\.jsx)$/, exclude: /node_modules/, loader: 'babel' },
      {
        test: /\.scss/,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
      },
      {
        test: /\.css/,
        loader: ExtractTextPlugin.extract('style', 'css!cssnext')
      },
      {
        test: /\.less/,
        loader: ExtractTextPlugin.extract('style', 'css!less')
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=10000&minetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file' },

      { test: /\.jpe?g$|\.gif$|\.png$|\.wav$|\.mp3$/, loader: 'file' }
    ]
  },
  plugins,
  debug: true,
  cssnext: {
    browsers: 'last 2 versions'
  }
}
