var path    = require('path');
var hwp     = require('html-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, '/src/index.js'),
    output: {
      filename: 'build.js',
      path: path.join(__dirname, '/static-assets/js')
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
    }
}
