const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin= require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');


const isDev = process.env.NODE_ENV === 'development'
// console.log('IS DEV:', isDev)


const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    }
  }

  if (!isDev) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin(),
    ]
  }

  return config
}


const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`
const chunkFilename = ext => isDev ? `[id].${ext}` : `[id].[hash].${ext}`


const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true
      }
    },
    //'style-loader', // creates style nodes from JS strings
    'css-loader',   // translates CSS into CommonJS
  ]

  if (extra) {
    loaders.push(extra)
  }

  return loaders
}


const babelOptions = preset => {
  const opts = {
    presets: [
      '@babel/preset-env',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ],
  }

  if (preset) {
    opts.presets.push(preset)
  }

  return opts
}


const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: babelOptions(),
  }]

  if(isDev) {
    loaders.push('eslint-loader')
  }

  return loaders
}


const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      // title: 'Webpack example 2020', // if use param 'template', then param 'title' not used.
      template: './index.html',
      // inject: 'body',
      minify: {
        collapseWhitespace: !isDev
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'src/assets/img/favicon.ico'),
      to: path.resolve(__dirname, 'dist'),
    }]),
    new MiniCssExtractPlugin({
      filename: filename('css'),
      chunkFilename: chunkFilename('css'),
    }),
    new Dotenv()
  ]

  /**
  if(!isDev) {
    base.push(new BundleAnalyzerPlugin())
  }
  */

  return base
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './index.jsx'],
    analytics: './analytics.ts'
  },
  
  node: {
    fs: "empty"
  },

  output: {
    // filename: '[name].[contenthash:8].js',
    path: path.resolve(__dirname, 'dist'),
    filename: filename('js'),
  },

  resolve: {
    extensions: ['.js', '.json', '.png'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@models': path.resolve(__dirname, 'src/models'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@data': path.resolve(__dirname, 'src/assets/data'),
      '@fonts': path.resolve(__dirname, 'src/assets/fonts'),
      '@img': path.resolve(__dirname, 'src/assets/img'),
    }
  },

  /**
  * optimization: {
  *   splitChunks: {
  *     chunks: 'all',
  *   }
  * },
  **/
  optimization: optimization(),

  devServer: {
    port: 4200,
    hot: isDev,
  },

  devtool: isDev ? 'source-map' : '',

  plugins: plugins(),

  module: {
    rules: [
      { // CSS handling
        test: /\.css$/,
        use: cssLoaders(),
      },
      { // LESS handling
        test: /\.less$/,
        use: cssLoaders('less-loader'), // compiles Less to CSS before translate CSS into CommonJS & creates nodes from JS strings
      },
      { // SASS/SCSS handling
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'), // compiles Sass to Sass before translate CSS into CommonJS & creates nodes from JS strings
      },
      { // Images handling
        test: /\.(png|jpg|svg|gif)$/,
        use: 'file-loader',
      },
      { // FONTS handling
        test: /\.(ttf|woff|woff2|eot)$/,
        use: 'file-loader',
      },
      { // XML handling
        test: /\.xml$/,
        use: 'xml-loader',
      },
      { // CSV handling
        test: /\.csv$/,
        use: 'csv-loader',
      },
      { // Babel handling
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      { // TypeScript handling
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript'),
        },
      },
      { // React handling
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react'),
        },
      },
    ]
  }
}