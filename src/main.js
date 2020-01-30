import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Spinner from './components/Spinner'
import Message from './components/Message'
import BarCode from './components/BarCode'
import Selection from './components/Selection'
import AutoComplete from './components/AutoComplete'

Vue.config.productionTip = false

Vue.component('spinner',Spinner)
Vue.component('message',Message)
Vue.component('bar-code',BarCode)
Vue.component('selection',Selection)
Vue.component('auto-complete',AutoComplete)

export const eventBus = new Vue()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
