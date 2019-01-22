<template>
	<div class="login-wrap" :style="bg">
		<!--<header>-->
			<!--<span>欢迎登录</span>-->
			<!--<div class="line"></div>-->
			<!--<img class="logo" src="../../static/images/company-logo.png">-->
		<!--</header>-->
		<header></header>
		<div class="content">
			<!-- 文字信息 -->
			<div class="info">
				<h3>物联网管理平台</h3>
				<p>Internet of Things Management Platform</p>
			</div>
			<!-- 登录表单 -->
			<div class="login-form">
				<div class="title">账号登录</div>
				<!--<div class="form">-->
					<!--&lt;!&ndash; 账号 &ndash;&gt;-->
					<!--<div class="tel">-->
						<!--<input type="tel" v-model="user.account" placeholder="请输入账号" maxlength="11" @change="loadCode">-->
					<!--</div>-->
					<!--&lt;!&ndash; 密码 &ndash;&gt;-->
					<!--<div class="psw">-->
						<!--<input type="password" v-model="user.password" placeholder="请输入密码" @change="loadCode">-->
					<!--</div>-->
					<!--&lt;!&ndash; 图形验证码 &ndash;&gt;-->
					<!--<div class="img-code" v-show="codeShow">-->
						<!--<input type="text" placeholder="请输入图形验证码" maxlength="4" v-model="user.code">-->
						<!--<img :src="user.imgSrc" alt="验证码" class="img" @click="refreshImg">-->
					<!--</div>-->
					<!--&lt;!&ndash; 记住密码和忘记密码 &ndash;&gt;-->
					<!--<div class="remember-forget">-->
						<!--<div class="remember">-->
							<!--<input type="checkbox" v-model="isRemember">-->
							<!--<span>记住账号</span>-->
						<!--</div>-->
						<!--<router-link to="/forget">-->
							<!--<div class="forget">忘记密码</div>-->
						<!--</router-link>-->
					<!--</div>-->
					<!--&lt;!&ndash; 登录按钮 &ndash;&gt;-->
					<!--<div class="btn-login" @click="btnLogin">立即登录</div>-->
				<!--</div>-->
				<el-form
						:model="form"
						status-icon
						:rules="rules"
						label-width="100px"
						class="form"
						@keyup.enter.native="btnLogin">
					<el-form-item label="用户名" prop="name">
						<el-input
								v-model="form.name"
								auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input
								type="password"
								v-model="form.password"
								auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="验证码" prop="code" class="code">
						<el-input
								v-model="form.code"
								auto-complete="off"></el-input>
						<img :src="form.imgSrc" @click="refreshCode" class="img">
					</el-form-item>
					<!--<el-form-item class="remember-forget">-->
						<!--&lt;!&ndash;<el-form-item label="记住密码">&ndash;&gt;-->
							<!--&lt;!&ndash;<el-switch v-model="form.remember"></el-switch>&ndash;&gt;-->
						<!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
						<!--&lt;!&ndash;<router-link to="/forget">&ndash;&gt;-->
							<!--&lt;!&ndash;<div class="forget">忘记密码</div>&ndash;&gt;-->
						<!--&lt;!&ndash;</router-link>&ndash;&gt;-->
						<!---->
					<!--</el-form-item>-->
					<div class="remember-forget">
						<div class="remember">
							<input type="checkbox" v-model="form.remember">
							<span>记住账号</span>
						</div>
						<router-link to="/forget">
							<div class="forget">忘记密码</div>
						</router-link>
					</div>
					<el-form-item>
						<div class="btn-login" @click="btnLogin">立即登录</div>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import {baseUrl} from '../api/dataUtil'
	export default {
		data() {
			let checkName = (rule, value, callback) => {
				if (!value) {
					callback(new Error('请输入用户名'));
				} else {
					callback();
				}
			};
			let checkPsw = (rule, value, callback) => {
				if (!value) {
					callback(new Error('请输入密码'));
				} else {
					callback();
				}
			};
			let checkCode = (rule, value, callback) => {
				if (!value) {
					callback(new Error('请输入验证码'));
				} else {
					callback();
				}
			};
			return {
				bg: {
					width: '100%',
					minHeight: '100vh',
					background: "url(" + require('../../static/images/login-bg.jpg') + ") no-repeat",
					backgroundSize: '100% 100%',
					position: 'relative'
				},
				isRemember: true,
				baseUrl: baseUrl,
				form: {
					name: '',
					password: '',
					code: '',
					imgSrc: '',
					time: '',
					remember: ''
				},
				rules: {
					name: [
						{validator: checkName, trigger: 'blur'}
					],
					password: [
						{validator: checkPsw, trigger: 'blur'}
					],
					code: [
						{validator: checkCode, trigger: 'blur'}
					]
				}
			};
		},
		created() {
			// 页面创建的时候获取一次验证码
			this.refreshCode()
		},
		mounted() {
			// 页面挂载的时候，先去看一下是否保存了账户密码
			this.getAccountPassword()
		},
		methods: {
			// 登录按钮
			btnLogin() {
				if(!this.form.name || !this.form.password || !this.form.code) {
					this.$message.info('登录表单的内容不能为空！')
					return
				}
				this.$axios({
					url: '/api/v1/login',
					method: 'post',
					params: {
						userCode: this.form.name,
						password: this.form.password,
						code: this.form.code,
						time: this.form.time
					}
				}).then(res => {
					// 登录的时候，如果点击了记住账号，则把账号和密码存放在缓存里
					if(this.form.remember) {
						localStorage.setItem('name', this.form.name);
						localStorage.setItem('password', this.form.password);
						localStorage.setItem('isRemember', this.form.remember);
					}else {
						localStorage.removeItem('name')
						localStorage.removeItem('password')
						localStorage.removeItem('isRemember')
					}


					let code = res.data.code;
					if (code == 1) {
						sessionStorage.setItem('_token', res.data.data.token);
						sessionStorage.setItem('userId', res.data.data.userId);
						sessionStorage.setItem('companyId', res.data.data.companyId);
						this.$router.push({path: '/index'})
					} else if (code == 0) {
						this.$message(res.data.msg);
						this.refreshCode()
					}
				})
			},
			// 点击刷新验证码
			refreshCode() {
				let time = Date.parse(new Date())
				this.form.time = time
				this.form.imgSrc = `${this.baseUrl}/api/v1/image?time=${time}`
			},
			// 获取账户密码
			getAccountPassword() {
				this.form.remember = localStorage.getItem('isRemember');
				this.form.name = localStorage.getItem('name');
				this.form.password = localStorage.getItem('password');
			}
		}
	};
