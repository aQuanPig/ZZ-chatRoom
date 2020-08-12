module.exports = {
  outputDir:__dirname + "/../service/chatroom",
  publicPath: process.env.NODE_ENV === 'production'
  ? '/chatroom/'
  : '/'
}