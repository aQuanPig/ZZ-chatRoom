<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name:"App",
}
</script>

<style lang="less">
  @import url("./assets/css/base.css");
  @import url("./assets/css/iconfont.css");
  body {
    height: 100%;
    width: 100%;
    background: url("./assets/bg1.jpg") no-repeat;
    background-size: cover;
  }
</style>
