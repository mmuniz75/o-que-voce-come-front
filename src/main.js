import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Spinner from './components/Spinner'

Vue.config.productionTip = false

Vue.component('spinner',Spinner)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
