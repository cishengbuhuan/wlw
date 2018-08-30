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
// axios.defaults.baseURL = 'http://192.168.1.70:8080/matrix';
axios.defaults.timeout = 10000;

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
  config.params = Object.assign({_token: sessionStorage.getItem('_token')},config.params)
  return config
},err => {
  return Promise.reject(err)
})
