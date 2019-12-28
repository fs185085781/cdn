import Vue from 'vue'
import App from './App'
import jsencrypt from './libs/jsencrypt.min.js';
import expand from './libs/expand.js';
import store from './store'

Vue.config.productionTip = false

Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
