// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import {baseUrl} from './api/dataUtil'
import VCharts from 'v-charts'
import 'element-ui/lib/theme-chalk/index.css'
import {
	Dropdown, DropdownMenu, DropdownItem, MessageBox, Message,
	Col, Row, Table, DatePicker, Input, Pagination, Menu, MenuItem,
	Loading, TableColumn, Form, FormItem, Button, Tag, Tabs,
	TabPane, Notification, Submenu, MenuItemGroup, Select, Option, Upload, Radio
} from 'element-ui';
// 引入echarts
import echarts from 'echarts'

Vue.prototype.$echarts = echarts 

axios.defaults.baseURL = baseUrl;
// axios.defaults.timeout = 10000;

Vue.use(Col).use(Row).use(Table).use(DatePicker)
	.use(Input).use(Pagination).use(Menu).use(MenuItem)
	.use(Loading).use(TableColumn).use(Form).use(FormItem)
	.use(Button).use(Tag).use(Tabs).use(TabPane).use(Submenu)
	.use(MenuItemGroup).use(Dropdown).use(DropdownMenu).use(DropdownItem)
	.use(Select).use(Option).use(Upload).use(Radio)


Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false


axios.interceptors.request.use(config => {
	config.params = Object.assign({_token: sessionStorage.getItem('_token')}, config.params)
	return config
}, err => {
	return Promise.reject(err)
})
//
axios.interceptors.response.use(function (response) {
	// token 已过期，重定向到登录页面
	if (response.data.code == 110) {
		console.log(response.data)
		sessionStorage.removeItem('_token')
		router.push('/login')
		Message.error({message: (response.data.msg || response.data.info)});
	}
	return response
}, function (error) {
	// Do something with response error
	return Promise.reject(error)
})


// router.beforeEach((to, from, next) => {
// 	/* 路由发生变化修改页面title */
// 	if (to.meta.title) {
// 		document.title = to.meta.title
// 	}
// 	next()
// })

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: {App},
	template: '<App/>'
})

Vue.use(VCharts)
