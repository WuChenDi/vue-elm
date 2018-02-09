// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResouce from 'vue-resource'
import App from './App'
import goods from './components/goods/goods.vue'
import ratings from './components/ratings/ratings.vue'
import seller from './components/seller/seller.vue'

import './common/style/index.scss'

Vue.config.productionTip = false
Vue.use(VueRouter);
Vue.use(VueResouce);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    },
    {
      path: '/seller',
      component: seller
    }
  ],
  // 选中路由添加class
  linkActiveClass: 'active'
});

// 自动加载goods
router.push('/goods');


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
