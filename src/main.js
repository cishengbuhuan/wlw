// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VCharts from 'v-charts'
import 'element-ui/lib/theme-chalk/index.css'
import { Dropdown, DropdownMenu, DropdownItem, MessageBox, Message,
  Col, Row, Table, DatePicker, Input, Pagination, Menu, MenuItem,
  Loading, TableColumn, Form, FormItem, Button, Tag, Tabs,
  TabPane, Notification, Submenu, MenuItemGroup, Select, Option } from 'element-ui';


axios.defaults.baseURL = 'http://192.168.1.5:8090';
// axios.defaults.baseURL = 'http://f8980b93.ngrok.io';
// axios.defaults.timeout = 10000;

Vue.use(Col).use(Row).use(Table).use(DatePicker)
  .use(Input).use(Pagination).use(Menu).use(MenuItem)
  .use(Loading).use(TableColumn).use(Form).use(FormItem)
  .use(Button).use(Tag).use(Tabs).use(TabPane).use(Submenu)
  .use(MenuItemGroup).use(Dropdown).use(DropdownMenu).use(DropdownItem)
  .use(Select).use(Option)


Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

Vue.use(VCharts)


axios.interceptors.request.use(config => {
  config.params = Object.assign({_token: localStorage.getItem('_token')},config.params)
  return config
},err => {
  return Promise.reject(err)
})
//
// axios.interceptors.response.use(function (response) {
//   // token 已过期，重定向到登录页面
//   if (response.data.code == 110){
//     localStorage.removeItem('_token')
//     router.replace({
//       path: '/login',
//       query: {redirect: router.currentRoute.fullPath}
//     })
//   }
//   return response
// }, function (error) {
//   // Do something with response error
//   return Promise.reject(error)
// })


// Vue.http.interceptors.push((request, next) => {
//
//   let token = localStorage.getItem('_token')
//   if (token) {
//     if (request.body) {
//       request.body._token = token
//     } else {
//       request.url += request.url.indexOf('?') >= 0 ? '&_token=' + token : '?_token=' + token
//     }
//   }
//   next((response) => {
//     if (response.body.code == 110) {
//       config.login = false;
//       localStorage.removeItem('_token');
//     }
//   })
// })
