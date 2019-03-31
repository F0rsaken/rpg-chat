import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'

// Global styles!
import './assets/styles/grid/grid.scss'
import './assets/styles/style.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
