// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import { Col, Row, Table, DatePicker, Input, Pagination, Menu, MenuItem, Loading, TableColumn, Form, FormItem, Button, Tag, Tabs, TabPane, Notification, Submenu, MenuItemGroup } from 'element-ui';

Vue.use(Col).use(Row).use(Table).use(DatePicker).use(Input).use(Pagination).use(Menu).use(MenuItem).use(Loading).use(TableColumn).use(Form).use(FormItem).use(Button).use(Tag).use(Tabs).use(TabPane).use(Submenu).use(MenuItemGroup)
Vue.prototype.$notify = Notification;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
