import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import http from './http'
// import './plugins/element.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.prototype.$http = http;
Vue.use(ElementUI);

Vue.filter('fixed2', function (value) {
  if (!value&&value!=0) return ''
  return value.toFixed(2)
})

//window.INITED = false; //not recommand
router.beforeEach((to, from, next) => {
  let inited = from.name!=null;
  if(to.path=='/'|| inited){
    next();
  }else{
    next('/');
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
