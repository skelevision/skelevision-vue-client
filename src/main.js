import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios'

const base = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  withCredentials: true,
})

Vue.prototype.$http = base

import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
