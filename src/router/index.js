import Vue from 'vue'
import Router from 'vue-router'

import login from '../pages/login.vue'
import index from '../pages/index.vue'
import card from '../pages/card.vue'
import singleCard from '../pages/singleCard.vue'
import cardOperate from '../pages/cardOperate.vue'
import packageChange from '../pages/packageChange.vue'
import cardActive from '../pages/cardActive.vue'
import cardStop from '../pages/cardStop.vue'
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
			component: index
		},
		{
			path: '/card',
			name: 'card',
			component: card
		},
		{
			path: '/singleCard',
			name: 'singleCard',
			component: singleCard
		},
		{
			path: '/cardOperate',
			name: 'cardOperate',
			component: cardOperate
		},
		{
			path: '/packageChange',
			name: 'packageChange',
			component: packageChange
		},
		{
			path: '/cardActive',
			name: 'cardActive',
			component: cardActive
		},
		{
			path: '/cardStop',
			name: 'cardStop',
			component: cardStop
		},
		{
			path: '/flowPool/:type',
			name: 'flowPool',
			component: flowPool
		},
		{
			path: '/ydFlow',
			name: 'ydFlow',
			component: ydFlow
		},
		{
			path: '/ltFlow',
			name: 'ltFlow',
			component: ltFlow
		},
		{
			path: '/dxFlow',
			name: 'dxFlow',
			component: dxFlow
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
		},
		// 卡详情
		{
			path: '/cardDetail',
			name: 'cardDetail',
			component: cardDetail
		},
	]
})

export default router
