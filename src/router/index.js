import Vue from 'vue'
import Router from 'vue-router'

import login from '../pages/login.vue'
import index from '../pages/index.vue'
import card from '../pages/card.vue'
import flowPool from '../pages/flowPool.vue'
import account from '../pages/account.vue'
import recharge from '../pages/recharge.vue'
Vue.use(Router)

const router = new Router({
  linkActiveClass: 'active',
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
  ]
})

// router.beforeEach(async (to,from,next) => {
//   if(to.path === '/'){
//     next();
//     return
//   }
//   // 每次跳转时，更新vuex里的user
//   await axios.get("/loginCheck")
//     .then(res=> {
//       if (res.data.code === "0") {
//         store.commit("updateUserInfo", res.data.data);
//       }else {
//         store.commit("updateUserInfo", {
//           userId: null,
//           companyName: null,
//           companyId: null,
//           userName: null
//         });
//       }
//     });
//
//   if(to.path !== '/login'){
//     // 下面这个判断是自行实现到底是否有没有登录
//     if(!store.state.user.user.companyId){
//       next({
//         path:'/login'
//       })
//     }else{
//       next()
//     }
//     // 如果访问的是登陆页面，且已经登陆，跳转至count
//   }
//   else if(to.path === '/login'){
//     if(!store.state.user.user.companyId){
//       next()
//     }else{
//       if(to.query.newPath){
//         next({
//           path: to.query.newPath
//         })
//       }else{
//         next({
//           path:'/count'
//         })
//       }
//     }
//   }
//   else {
//     // 不需要登录的，可以继续访问
//     next()
//   }
// });


export default router
