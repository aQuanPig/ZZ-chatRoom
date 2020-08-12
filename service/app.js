// 引入express，并获得express的实例
const express = require('express');
const path = require("path")
const app = express()
// 引入http模块
const http = require('http');
// 用http模块创建一个服务并把express的实例挂载上去
const server = http.Server(app);
// 引入socket.io并立即实例化，把server挂载上去
const io = require('socket.io')(server);

//记录所有已经登录的用户
const userList = []
app.use('/chatroom',express.static(path.join(__dirname,'/web')))
io.on('connection', socket =>{
  socket.on("login",data => {
    // 判断，如果data在userList数组中存在，说明该用户已经登录，不允许登录
    // 如果data在userList数组中不存在，说明该用户没有登录，允许登录
    let user =userList.length!==0 ? userList.find(item => item.username === data.username):false
    if(user){
      //表示用户存在,登录失败，服务器需要给当前用户响应，告诉登录失败
      socket.emit("userExit",{msg:"用户已存在，登录失败"})
    } else {
      // 表示用户不存在,登录成功
      userList.push(data)
      socket.emit("loginsuccess",{...data,msg:"登录成功"})
      //告诉所有的用户，有用户加入到聊天室，广播消息:io.emit
      io.emit("addUser",data)
      //告诉所有的用户，目前聊天室中有多少人
      io.emit("userList",userList)
      // 把登录成功的用户名和头像存储起来
      socket.username = data.username
    }
  })
  // 用户断开连接的功能
  socket.on("disconnect",()=>{
    // 把当前用户的信息从userList中删除掉
    let idx = userList.findIndex(item => item.username === socket.username)
    userList.splice(idx,1)
    // 告诉所有人有人离开了聊天室
    io.emit("leaveroom",{username:socket.username})
    // 告诉所有人，userList发生了更新
    io.emit("userList",userList)
  })
  // 监听聊天的消息
  socket.on("sendMessage",data => {
    //广播给所有用户
    io.emit("receiveMessage",data)
  })
  // 接受图片信息
  socket.on("sendImage",data => {
    //广播给所有用户
    io.emit("receiveImage",data)
  })
});

server.listen(3000, function () {
  console.log('服务端启动成功！端口3000');
});