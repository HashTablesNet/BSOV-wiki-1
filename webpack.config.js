var webpack = require('webpack');
var path = require('path');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

var environment = process.env.NODE_ENV || 'development';

/*
var htmlPlugin = new HtmlWebpackPlugin({
      title: '0xBitcoin',
     filename: 'index.html',
      template: 'app/index.html',
});
*/

var extractPlugin = new ExtractTextPlugin({
   filename: 'app/assets/stylesheets/main.css'
});

/*
var extractPlugin = new ExtractTextPlugin({

path: '/app/assets/js/', filename: ['mining-calculator.js', '/app/assets/js/graphs.js', '/app/assets/js/main.js', '/app/assets/js/abi.js', '/app/assets/js/ethjs.js', '/app/assets/js/ethereumjs-testrpc.js'],
path: 'app/assets/stylesheets/', filename: ['main.css']
});
*/


var webpackPlugins = [
    extractPlugin,
    new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),

      new CopyWebpackPlugin([
            {from:'app/assets/img',to:'app/assets/img'}
        ]),

      new CopyWebpackPlugin([
            {from:'app/assets/js',to:'app/assets/js'}
        ]),

        new CopyWebpackPlugin([
              {from:'app/assets/stylesheets/css',to:'app/assets/stylesheets/css'}
          ]),

      new CopyWebpackPlugin([
            {from:'app/assets/fonts',to:'app/assets/fonts'}
        ]),

        new CopyWebpackPlugin([
              {from:'app/assets/contracts/bsov.sol',to:'./'}
          ]),


      new CopyWebpackPlugin([
            {from:'app/assets/icons',to:'app/assets/icons'}
        ])
];



const routesData = {
  routes: [
    {url: '/', title: '0xBTC.wiki', template: 'app/views/index.html', filename: 'index.html'},
    {url: '/account', title: '0xBTC.wiki', template: 'app/views/account.html', filename: 'account.html'},
    {url: '/tx', title: '0xBTC.wiki', template: 'app/views/transaction.html', filename: 'transaction.html'},
    {url: '/search', title: '0xBTC.wiki', template: 'app/views/search.html', filename: 'search.html'},
    {url: '/api', title: '0xBTC Wallet', template: 'app/views/api.html', filename: 'api.html'},
   ]
}


routesData.routes.forEach(function(element){

  var htmlPlugin = new HtmlWebpackPlugin({
        title: element.title,
        filename: element.filename,
        template: element.template
  });

 webpackPlugins.push(htmlPlugin)

})



module.exports = {
    entry: [
      './app/assets/javascripts/index',
      './app/assets/stylesheets/application.scss'
   ],
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2016']
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: extractPlugin.extract({
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
              test: /\.(png|jpg|gif)$/,
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    name: '[path][name].[ext]',
                     publicPath: '/',
                  }
                }
              ]
            },

            {
              test: /\.(eot|woff|woff2|ttf|svg)(\?[\s\S]+)?$/,
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    name: '[path][name].[ext]',
                     publicPath: '/',
                  }
                }
              ]
            },
        ]
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
      }
    },
    plugins: webpackPlugins
};
