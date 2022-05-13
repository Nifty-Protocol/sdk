module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        index: './src/index'
    },
    output: {
        library: "nftrade",
        libraryTarget: "umd",
        filename: "[name].js"
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        { test: /\.tsx?$/, loader: 'ts-loader' }
      ]
    }
  };