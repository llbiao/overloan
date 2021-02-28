import Vue from 'vue'
import App from './App'
import store from './store'
import http from './common/http.js';
Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$http = http;

App.mpType = 'app'

// 全局组件
import uniIcons from "@/components/uni-icons/uni-icons.vue"
Vue.component('uni-icons', uniIcons);

const app = new Vue({
	store,
    ...App
})
app.$mount()
