import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
let options = {
  fullscreenEl: false
};
Vue.use(preview, options)
Vue.use(preview)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
