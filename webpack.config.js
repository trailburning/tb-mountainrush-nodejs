var path    = require('path');
var hwp     = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, '/src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/src/static-assets/js')
  },
  module:{
    rules:[
    {
      exclude: /node_modules/,
      test: /\.js$/,
      use: {
        loader: "babel-loader"
      }          
    },
    {
      test: /\.css$/,
      exclude: /node_modules/,
      use: ['style-loader', 'css-loader']
    },        
    {
      test: /\.svg/,
      use: {
        loader: 'svg-url-loader',
        options: {}
      }
    }        
    ]
  },
  plugins:[
      new hwp({template:path.join(__dirname, '/src/index.html')})
  ],
  devServer: {
    proxy: {
      '/static-assets': {
        target: 'http://localhost:8081/src',
        secure: false
      }
    }
  }    
}
