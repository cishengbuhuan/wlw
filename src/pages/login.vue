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
				<div class="form">
					<!-- 账号 -->
					<div class="tel">
						<input type="tel" v-model="user.account" placeholder="请输入账号" maxlength="11" @change="loadCode">
					</div>
					<!-- 密码 -->
					<div class="psw">
						<input type="password" v-model="user.password" placeholder="请输入密码" @change="loadCode">
					</div>
					<!-- 图形验证码 -->
					<div class="img-code" v-show="codeShow">
						<input type="number" placeholder="请输入图形验证码" maxlength="4" v-model="user.code">
						<img :src="user.imgSrc" alt="验证码" class="img" @click="refreshImg">
					</div>
					<!-- 记住密码和忘记密码 -->
					<div class="remember-forget">
						<div class="remember">
							<input type="checkbox" v-model="isRemember">
							<span>记住账号</span>
						</div>
						<router-link to="/forget">
							<div class="forget">忘记密码</div>
						</router-link>
					</div>
					<!-- 登录按钮 -->
					<div class="btn-login" @click="btnLogin">立即登录</div>
				</div>
			</div>
		</div>
		<!--<footer>-->
		<!--<div class="about">-->
		<!--&lt;!&ndash; 关于我们 &ndash;&gt;-->
		<!--<div class="about-us">-->
		<!--<div class="icon"></div>-->
		<!--<span>关于我们</span>-->
		<!--</div>-->
		<!--<div class="line"></div>-->
		<!--&lt;!&ndash; 服务 &ndash;&gt;-->
		<!--<div class="service">-->
		<!--<div class="hot-line">-->
		<!--<div class="icon"></div>-->
		<!--<span>客服热线：028-849994</span>-->
		<!--</div>-->
		<!--<div class="time">-->
		<!--<div class="icon"></div>-->
		<!--<span>周一至周五：09：00-18：00</span>-->
		<!--</div>-->
		<!--</div>-->
		<!--</div>-->
		<!--<div class="copyright">-->
		<!--<span>版权所有：2.0</span>-->
		<!--<br>-->
		<!--<span>备案号：12345789</span>-->
		<!--</div>-->
		<!--</footer>-->
	</div>
</template>

<script>
	import {baseUrl} from '../api/dataUtil'
	export default {
		data() {
			return {
				codeShow: false,
				user: {
					account: '',
					password: '',
					code: '',
					imgSrc: ''
				},
				bg: {
					width: '100%',
					minHeight: '100vh',
					background: "url(" + require('../../static/images/login-bg.jpg') + ") no-repeat",
					backgroundSize: '100% 100%',
					position: 'relative'
				},
				isRemember: true,
				baseUrl: baseUrl
			};
		},
		mounted() {
//          this.loadCode()
			this.rememberAccount()
		},
		methods: {
			// 记住账号
			rememberAccount(){
				// 如果点击了记住账号
				if(this.isRemember) {
					this.user.account = sessionStorage.getItem('account');
					this.user.password = sessionStorage.getItem('password');
				}
			},
			btnLogin() {
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.user.account))) {
					this.$message.error('请输入正确的手机号码！');
				}else{
					if(this.codeShow == false){
						this.codeShow = true
						this.user.imgSrc = this.baseUrl + '/api/v1/image?userCode=' + this.user.account + '&num=' + Math.random()
					}else {
						this.$axios({
							url: '/api/v1/login',
							method: 'post',
							params: {
								userCode: this.user.account,
								password: this.user.password,
								code: this.user.code
							}
						}).then(res => {
							let code = res.data.code;
							if (code == 1) {
								sessionStorage.setItem('_token', res.data.data.token);
								sessionStorage.setItem('userId', res.data.data.userId);
								sessionStorage.setItem('companyId', res.data.data.companyId);
								this.$router.push({path: '/index'})
							} else if (code == 0) {
								this.$message(res.data.msg);
						        this.user.imgSrc = this.baseUrl + '/api/v1/image?userCode=' + this.user.account + '&num=' + Math.random()
							}
						})
					}
				}
			},
			// 账号和密码不为空
			loadCode() {
				if (this.user.account === '' || this.user.password === '') {
					return
				}
				this.codeShow = true;
				// 把账号和密码保存在sessionStorage里面
				sessionStorage.setItem('account', this.user.account);
				sessionStorage.setItem('password', this.user.password);

				this.user.imgSrc = this.baseUrl + '/api/v1/image?userCode=' + this.user.account
			},
			// 点击刷新验证码
			refreshImg() {
				this.user.imgSrc = '';
				this.$nextTick(() => {
					this.user.imgSrc = this.baseUrl + '/api/v1/image?userCode=' + this.user.account + '&num=' + Math.random()
				})
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
				width: 23%;
				height: 350px;
				border-radius: 5px;
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				background-color: #fff;
				position: absolute;
				top: 210px;
				right: 5.2%;
				padding: 0 42px;
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
					.img-code {
						display: flex;
						height: 60px;
						border-bottom: 1px solid #ddd;
						input {
							width: 100%;
						}
						.img {
							width: 78px;
							height: 38px;
							margin-top: 14px;
							cursor: pointer;
						}
					}
					/* 记住密码和忘记密码 */
					.remember-forget {
						display: flex;
						justify-content: space-between;
						margin-top: 5px;
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
						background-color: #5769b1;
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

