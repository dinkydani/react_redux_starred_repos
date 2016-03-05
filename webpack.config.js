module.exports = {
  entry: './app/index.js',
  output: {
    filename: 'bundle.js', // this is the default name, so you can skip it
    // at this directory our bundle file will be available
    // make sure port 8090 is used when launching webpack-dev-server
    publicPath: 'http://localhost:8090/assets',
    path: './build'
  },
  module: {
    loaders: [
      // JSX
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel'
      },
      // Font Awesome
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      // SASS
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