</script>

<style lang="stylus" scoped>
	.login-wrap {
		position: relative;
		header {
			width: 100%;
			height: 110px;
			display: flex;
			padding-top: 50px;
			span {
				font-size: 40px;
				color: #fff;
				margin: 0 30px 0 90px;
			}
			.line {
				width: 2px;
				height: 60px;
				background-color: #ddd;
				margin-right: 25px;
			}
			.logo {
				width: 410px;
				height: 60px;
			}
		}
		.content {
			/* 文字信息 */
			.info {
				margin-top: 100px;
				margin-left: 300px;
				color: #fff;
				h3 {
					font-size: 70px;
				}
				p {
					font-size: 22px;
				}
			}
			/* 登录表单 */
			.login-form {
				width: 400px;
				height: 350px;
				border-radius: 5px;
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				background-color: #fff;
				position: absolute;
				top: 210px;
				right: 5.2%;
				padding-right: 30px;
				.title {
					font-size: 22px;
					height: 76px;
					line-height: 76px;
					text-align: center;
				}
				.form {
					/* 账号和密码 */
					.tel, .psw {
						width: 100%
						height: 46px
						border-bottom: 1px solid #ddd;
						input {
							width: 100%
							height: 100%
						}
					}
					/* 图形验证码 */
					.code {
						.img {
							cursor: pointer;
						}
					}
					/* 记住密码和忘记密码 */
					.remember-forget {
						display: flex;
						justify-content: space-between;
						margin-top: 20px;
						padding-left: 100px;
						.forget {
							cursor: pointer;
						}
					}
					/* 登录按钮 */
					.btn-login {
						width: 100%;
						height: 36px;
						line-height: 36px;
						border-radius: 5px;
						text-align: center;
						font-size: 16px;
						cursor: pointer;
						background-color: #4cb2ff;
						margin: 18px auto 0;
						color: #fff;
					}
				}
			}
		}
		footer {
			width: 100%;
			position: absolute;
			bottom: 0;
			left: 0;
			text-align: center;
			.about {
				display: flex;
				justify-content: center;
				.about-us {
					display: flex;
					line-height: 70px;
					padding-left: 40px;
					.icon {
						width: 50px;
						height: 42px;
						background: url("../../static/images/icon-about-us.png");
						-webkit-background-size: 100% 100%;
						background-size: 100% 100%;
						margin-top: 14px;
					}
					span {
						font-size: 34px;
						color: #fff;
						margin: 0 35px 0 15px;
					}
				}
				.line {
					width: 1px;
					height: 70px;
					background-color: #fff;
					margin-right: 35px;
				}
				.service {
					.hot-line {
						display: flex;
						.icon {
							width: 28px;
							height: 28px;
							background: url("../../static/images/icon-server.png");
							-webkit-background-size: 100% 100%;
							background-size: 100% 100%;
							margin-right: 10px;
						}
						span {
							font-size: 28px;
							color: #fff;
							line-height: 30px;
						}
					}
					.time {
						display: flex;
						margin-top: 20px;
						.icon {
							width: 20px;
							height: 20px;
							background: url("../../static/images/icon-time.png");
							-webkit-background-size: 100% 100%;
							background-size: 100% 100%;
							margin-right: 15px;
							margin-left: 5px;
						}
						span {
							font-size: 20px;
							color: #fff;
							line-height: 20px;
						}
					}
				}
			}
			.copyright {
				font-size: 18px;
				color: #fff;
			}
		}
	}
</style>

<style lang="stylus">
	.code {
		margin-bottom: 5px;
		.el-form-item__content {
			display: flex;
		}
	}
	/* 记住密码和忘记密码 */
	.remember-forget {
		.el-form-item__content {
			display: flex;
			justify-content: space-between;
			margin-left: 0 !important;
			.el-switch {
				top: 10px;
			}
			.forget {
				cursor: pointer;
			}
		}
	}
	/* 这段代码的作用是清除浏览器自动填充时的黄色背景 */
	input {
		&::-webkit-input-placeholder {
			 color: #999;
	    }
		&:-webkit-autofill {
			 transition: background-color 5000s ease-in-out 0s;
			 -webkit-text-fill-color: #333 !important;
			&:hover {
				 transition: background-color 5000s ease-in-out 0s;
				 -webkit-text-fill-color: #333 !important;
		    }
			&:focus {
				 transition: background-color 5000s ease-in-out 0s;
				 -webkit-text-fill-color: #333 !important;
		    }
			&:active {
				 transition: background-color 5000s ease-in-out 0s;
				 -webkit-text-fill-color: #333 !important;
		    }
		}
	}
</style>