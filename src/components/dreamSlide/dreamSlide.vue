<template>
	<div class="dream-slide">
		<el-col :span="24">
			<el-menu
					:default-active="index"
					active-text-color="#4cb2ff"
					class="el-menu-vertical-demo"
					unique-opened
					@open="handleOpen"
					@close="handleClose">
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
								titleTwo: '卡片列表',
								path: '/card',
								index: '2-1'
							},
							{
								titleTwo: '单卡列表',
								path: '/singleCard',
								index: '2-2'
							},
							{
								titleTwo: '卡片操作',
								path: '/cardOperate',
								index: '2-3'
							}
						]
					},
					{
						title: '流量池',
						index: '3',
						menuTwo: [
							{
								titleTwo: '中国移动',
								path: '/ydFlow',
								index: '3-1',
								type: 1
							},
							{
								titleTwo: '中国联通',
								path: '/ltFlow',
								index: '3-2',
								type: 2
							},
							{
								titleTwo: '中国电信',
								path: '/dxFlow',
								index: '3-3',
								type: 3
							}
						]
					},
					{
						title: '系统设置',
						index: '4',
						menuTwo: [
							{
								titleTwo: '我的账户',
								path: '/account',
								index: '4-1'
							},
							{
								titleTwo: '账户管理',
								path: '/manage',
								index: '4-2'
							},
							{
								titleTwo: '立即充值',
								path: '/recharge',
								index: '4-3'
							},
							{
								titleTwo: '我的消息',
								path: '/message',
								index: '4-4'
							},
//							{
//				                titleTwo: '申请开票',
//				                path: '/bill',
//				                index: '4-5'
//							}
						]
					}
				]
			};
		},
		mounted() {
			if(this.$route.name === 'index') {
				this.index = '1'
			}else if(this.$route.name === 'card') {
				this.index = '2-1'
			}else if(this.$route.name === 'singleCard') {
				this.index = '2-2'
			}else if(this.$route.name === 'cardOperate') {
				this.index = '2-3'
			}else if(this.$route.name === 'ydFlow') {
				this.index = '3-1'
			}else if(this.$route.name === 'ltFlow') {
				this.index = '3-2'
			}else if(this.$route.name === 'dxFlow') {
				this.index = '3-3'
			}else if(this.$route.name === 'account') {
				this.index = '4-1'
			}else if(this.$route.name === 'manage') {
				this.index = '4-2'
			}else if(this.$route.name === 'recharge') {
				this.index = '4-3'
			}else if(this.$route.name === 'message') {
				this.index = '4-4'
			}
		},
		methods: {
			handleOpen(key, keyPath) {
				// console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				// console.log(key, keyPath);
			},
			toPath(path) {
//				console.log(path)
//				if (path.path.indexOf('type') > 0) {
//					this.$emit('typeChange', path.type)
//				}
				this.$router.replace(path)
			}
		}
	};
</script>

<style lang="stylus" scoped>
	.dream-slide {
		width: 200px;
		height: 100vh;
		background-color: #334766;
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
	.dream-slide {
		.el-col {
			ul.el-menu {
				border-right: none;
				background-color: transparent;
				li.el-menu-item {
					font-size: 18px;
					color: #bbb;
					height: 52px;
					line-height: 52px;
				}
				li.el-menu-item:hover, li.el-menu-item:focus {
					background-color: #48576a;
				}
				li.el-submenu {
					.el-submenu__title {
						font-size: 18px;
						color: #bbb;
					}
					.el-submenu__title:hover, .el-submenu__title:focus {
						background-color: #48576a;
					}
					ul {
						li.el-menu-item-group {
							height: 36px;
							line-height: 36px;
							font-size: 16px;
							color: #999;
							.el-menu-item-group__title {
								padding: 0;
							}
						}
						li.el-menu-item {
							height: 36px;
							line-height: 36px;
							font-size: 16px;
							color: #999;
						}
					}
				}

			}
		}
		/*.is-active {
		  position: relative;
		}
		.is-active:after {
		  content: '';
		  display: block;
		  width: 10px;
		  height: 100%;
		  background-color: #4cb2ff;
		  position: absolute;
		  right: 0;
		  top: 0;
		}*/
	}
</style>

