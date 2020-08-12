<template>
  <div>
    <div class="Login" v-if="isShow">
      <div class="login-right">
        <div>
          <p class="small">Welcome to</p>
          <p class="big"> Z z 聊天室</p>
        </div>
      </div>
      <div class="login-left">
        <div class="content">
          <div>
            <label for="username" class="iconfont icon-ziyuanxhdpi"> 用户名</label>
            <input type="text" class="user" id="username" ref="inputUsername" />
          </div>
          <div class="chooseAvatar">
            <label for="avatar" class="iconfont icon-icon26"> 选择头像</label>
            <ul class="avatarWrap">
              <li v-for="(item,index) in imgUrl" :key="item">
                <img
                  :src="require('../assets/avatar/' + item)"
                  alt
                  @click="clickImg(index,item)"
                  :class="{active:currentIndex===index?true:false}"
                />
              </li>
            </ul>
          </div>
          <button class="button" @click="loginRoom">登录</button>
        </div>
      </div>
    </div>
    <room
      v-else
      :user="user"
      :userList="userList"
      ref="chatroom"
      @sendServer="sendServer"
      :message="message"
      @handleFile="handleFile"
    />
  </div>
</template>

<script>
import Room from './Room'
import io from 'socket.io-client' //引入socket.io-client
export default {
  name: 'Login',
  components: { Room },
  data() {
    return {
      imgUrl: [
        'one.jpg',
        'two.jpg',
        'four.jpg',
        'three.jpeg',
        'eight.jpg',
        'seven.jpg',
        'six.jpg',
        'five.jpg',
        'nine.jpg',
        'ten.jpeg'
      ],
      currentIndex: 0,
      currentImg: 'one.jpg',
      socket: null,
      isShow: true,
      user: {},
      userList: [],
      message: {},
    }
  },
  methods: {
    handleFile(file) {
      this.socket.emit('sendImage', { ...this.user, file })
    },
    clickImg(index, item) {
      this.currentIndex = index
      this.currentImg = item
    },
    loginRoom() {
      // 1.获取用户名
      const username = this.$refs.inputUsername.value
      if (!username.trim()) {
        alert('请输入用户名')
        return
      }
      // 2.需要告诉socket io服务，进行登录
      this.socket.emit('login', {
        username,
        avatar: this.currentImg,
      })
    },
    sendServer(content) {
      const { username, avatar } = this.user
      this.socket.emit('sendMessage', { msg: content, username, avatar })
    },
  },
  mounted() {
    /**
     * 聊天室的主要功能
     */
    // 1.连接服务器
    // baseURL:process.env.VUE_APP_URL || "/admin/api",
    this.socket = io(process.env.VUE_APP_URL || "/")
    // 2.监听登录失败的请求
    this.socket.on('userExit', (data) => alert(data.msg))
    // 3.监听登录成功的请求
    this.socket.on('loginsuccess', (data) => {
      alert(data.msg)
      this.user = data
      this.isShow = false
    })
    this.socket.on('addUser', (data) => {
      this.$store.commit('setJoinRoom', data)
    })
    this.socket.on('leaveroom', (data) => {
      this.$store.commit('setLeaveRoom', data)
      this.$refs.chatroom ? this.$refs.chatroom.haveOneleaveRoom() : null
    })
    // 监听用户列表的信息
    this.socket.on('userList', (data) => {
      this.userList = data
    })
    // 监听聊天的消息
    this.socket.on('receiveMessage', (data) => {
      // 把接收到的消息显示到聊天窗口中
      this.message = data
    })
    // 监听图片的消息
    this.socket.on('receiveImage', (data) => {
      // 把接收到的图片显示到聊天窗口中
      this.$refs.chatroom.handleImage(data)
    })
  }
}
</script>

<style lang="less" scoped>
.Login {
  width: 600px;
  height: 360px;
  margin: 130px auto;
  display: flex;
  .login-right {
    width: 260px;
    height: 100%;
    background-color: rgba(66, 69, 120, 0.76);
    display: flex;
    justify-content: center;
    align-items: center;
    .small {
      color: #f1e9e9;
      font-size: 14px;
      font-family: sans-serif;
    }
    .big {
      font-size: 20px;
      font-weight: 600;
      margin-top: 5px;
      color: #f1e9e9;
      font-family: sans-serif;
    }

  }
  .login-left {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    .icon-ziyuanxhdpi,
    .icon-icon26 {
      color:#353c73;
    }
    label {
      color: #000;
      font-size: 14px;
    }
    .content {
      margin: 20px auto;
      width: 90%;
      .user {
        width: 95%;
        border: 1px solid #ccc;
        font-size: 14px;
        line-height: 30px;
        padding-left: 10px;
        display: block;
      }
      .chooseAvatar {
        margin-top: 15px;
      }
      .avatarWrap {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        border: 1px solid #ccc;
        li {
          cursor: pointer;
          width: 50px;
          height: 50px;
          padding: 7px;
          img {
            width: 50px;
            height: 50px;
          }
          .active {
            border: 3px solid #2980b9;
          }
        }
      }
    }
    .button {
      width: 100px;
      line-height: 30px;
      background-color: #705a76;
      color: #fff;
      border-radius: 10px;
      margin-left: 34%;
      margin-top: 30px;
    }
  }
}
</style>
