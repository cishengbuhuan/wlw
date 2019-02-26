<template>
	<div class="dream-slide">
		<el-col :span="24">
			<el-menu
					:default-active="index"
					active-text-color="#4cb2ff"
					class="el-menu-vertical-demo"
					unique-opened>
				<template v-for="(item,index) in menus">
					<el-submenu v-if="item.menuTwo && item.menuTwo.length > 0" :index="item.index">
						<template slot="title">
							<span>{{ item.title }}</span>
						</template>
						<el-menu-item-group v-for="(child,i) in item.menuTwo" :key="i">
							<el-menu-item :index="child.index" @click="toPath(child)">
								{{ child.titleTwo }}
							</el-menu-item>
						</el-menu-item-group>
					</el-submenu>
					<el-menu-item v-else :index="item.index" @click="toPath(item)">
						<span>{{ item.title }}</span>
					</el-menu-item>
				</template>
			</el-menu>
		</el-col>
	</div>

</template>

<script>
	export default {
		data() {
			return {
				index: '',
				menus: [
					{
						title: '首页',
						index: '1',
						path: '/index'
					},
					{
						title: '卡片管理',
						index: '2',
						menuTwo: [
							{
								titleTwo: '共享流量卡库',
								path: '/flowCard',
								index: '2-1'
							},
							{
								titleTwo: '非共享流量卡库',
								path: '/notFlowCard',
								index: '2-2'
							},
							{
								titleTwo: '流量卡停复管理',
								path: '/stopRestoreManage',
								index: '2-3'
							}
						]
					},
					{
						title: '套餐管理',
						index: '3',
						menuTwo: [
							{
								titleTwo: '套餐信息',
								path: '/packageInfo',
								index: '3-1',
								type: 1
							},
							{
								titleTwo: '套餐变更信息',
								path: '/packageChangeInfo',
								index: '3-2',
								type: 2
							}
						]
					},
					{
						title: '流量池管理',
						index: '4',
						menuTwo: [
							{
								titleTwo: '流量池信息',
								path: '/flowPoolInfo',
								index: '4-1'
							}
						]
					},
					{
						title: '短信发送管理',
						index: '5',
						menuTwo: [
							{
								titleTwo: '短信发送',
								path: '/sendMsg',
								index: '5-1'
							},
							{
								titleTwo: '短信发送记录',
								path: '/sendMsgRecord',
								index: '5-2'
							}
						]
					},
					{
						title: '财务管理',
						index: '6',
						menuTwo: [
							{
								titleTwo: '账户详情',
								path: '/account',
								index: '6-1'
							},
//							{
//								titleTwo: '充值',
//								path: '/recharge',
//								index: '6-2'
//							}
						]
					}
				]
			};
		},
		mounted() {
			this.getIndex(this.$route.name)
		},
		methods: {
			// 路由跳转的时候，根据不同的name，设置不同的index
			getIndex(name) {
				if(name === 'index') {
					this.index = '1'
				}else if(name === 'flowCard') {
					this.index = '2-1'
				}else if(name === 'notFlowCard') {
					this.index = '2-2'
				}else if(name === 'stopRestoreManage') {
					this.index = '2-3'
				}else if(name === 'packageInfo') {
					this.index = '3-1'
				}else if(name === 'packageChangeInfo') {
					this.index = '3-2'
				}else if(name === 'flowPoolInfo') {
					this.index = '4-1'
				}else if(name === 'sendMsg') {
					this.index = '5-1'
				}else if(name === 'sendMsgRecord') {
					this.index = '5-2'
				}else if(name === 'account') {
					this.index = '6-1'
				}
			},
			toPath(path) {
				this.$router.replace(path)
			}
		},
		watch: {
			'$route.name'(val) {
				this.getIndex(val)
			}
		}
	};
</script>

<style lang="stylus" scoped>
	.dream-slide {
		width: 200px;
		height: 100vh;
		/*background-color: #334766;*/
		background-color: #fff;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 990;
		padding-top: 95px;
		.active {
			background-color: #48576a;
		}
	}
</style>
<style lang="stylus">
	mainBlue = #4cb2ff;
	.dream-slide {
		box-shadow: 0px 5px 10px rgba(47, 54, 82, 0.2);
		.el-col {
			ul.el-menu {
				border-right: none;
				background-color: transparent;
				li.el-menu-item {
					font-size: 20px;
					color: #a4a4a4;
					height: 52px;
					line-height: 52px;
				}
				>li.el-menu-item.is-active {
					background: #f3f3f3;
					position: relative;
				}
				>li.el-menu-item.is-active:after {
					content: '';
					display: block;
					width: 6px;
					height: 100%;
					background-color: mainBlue;
					position: absolute;
					left: 0;
					top: 0;
				}
				li.el-menu-item:hover, li.el-menu-item:focus {
					background-color: #f3f3f3;
				}
				li.el-submenu {
					.el-submenu__title {
						font-size: 20px;
						color: #a4a4a4;
					}
					.el-submenu__title:hover, .el-submenu__title:focus {
						background-color: #f3f3f3;
					}
					ul {
						li.el-menu-item-group {
							height: 36px;
							line-height: 36px;
							font-size: 16px;
							color: #585858;
							.el-menu-item-group__title {
								padding: 0;
							}
						}
						li.el-menu-item {
							height: 36px;
							line-height: 36px;
							font-size: 16px;
							color: #585858;
						}
						li .is-active {
							background: #f3f3f3;
							position: relative;
						}
						li .is-active:after {
							content: '';
							display: block;
							width: 6px;
							height: 100%;
							background-color: mainBlue;
							position: absolute;
							left: 0;
							top: 0;
						}
					}
				}

			}

		}
	}
</style>

