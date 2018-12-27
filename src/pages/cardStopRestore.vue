<template>
	<div class="cardStopRestore-wrap">
		<div class="content">
			<!-- 停卡/复卡 -->
			<div class="stop-restore">
				<div class="tips"><i class="line"></i>{{ operateStatus }}</div>
				<div class="sure-box">
					<!-- 卡号和iccid号 -->
					<div class="number-wrap">
						<!-- 卡号 -->
						<div class="card-number item">
							<span>卡号</span>
							<div class="card-box container">
								<p>{{ cardNoStr }}</p>
							</div>
						</div>
						<!-- ICCID -->
						<div class="iccid-number item">
							<span>ICCID</span>
							<div class="iccid-box container">
								<p>{{ iccidStr }}</p>
							</div>
						</div>
					</div>
					<!-- 提示文字 -->
					<div class="help-txt">确认是否{{ operateName }}所选流量卡？</div>
					<!-- 用户协议 -->
					<div class="agreement">
						<input type="checkbox" v-model="checked">
						我已同意<span @click="alertProtocol">《用户协议》</span>
					</div>
					<!-- 按钮组 -->
					<div class="btn-group">
						<div class="btn-item btn-back" @click="btnSure(0)">返回</div>
						<div class="btn-item btn-sure" @click="btnSure(1)">确认</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 验证码弹出框 -->
		<div class="modal-verify" v-show="modalVerify" @click.self="modalVerify = false">
			<div class="verify">
				<div class="verify-header">
					<div class="icon"></div>
					<span>验证</span>
					<div class="icon"></div>
				</div>
				<div class="verify-content">
					<!-- 验证码 -->
					<div class="code">
						<span>请输入获取到的验证码: </span>
						<el-input
								clearable
								class="input"
								v-model="code">
						</el-input>
					</div>
					<!-- 确认按钮 -->
					<div class="btn-sure" @click="verifySure">确认</div>
				</div>
			</div>
		</div>

		<!-- 协议弹出层 -->
		<div class="protocol-wrap" v-show="modalProtocol">
			<div class="protocol-box">
				<div class="box-header">
					<img src="../../static/images/protocol-logo.png">
					<div class="line"></div>
					<span>物联网卡免责协议</span>
				</div>
				<div class="box-content">
					<h5>
						访问者在接受上海梦初想通信技术有限公司物联网卡服务前请务必仔细阅读本条款并同意本声明。平台指上海梦初想通信技术有限公司，以下简称平台。
					</h5>
					<h5>鉴于：</h5>
					<h5>
						用户愿意使用平台的物联网业务服务，用于从事通信业务，平台愿意为用户提供物联网业务服务。为此，双方经友好协商，达成如下协议：
					</h5>
					<h5>
						第一条  定义
					</h5>
					<p>
						本协议中没有明确规定的其他相关词语，按照中国法律法规、政府部门的规定、或有权部门的政策性规定解释，没有以上文件明确解释的，参考行业惯例解释。
					</p>
					<h5>
						第二条  合同内容
					</h5>
					<p>
						平台提供的物联网业务服务包括平台服务与通信服务。
					</p>
					<p>
						1.平台服务：是指提供物联网平台的访问权限、标准文档、在线和电话支持， 以及创建和管理账户的访问权限等，帮助用户进行物联网连接管理。
					</p>
					<p>
						2.通信服务：是在现有技术条件下的网络与设施覆盖范围内的电信服务，包括数据、短信、语音。
					</p>
					<h5>
						第三条  用户权利义务 
					</h5>
					<p>
						1.用户有权享受本协议约定的通信服务并在平台提供的通信服务项目中选择和变更自己所需要的服务，有权对平台的通信业务服务质量进行监督和申诉。用户作为平台的大客户，有权享受平台提供的相应的大客户服务。
					</p>
					<p>
						2.用户不得利用平台提供的服务从事违法犯罪、妨碍社会治安的活动。并且，用户不得以任何名义及方式将其使用的平台业务以任何名义及方式（包括赠与、转租、转借、转售等）提供给第三方。
					</p>
					<p>
						3.用户自行负责其运行设备和应用程序的维护和管理，并遵守平台安全、注册、访问和使用规则，对于任何非因平台服务问题引起的故障，用户应自行负责处理和解决。
					</p>
					<p>
						4.用户应尽力避免未经授权的访问或使用服务。如发现任何未经授权使用用户账户登录平台或其他可能导致平台账户遭窃、遗失的情况，用户应及时通知平台。
					</p>
					<p>
						5.如平台有合理理由怀疑客户存在异常设备使用，平台有权停止对客户的服务。异常的设备使用是指设备无法正常运行，频繁重试、重新连接或重新启动。这种行为会致使平台的电信系统超载，平台会根据实际情况，采取必要预防措施防止异常的设备使用。
					</p>
					<p>
						6.用户应履行工信部、公安部及工商总局关于实名登记义务，配合平台对物联网SIM卡实际使用人的身份证件进行验证并登记身份信息，做到物联网SIM卡与实际使用人一一对应；用户办理涉及行业应用的物联网SIM卡业务时，应配合平台登记责任单位及责任人信息。用户作为统一办理物联网SIM卡的责任单位，明确对应责任人：姓名：身份证件号码：用户确保其向平台提供资料真实、准确、有效，并保证在发生变更后3个工作日内以书面形式通知平台。
					</p>
					<p>
						7.用户使用平台提供服务对外发布的信息所产生的纠纷，完全由用户负责解释并承担责任。如给平台造成损失，由用户负责赔偿。
					</p>
					<p>
						8.以上内容的最终解释权归上海梦初想通信技术有想公司所有。
					</p>
				</div>
				<div class="box-footer">
					<div class="btn-sure" @click="sure">确认</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {timestampToTime, format, translatePackages, baseUrl} from '../api/dataUtil'

	export default {
		data() {
			return {
				cardNoStr: '',
				iccidStr: '',
				// 验证码弹出框
				modalVerify: false,
				code: '',
				// 用户协议
				modalProtocol: false,
				checked: false,
				deviceIds: '',
				type: '',

				operateStatus: '',
				operateName: ''
			};
		},
		mounted() {
			this.type = this.$route.params.type
			if(this.type == 1) {
				this.operateStatus = '复卡'
				this.operateName = '复卡'
			}else {
				this.operateStatus = '停卡'
				this.operateName = '停卡'
			}
			this.deviceIds = this.$route.params.deviceIds
			this.getCardIccid()
		},
		methods: {
			// 获取到卡号和iccid
			getCardIccid() {
				this.$axios({
					url: '/ucenterDevice/getCardNuAndIcc',
					method: 'post',
					params: {
						deviceIds: this.deviceIds
					}
				}).then(res => {
					let data = res.data.object;
					console.log(data)
					this.cardNoStr = data.cardNumbers.replace(/,/g,'、')
					this.iccidStr = data.iccids.replace(/,/g,'、')
				})
			},
			// 页面上的确认按钮
			btnSure(i) {
				if(i===0) {
					this.$router.push({path: '/cardOperate'})
				}else {
					if(!this.checked) {
						this.$message.info('请先阅读并同意用户协议')
						return
					}
					this.code = ''
					this.$axios({
						url: '/ucenterDevice/getCode',
						method: 'post'
					}).then(res => {
						console.log(res.data)
						let data = res.data
						if(data.code == '100') {
							this.$message.success('验证码已发送至您的手机，请注意查收！')

							setTimeout(() => {
								this.modalVerify = true
							}, 2000);
						}else {
							this.$message.error(data.info)
						}
					})
					this.modalVerify = true
				}
			},
			// 验证码的确认按钮
			verifySure() {
				this.modalVerify = false
				this.$axios({
					url: '/pauseActiveCard/actCardAndStopCard',
					method: 'post',
					params: {
						type: this.type,
						code: this.code,
						deviceIds: this.deviceIds
					}
				}).then(res => {
					console.log(res.data)
					let data = res.data
					if(data.code == '100') {
						this.$message.success(data.object)
						this.modalVerify = false
						this.$router.push({path: '/cardOperate'})
					}else {
						this.$message.error(data.object)
					}
				})

			},
			// 点击协议，弹出协议内容的弹出框
			alertProtocol() {
				this.modalProtocol = true;
			},
			// 用户协议弹出框的确认按钮
			sure() {
				this.modalProtocol = false;
				this.checked = true;
			},
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	borderColor = #e7ebf3
	buttonColor = #878787
	.cardStopRestore-wrap {
		padding-top: 50px;
		padding-left: 200px;
		.content {
			width: 100%;
			height: calc(100vh - 50px);
			padding: 20px;
			overflow-y: scroll;
			/* 停卡/复卡 */
			.stop-restore {
				width: 100%;
				border-radius: 5px;
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				padding: 30px 40px 40px;
				margin-bottom: 20px;
				.tips {
					font-size: 24px;
					font-weight: 500;
					display: flex;
					.line {
						width: 6px;
						height: 28px;
						display: block;
						background-color: mainBlue;
						margin-right: 5px;
					}
				}
				.sure-box {
					margin-top: 60px;
					/* 卡号和iccid号 */
					.number-wrap {
						display: flex;
						justify-content: space-between;
						.item {
							display: flex;
							span {
								font-size: 28px;
								color: #85888f;
								margin-right: 20px;
							}
							.container {
								width: 350px;
								height: 200px;
								border: 1px solid borderColor;
								border-right: 20px solid borderColor;
								overflow-x: hidden;
								overflow-y: scroll;
								font-size: 17px;
								color: #393d42;
								padding: 10px;
								p {
									line-height: 30px;
								}
							}
							.iccid-box {
								width: 480px;
							}
						}
					}
					/* 提示文字 */
					.help-txt, .agreement {
						font-size: 18px;
						color: #85888f;
						margin: 50px 0;
						padding-left: 80px;
						span {
							color: mainBlue;
							cursor: pointer;
						}
					}
					/* 按钮组 */
					.btn-group {
						display: flex;
						padding-left: 80px;
						.btn-item {
							width: 100px;
							height: 44px;
							border-radius: 10px;
							background-color: #eeeeee;
							font-size: 18px;
							color: #858892;
							text-align: center;
							line-height: 44px;
							cursor: pointer;
						}
						.btn-sure {
							background-color: mainBlue;
							color: #fff;
							margin-left: 110px;
						}
					}
				}
			}
		}
		/* 验证码弹出框 */
		.modal-verify {
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.2);
			position: fixed;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 999;
			.verify {
				width: 550px;
				height: 300px;
				background-color: #fff;
				transform: translate(-50%, -50%);
				position: absolute;
				left: 50%;
				top: 50%;
				border-radius: 5px;
				padding-top 20px
				.verify-header {
					font-size 30px
					color #737374
					margin-bottom 50px
					display flex
					justify-content center
					.icon {
						width 10px
						height 10px
						border-radius 50%
						background-color mainBlue
						margin-top 17px
					}
					span {
						margin 0 20px
					}
				}
				.verify-content {
					padding: 0 20px;
					/* 验证码 */
					.code {
						display: flex;
						justify-content: center;
						span {
							font-size: 24px;
							line-height: 40px;
						}
						.input {
							width: 200px;
							left: 20px;
						}
					}
					/* 确认按钮 */
					.btn-sure {
						width: 100px;
						height: 44px;
						border-radius: 10px;
						background-color: mainBlue;
						font-size: 18px;
						color: #fff;
						text-align: center;
						line-height: 44px;
						cursor: pointer;
						margin: 40px auto 0;
					}
				}
			}
		}

		/* 用户协议 */
		.protocol-wrap {
			width: 100%;
			height: 100%;
			position: fixed;
			z-index: 999;
			left: 0;
			top: 0;
			background-color: rgba(0, 0, 0, 0.2);
			.protocol-box {
				width: 60%;
				height: 600px;
				transform: translate(-50%, -50%);
				position: absolute;
				left: 50%;
				top: 50%;
				padding: 0 30px;
				background-color: #fff;
				.box-header {
					width: 100%;
					height: 68px;
					line-height: 68px;
					display: flex;
					justify-content: center;
					img {
						width: 173px;
						height: 33px;
						margin-top: 19px;
					}
					.line {
						width: 2px;
						height: 26px;
						background-color: #bbbbbb;
						margin: 22px 20px 0 15px;
					}
					span {
						font-size: 20px;
						color: #666;
					}
				}
				.box-content {
					width: 100%;
					height: 420px;
					background-color: #f3f3f3;
					border-radius: 5px;
					overflow: scroll;
					padding: 5px;
					.title {
						display: flex;
						justify-content: space-between;
						span {
							font-size: 18px;
							font-weight: 500;
						}
					}
					h5 {
						font-size: 16px;
						margin-top: 10px;
						font-weight: 400;
					}
					p {
						text-indent: 2em;
						font-size: 14px;
					}
				}
				.box-footer {
					.btn-sure {
						width: 180px;
						height: 40px;
						line-height: 40px;
						border-radius: 5px;
						background-color: #4cb2ff;
						margin: 30px auto 0;
						font-size: 22px;
						color: #fff;
						text-align: center;
						cursor: pointer;
					}
				}
			}
		}
	}
</style>


