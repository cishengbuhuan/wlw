import Vue from 'vue'
import Router from 'vue-router'

import login from '../pages/login.vue'
import index from '../pages/index.vue'
import card from '../pages/card.vue'
import singleCard from '../pages/singleCard.vue'
import cardOperate from '../pages/cardOperate.vue'
import packageChangeSearch from '../pages/packageChangeSearch.vue'
import stopRestore from '../pages/stopRestore.vue'
import stopRestoreDetail from '../pages/stopRestoreDetail.vue'
import changeDetail from '../pages/changeDetail.vue'
import packageChange from '../pages/packageChange.vue'
import sendMsg from '../pages/sendMsg.vue'
import sendMsgRecord from '../pages/sendMsgRecord.vue'
import cardStopRestore from '../pages/cardStopRestore.vue'
import cardDetail from '../pages/cardDetail.vue'
import flowPool from '../pages/flowPool.vue'
import ydFlow from '../pages/ydFlow.vue'
import ltFlow from '../pages/ltFlow.vue'
import dxFlow from '../pages/dxFlow.vue'
import account from '../pages/account.vue'
import recharge from '../pages/recharge.vue'
import message from '../pages/message.vue'
import manage from '../pages/manage.vue'
import bill from '../pages/applyBill.vue'
import forget from '../pages/forget.vue'

Vue.use(Router)

const router = new Router({
	linkActiveClass: 'active',
	routes: [
		{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/login',
			name: 'login',
			component: login
		},
		{
			path: '/index',
			name: 'index',
			component: index,
			meta: {
				title: '梦初想物联网 | 首页'
			}
		},
		{
			path: '/card',
			name: 'card',
			component: card,
			meta: {
				title: '梦初想物联网 | 卡片列表'
			}
		},
		{
			path: '/singleCard',
			name: 'singleCard',
			component: singleCard,
			meta: {
				title: '梦初想物联网 | 单卡列表'
			}
		},
		{
			path: '/cardOperate',
			name: 'cardOperate',
			component: cardOperate,
			meta: {
				title: '梦初想物联网 | 卡片操作'
			}
		},
		{
			path: '/packageChange',
			name: 'packageChange',
			component: packageChange,
			meta: {
				title: '梦初想物联网 | 套餐变更'
			}
		},
		{
			path: '/packageChangeSearch',
			name: 'packageChangeSearch',
			component: packageChangeSearch,
			meta: {
				title: '梦初想物联网 | 套餐变更查询'
			}
		},
		{
			path: '/changeDetail',
			name: 'changeDetail',
			component: changeDetail,
			meta: {
				title: '梦初想物联网 | 变更详情'
			}
		},
		{
			path: '/stopRestore',
			name: 'stopRestore',
			component: stopRestore,
			meta: {
				title: '梦初想物联网 | 流量卡断复网查询'
			}
		},
		{
			path: '/stopRestoreDetail',
			name: 'stopRestoreDetail',
			component: stopRestoreDetail,
			meta: {
				title: '梦初想物联网 | 流量卡断复网详情'
			}
		},
		{
			path: '/cardStopRestore',
			name: 'cardStopRestore',
			component: cardStopRestore,
			meta: {
				title: '梦初想物联网 | 停复卡'
			}
		},
		{
			path: '/sendMsg',
			name: 'sendMsg',
			component: sendMsg,
			meta: {
				title: '梦初想物联网 | 发送短信'
			}
		},
		{
			path: '/sendMsgRecord',
			name: 'sendMsgRecord',
			component: sendMsgRecord,
			meta: {
				title: '梦初想物联网 | 短信发送记录'
			}
		},
		{
			path: '/flowPool/:type',
			name: 'flowPool',
			component: flowPool
		},
		{
			path: '/ydFlow',
			name: 'ydFlow',
			component: ydFlow,
			meta: {
				title: '梦初想物联网 | 移动'
			}
		},
		{
			path: '/ltFlow',
			name: 'ltFlow',
			component: ltFlow,
			meta: {
				title: '梦初想物联网 | 联通'
			}
		},
		{
			path: '/dxFlow',
			name: 'dxFlow',
			component: dxFlow,
			meta: {
				title: '梦初想物联网 | 电信'
			}
		},
		{
			path: '/account',
			name: 'account',
			component: account,
			meta: {
				title: '梦初想物联网 | 我的账户'
			}
		},
		{
			path: '/recharge',
			name: 'recharge',
			component: recharge,
			meta: {
				title: '梦初想物联网 | 充值'
			}
		},
		{
			path: '/message',
			name: 'message',
			component: message,
			meta: {
				title: '梦初想物联网 | 我的消息'
			}
		},
		{
			path: '/manage',
			name: 'manage',
			component: manage,
			meta: {
				title: '梦初想物联网 | 账户管理'
			}
		},
		{
			path: '/forget',
			name: 'forget',
			component: forget,
			meta: {
				title: '梦初想物联网 | 忘记密码'
			}
		},
		{
			path: '/bill',
			name: 'bill',
			component: bill,
			meta: {
				title: '梦初想物联网 | 申请发票'
			}
		},
		// 卡详情
		{
			path: '/cardDetail',
			name: 'cardDetail',
			component: cardDetail,
			meta: {
				title: '梦初想物联网 | 卡详情'
			}
		},
	]
})

export default router
