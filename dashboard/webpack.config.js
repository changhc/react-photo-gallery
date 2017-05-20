const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader', // 單一loader
    },
    {
      test: /\.css$/,  // target: css files
      use: [    // 多個loader， webpack 2
        'style-loader',  // add <style> tag
        'css-loader',    // preprocess 'url()'
      ], // 執行順序由下到上
      exclude: /node_modules/,
    }],
  },
};
