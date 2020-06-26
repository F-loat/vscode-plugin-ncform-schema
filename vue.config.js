const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  publicPath: isDev ? 'http://localhost:8080/' : 'vscode://',
  outputDir: 'out/web',
  filenameHashing: false,
  productionSourceMap: false,
  css: {
    extract: false
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    disableHostCheck: true
  }
};
