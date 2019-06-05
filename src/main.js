import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import moment from 'moment'

// Global styles!
import './assets/styles/grid/grid.scss'
import './assets/styles/style.scss'

Vue.config.productionTip = false
Vue.filter('moment', function (value) {
    return moment(value).format('H:mm');
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
