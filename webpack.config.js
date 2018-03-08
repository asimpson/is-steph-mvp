module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? 'none' : 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  devServer: {
    contentBase: './',
    publicPath: '/dist/',
    host: '0.0.0.0',
    // we do this to use `hostname.local` on mobile devices
    disableHostCheck: true,
    watchContentBase: true,
  },
};
