import Vue from 'vue'
import Router from 'vue-router'

import login from '../pages/login.vue'
import index from '../pages/index.vue'
import flowCard from '../pages/flowCard.vue'
import cardDetail from '../pages/cardDetail.vue'
import notFlowCard from '../pages/notFlowCard.vue'
import stopRestoreManage from '../pages/stopRestoreManage.vue'
import cardOperate from '../pages/cardOperate.vue'
import packageInfo from '../pages/packageInfo.vue'
import packageChange from '../pages/packageChange.vue'
import packageInfoCard from '../pages/packageInfo-card.vue'
import packageChangeInfo from '../pages/packageChangeInfo.vue'
import packageChangeDetail from '../pages/packageChangeDetail.vue'
import flowPoolInfo from '../pages/flowPoolInfo.vue'
import flowPoolInfoCard from '../pages/flowPoolInfo-card.vue'
import sendMsg from '../pages/sendMsg.vue'
import sendMsgRecord from '../pages/sendMsgRecord.vue'

import message from '../pages/message.vue'



import stopRestoreDetail from '../pages/stopRestoreDetail.vue'
import account from '../pages/account.vue'
import recharge from '../pages/recharge.vue'
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
			component: index
		},
		{
			path: '/flowCard',
			name: 'flowCard',
			component: flowCard
		},
		{
			path: '/cardDetail',
			name: 'cardDetail',
			component: cardDetail
		},
		{
			path: '/notFlowCard',
			name: 'notFlowCard',
			component: notFlowCard
		},
		{
			path: '/stopRestoreManage',
			name: 'stopRestoreManage',
			component: stopRestoreManage
		},
		{
			path: '/cardOperate',
			name: 'cardOperate',
			component: cardOperate
		},
		{
			path: '/packageInfo',
			name: 'packageInfo',
			component: packageInfo
		},
		{
			path: '/packageChange',
			name: 'packageChange',
			component: packageChange
		},
		{
			path: '/packageInfoCard',
			name: 'packageInfoCard',
			component: packageInfoCard
		},
		{
			path: '/packageChangeInfo',
			name: 'packageChangeInfo',
			component: packageChangeInfo
		},
		{
			path: '/packageChangeDetail',
			name: 'packageChangeDetail',
			component: packageChangeDetail
		},
		{
			path: '/flowPoolInfo',
			name: 'flowPoolInfo',
			component: flowPoolInfo
		},
		{
			path: '/flowPoolInfoCard',
			name: 'flowPoolInfoCard',
			component: flowPoolInfoCard
		},
		{
			path: '/sendMsg',
			name: 'sendMsg',
			component: sendMsg
		},
		{
			path: '/sendMsgRecord',
			name: 'sendMsgRecord',
			component: sendMsgRecord
		},
		// 公告
		{
			path: '/message',
			name: 'message',
			component: message
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
		}
	]
})

export default router
