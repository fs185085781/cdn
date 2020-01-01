import Vue from 'vue'
import App from './App'
import jsencrypt from './libs/jsencrypt.min.js'
import expand from './libs/expand.js'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
