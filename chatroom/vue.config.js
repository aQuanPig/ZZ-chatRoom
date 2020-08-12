module.exports = {
  outputDir:__dirname + "/../service/web",
  publicPath: process.env.NODE_ENV === 'production'
  ? '/web/'
  : '/'
}