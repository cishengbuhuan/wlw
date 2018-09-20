<template>
	<div class="forget-wrap">
		<div class="header">
			<img src="../../static/images/forget-logo.png">
		</div>
		<!-- 找回密码 -->
		<div class="find-password">
			<div class="tips">找回密码：</div>
			<!-- 进度条 -->
			<div class="progress">
				<!-- 验证身份 -->
				<div class="verify">
					<div class="step"></div>
					<span class="finished">验证身份</span>
				</div>
				<!-- 分割线 -->
				<div :class="[{lineFinished : stepOneFinished},'dividing-line']"></div>
				<!-- 重置登录密码 -->
				<div :class="[{finishOne : stepOneFinished},'reset']">
					<div class="step"></div>
					<span>重置登录密码</span>
				</div>
				<!-- 分割线 -->
				<div :class="[{lineFinished : stepTwoFinished},'dividing-line']"></div>
				<!-- 完成 -->
				<div :class="[{finishTwo : stepTwoFinished},'complete']">
					<div class="step"></div>
					<span>完成</span>
				</div>
			</div>
			<!-- 表单 -->
			<div class="form">
				<!-- 验证身份 -->
				<div class="verify" v-show="isShow.verify">
					<!-- 手机号码 -->
					<div class="tel">
						<span>手机号码</span>
						<input type="tel" placeholder="请输入手机号码" v-model="telVal" maxlength="11">
					</div>
					<!-- 验证码 -->
					<div class="code">
						<span>验证码</span>
						<input class="code-input" type="tel" maxlength="6" placeholder="请输入你的验证码" v-model="codeVal">
						<div class="btn-get" @click="getCode" v-if="!sendMsgDisabled">{{ code }}</div>
						<div class="btn-get" v-if="sendMsgDisabled">{{ count + '秒后获取' }}</div>
					</div>
					<div class="msg">
						<div class="icon"></div>
						<span>为了您的账户安全，请先验证手机号码</span>
					</div>
					<!-- 下一步 -->
					<div class="btn-next" @click="btnNext">下一步</div>
				</div>
				<!-- 重置登录密码 -->
				<div class="reset" v-show="isShow.reset">
					<!-- 重置密码 -->
					<div class="reset">
						<span>重置密码</span>
						<input type="text" placeholder="设置你的登入密码" minlength="6" maxlength="16" v-model.lazy="newPsw">
					</div>
					<!-- 确认密码 -->
					<div class="sure">
						<span>确认密码</span>
						<input type="text" placeholder="确认登入密码" minlength="6" maxlength="16" v-model.lazy="confirmPsw">
					</div>
					<!-- 确认按钮 -->
					<div class="btn-sure" @click="btnSure">确认</div>
				</div>
				<!-- 完成 -->
				<div class="complete" v-show="isShow.complete">
					<div class="info"><i class="el-icon-circle-check"></i>成功找回密码</div>
					<div class="back-login" @click="backLogin">返回登录</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				stepOneFinished: false,
				stepTwoFinished: false,
				isShow: {
					verify: true,
					reset: false,
					complete: false
				},
				telVal: '',
				code: '获取验证码',
				codeVal: '',
				count: '',
				defaultTime: 5,
				sendMsgDisabled: false,
				newPsw: '',
				confirmPsw: ''
			};
		},
		watch: {
			newPsw(val) {
				let reg = /[^\w\.\/]/ig
				this.newPsw = val.replace(reg, '')
			},
			confirmPsw(val) {
				let reg = /[^\w\.\/]/ig
				this.confirmPsw = val.replace(reg, '')
			}
		},
		methods: {
			// 验证身份的下一步
			btnNext() {
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.telVal))) {
					this.$message.error('请输入正确的手机号码！');
				} else {
					this.$axios({
						url: '/api/v2/user/verifiCode',
						method: 'post',
						params: {
							mobileNo: this.telVal,
							code: this.codeVal
						}
					}).then(res => {
						if (res.data.code === 1) {
							this.isShow.verify = false
							this.isShow.reset = true
							this.isShow.complete = false

							this.stepOneFinished = true
						} else {
							this.$message.error('请输入正确的验证码！');
						}
					})
				}
			},
			// 获取验证码
			getCode() {
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.telVal))) {
					this.$message.error('请输入正确的手机号码！');
				} else {
					this.$axios({
						url: '/api/v2/user/verifiPhone',
						method: 'post',
						params: {
							mobileNo: this.telVal
						}
					}).then(res => {
						if (res.data.code === 1) {
							this.$message.info('验证码已发送，请注意查收！');
							this.countDown()
						} else {
							this.$message.error('该手机号码未被注册，请联系管理员！');
						}
					})
				}
			},
			// 重置密码的确认按钮
			btnSure() {
				if (this.newPsw.length < 6 || this.confirmPsw.length < 6) {
					this.$message.info('密码长度不能小于6！');
				} else {
					this.$axios({
						url: '/api/v2/user/forgetPassword',
						method: 'post',
						params: {
							mobileNo: this.telVal,
							newPassword: this.newPsw,
							confirmPassword: this.confirmPsw
						}
					}).then(res => {
						if (res.data.code === 1) {
							this.isShow.verify = false
							this.isShow.reset = false
							this.isShow.complete = true

							this.stepTwoFinished = true
						} else {
							this.$message.error(res.data.msg);
						}
					})
				}
			},
			// 完成的返回登录按钮
			backLogin() {
				this.$router.push({path: '/login'})
			},
			// 获取验证码的倒计时
			countDown() {
				this.sendMsgDisabled = true;
				this.count = 60;
				var timer = setInterval(() => {
					this.count--;
					if (this.count <= 0) {
						this.sendMsgDisabled = false;
						clearInterval(timer);
					}
				}, 1000);
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainHeader = #4cb2ff;
	.forget-wrap {
		width: 100%;
		height: 100vh;
		background-color: #f8f8f8;
		.header {
			width: 100%;
			height: 150px;
			line-height: 150px;
			background-color: #fff;
			border-bottom: 1px solid #f3f3f3;
			img {
				width: 462px;
				height: 70px;
				margin-left: 70px;
			}
		}
		/* 找回密码 */
		.find-password {
			width: 1030px;
			margin: 0 auto;
			.tips {
				font-size: 30px;
				margin: 80px 0 40px;
			}
			/* 进度条 */
			.progress {
				width: 100%;
				display: flex;
				justify-content: space-around;
				.verify, .reset, .complete {
					text-align: center;
					.step {
						width: 40px;
						height: 40px;
						margin: 0 auto 10px;
					}
					span {
						font-size: 16px;
						color: #999;
					}
					.finished {
						color: #2483c6;
					}
				}
				/* 验证身份 */
				.verify {
					.step {
						background: url("../../static/images/step1.png");
						-webkit-background-size: 100% 100%;
						background-size: 100% 100%;
					}
				}
				/* 重置登录密码 */
				.reset {
					.step {
						background: url("../../static/images/step2.png");
						-webkit-background-size: 100% 100%;
						background-size: 100% 100%;
					}
				}
				.finishOne {
					.step {
						background: url("../../static/images/step2-1.png");
						-webkit-background-size: 100% 100%;
						background-size: 100% 100%;
					}
					span {
						color: #2483c6;
					}
				}
				/* 完成 */
				.complete {
					.step {
						background: url("../../static/images/step3.png");
						-webkit-background-size: 100% 100%;
						background-size: 100% 100%;
					}
				}
				.finishTwo {
					.step {
						background: url("../../static/images/step3-1.png");
						-webkit-background-size: 100% 100%;
						background-size: 100% 100%;
					}
					span {
						color: #2483c6;
					}
				}
				/* 分割线 */
				.dividing-line {
					width: 340px;
					height: 6px;
					border-radius: 3px;
					background-color: #bbbbbb;
					margin-top: 15px;
				}
				.lineFinished {
					background-color: #2483c6;
				}
			}
			/* 表单 */
			.form {
				width: 100%;
				margin-top: 60px;
				border-radius: 5px;
				box-shadow: 0 0 5px rgba(187, 187, 187, 1);
				background-color: #fff;
				padding: 50px 0;
				/* 验证身份 */
				.verify {
					width: 460px;
					margin: 0 auto;
					/* 手机号码 */
					.tel {
						display: flex;
						justify-content: space-between;
						line-height: 50px;
						span {
							font-size: 16px;
							width: 90px;
						}
						input {
							width: 370px;
							height: 40px;
							border: 1px solid #bbb;
							font-size: 14px;
							padding-left: 15px;
						}
					}
					/* 验证码 */
					.code {
						width: 100%;
						display: flex;
						line-height: 40px;
						margin-bottom: 20px;
						span {
							font-size: 16px;
							width: 90px;
							text-align: center;
						}
						.code-input {
							width: 270px;
							height: 40px;
							border: 1px solid #bbb;
							font-size: 14px;
							margin-right: 20px;
							padding-left: 15px;
						}
						.btn-get {
							width: 80px;
							height: 40px;
							border-radius: 5px;
							border: 1px solid #bbb;
							font-size: 12px;
							text-align: center;
							cursor: pointer;
						}
					}
					.msg {
						display: flex;
						padding-left: 90px;
						margin-top: 10px;
						.icon {
							width: 19px;
							height: 19px;
							background: url("../../static/images/icon-tips.png");
							-webkit-background-size: 100% 100%;
							background-size: 100% 100%;
							margin-top: 2px;
							margin-right: 10px;
						}
						span {
							font-size: 18px;
							color: #999;
						}
					}
					.btn-next {
						width: 140px;
						height: 46px;
						line-height: 46px;
						border: 1px solid #bbbbbb;
						border-radius: 5px;
						text-align: center;
						font-size: 18px;
						cursor: pointer;
						margin: 46px auto 0;
					}
				}
				/* 重置登录密码 */
				.reset {
					width: 460px;
					margin: 0 auto;
					/* 重置密码 */
					.reset, .sure {
						width: 100%;
						display: flex;
						justify-content: space-between;
						line-height: 40px;
						margin-bottom: 20px;
						span {
							font-size: 16px;
							width: 90px;
							text-align: center;
						}
						input {
							width: 370px;
							height: 40px;
							border: 1px solid #bbb;
							font-size: 14px;
							padding-left: 15px;
						}
					}
					.btn-sure {
						width: 140px;
						height: 34px;
						line-height: 34px;
						text-align: center;
						border: 1px solid #bbb;
						border-radius: 5px;
						margin: 10px auto 0;
						font-size: 16px;
						cursor: pointer;
					}
					/* 确认密码 */
					/* 确认按钮 */
				}
				/* 重置登录密码 */
				.complete {
					text-align: center;
					.info {
						font-size: 22px;
						i {
							color: #40cd36;
							font-size: 24px;
							margin-right: 30px;
						}
					}
					.back-login {
						width: 140px;
						height: 43px;
						line-height: 43px;
						border: 1px solid #bbb;
						border-radius: 5px;
						text-align: center;
						cursor: pointer;
						font-size: 16px;
						margin: 60px auto 0;
					}
				}
			}
		}
	}
</style>

