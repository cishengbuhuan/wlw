import Vue from 'vue'
import Router from 'vue-router'

import login from '../pages/login.vue'
import index from '../pages/index.vue'
import card from '../pages/card.vue'
import flowPool from '../pages/flowPool.vue'
import account from '../pages/account.vue'
import recharge from '../pages/recharge.vue'
import message from '../pages/message.vue'
import manage from '../pages/manage.vue'
import bill from '../pages/applyBill.vue'
import forget from '../pages/forget.vue'
Vue.use(Router)

const router = new Router({
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/card',
      name: 'card',
      component: card
    },
    {
      path: '/flowPool',
      name: 'flowPool',
      component: flowPool
    },
    {
      path: '/account',
      name: 'account',
      component: account
    },
    {
      path: '/recharge',
      name: 'recharge',
      component: recharge
    },
    {
      path: '/message',
      name: 'message',
      component: message
    },
    {
      path: '/manage',
      name: 'manage',
      component: manage
    },
    {
      path: '/forget',
      name: 'forget',
      component: forget
    },
    {
      path: '/bill',
      name: 'bill',
      component: bill
    }
  ]
})

// router.beforeEach((to,from,next) => {
//   let token = sessionStorage.getItem('_token');
//   if(token && to.path == '/login'){
//     next({path: '/'});
//   }else if(!token && to.path != '/login'){
//     next({path: '/login'});
//   }else {
//     next();
//   }
// });

export default router
