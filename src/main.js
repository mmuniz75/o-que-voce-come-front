import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Spinner from './components/Spinner'
import Message from './components/Message'

Vue.config.productionTip = false

Vue.component('spinner',Spinner)
Vue.component('message',Message)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
