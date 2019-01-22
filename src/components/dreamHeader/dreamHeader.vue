<template>
	<div class="dream-header">
		<div class="logo-box">
			<div class="logo"><img src="../../../static/images/logo.png"></div>
		</div>
		<div class="user">
			<div class="info">
				<router-link to="/message">
					<el-badge :value="user.msgNum" :max="99" :hidden="user.msgNum == 0">
						<!--<i class="el-icon-bell"></i>-->
						<img src="../../../static/images/index/icon-msg.png">
					</el-badge>
				</router-link>
			</div>
			<div class="head-name">
				<div class="name">
					<el-dropdown trigger="click">
			            <span class="el-dropdown-link">
			              {{ user.nickname }}<i class="el-icon-arrow-down el-icon--right"></i>
			            </span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="editLoginPsw">登录密码修改</el-dropdown-item>
							<el-dropdown-item @click.native="signOut">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</div>
		</div>


		<!-- 修改密码弹出框 -->
		<div class="changePsw-remark" v-show="modalChangePsw" @click.self="modalChangePsw = false">
			<div class="change-psw">
				<div class="title">修改密码</div>
				<el-form
						:model="form"
						status-icon
						:rules="rules"
						label-width="100px"
						class="form"
						@keyup.enter.native="btnLogin">
					<el-form-item label="原始密码" prop="oldPsw">
						<el-input
								type="password"
								placeholder="请输入原始密码"
								v-model="form.oldPsw"
								auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="newPsw">
						<el-input
								type="password"
								placeholder="请输入新密码"
								v-model="form.newPsw"
								auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="surePsw">
						<el-input
								type="password"
								placeholder="请确认原始密码"
								v-model="form.surePsw"
								auto-complete="off"></el-input>
					</el-form-item>
					<div class="btn-group">
						<div class="btn-back btn-gray" @click="btnSure(0)">返回</div>
						<div class="btn-sure btn-main" @click="btnSure(1)">确认</div>
					</div>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import bus from '../../eventBus.js'
	export default {
		data() {
			let checkOldPsw = (rule, value, callback) => {
				if (!value) {
					callback(new Error('请输入原始密码'));
				} else if (value.length < 6 || value.length > 12) {
					callback(new Error('密码长度为6-12位!'));
				} else {
					callback();
				}
			};
			let checkNewPsw = (rule, value, callback) => {
				if (!value) {
					callback(new Error('请输入新密码'));
				} else if (value.length < 6 || value.length > 12) {
					callback(new Error('密码长度为6-12位!'));
				}  else {
					callback();
				}
			};
			let checkSurePsw = (rule, value, callback) => {
				if (!value) {
					callback(new Error('请确认新密码'));
				} else if (value !== this.form.newPsw) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				headImg: 'logo',
				msgNum: null,
				user: {
					msgNum: 0,
					nickname: ''
				},


				modalChangePsw: false,
				form: {
					oldPsw: '',
					newPsw: '',
					surePsw: ''
				},
				rules: {
					oldPsw: [
						{validator: checkOldPsw, trigger: 'blur'}
					],
					newPsw: [
						{validator: checkNewPsw, trigger: 'blur'}
					],
					surePsw: [
						{validator: checkSurePsw, trigger: 'blur'}
					]
				}
			};
		},
		mounted() {
			bus.$on('unReadNo', data => {
				this.user.msgNum = data
			})
			this.getHeaderInfo()
		},
		methods: {
			getHeaderInfo() {
				this.$axios({
					url: '/api/v2/base/getBasal',
					method: 'post'
				}).then(res => {
					let data = res.data.data;
					this.user.msgNum = data.unReadNo;
					this.user.nickname = data.companyName;
				})
			},
			// 登录密码修改
			editLoginPsw() {
				this.modalChangePsw = true
			},
			// 确认按钮
			btnSure(i) {
				if(i==0) {
					this.form.oldPsw = ''
					this.form.newPsw = ''
					this.form.surePsw = ''
					this.modalChangePsw = false
				}else {
					if(!this.form.oldPsw || !this.form.newPsw || !this.form.surePsw) {
						this.$message.info('请先把表单填写完整')
					}
					this.$axios({
						url: '/api/updatePwd',
						method: 'post',
						params: {
							newPassWord: this.form.newPsw,
							oldPassWord: this.form.oldPsw
						}
					}).then(res => {
						if(res.data.code == 100) {
							this.$message.success(res.data.object)

							this.$router.push({path: '/'})
						}else {
							this.$message.error(res.data.object)
							this.modalChangePsw = false
						}
					})
				}
			},
			// 退出登录
			signOut() {
//				console.log('退出')
				sessionStorage.removeItem('_token');
				sessionStorage.removeItem('userId');
				sessionStorage.removeItem('companyId');
				this.$router.push({path: '/login'})
			}
		},
		watch: {

		}
	};
</script>

<style lang="stylus" scoped>
	mainHeader = #4cb2ff;
	.dream-header {
		width: 100%;
		height: 64px;
		line-height: 64px;
		background-color: #fff;
		box-shadow: 0px 2px 10px rgba(47, 54, 82, 0.2);
		display: flex;
		justify-content: space-between;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		padding-right: 60px;
		.logo-box {
			width: 200px;
			height: 100%;
			position: relative;
			.logo {
				width: 134px;
				height: 31px;
				transform: translate(-50%, -50%);
				position: absolute;
				left: 50%;
				top: 22%;
				img {
					width: 100%;
					height: 100%;
				}
			}
		}
		.user {
			display: flex;
			.info {
				.el-badge {
					/*width: 28px;
					height: 28px;
					margin-right: 30px;
					border-radius: 3px;
					background-color: mainHeader;
					text-align: center;
					line-height: 28px;
					color: #fff;*/
					width: 22px;
					height: 28px;
					margin-right: 30px;
					img {
						width: 100%;
						height: 100%;
						position: relative;
						top: -75%;
					}
				}
			}
			.head-name {
				display: flex;
				line-height: 64px;
				.head {
					width: 28px;
					height: 28px;
					border-radius: 50%;
					margin-top: 18px;
					margin-right: 10px;
				}
				.name {
					display: flex;
					color: #585858;
					font-size: 18px;
					cursor: pointer;
					span {
						color: #585858;
						font-size: 18px;
					}
				}
			}
		}


		/* 修改密码的弹出框 */
		.changePsw-remark {
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.2);
			position: fixed;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 999;
			.change-psw {
				width: 500px;
				height: 360px;
				background-color: #fff;
				transform: translate(-50%, -50%);
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				position: absolute;
				left: 50%;
				top: 50%;
				border-radius: 20px;
				.title {
					font-size: 30px;
					color: #737374;
					text-align: center;
					margin-bottom: 20px;
				}
				.form {
					padding-right: 40px;
				}
				.btn-group {
					text-align: center;
					margin-top: 20px;
					.btn-back {
						margin: 0 100px;
					}
				}
			}
		}
	}
</style>

