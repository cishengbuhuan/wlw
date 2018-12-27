<template>
	<div class="sendMsg-wrap">
		<div class="content">
			<!-- 发送短信 -->
			<div class="send-msg">
				<div class="tips"><i class="line"></i>发送短信</div>
				<div class="sure-box">
					<!-- 卡号 -->
					<div class="card-number">
						<span>卡号</span>
						<div class="card-box">
							<p>{{ cardNoStr }}</p>
						</div>
					</div>
					<!-- 发送短信 -->
					<div class="msg-number">
						<span>发送短信</span>
						<div class="msg-box">
							<textarea v-model="msg"></textarea>
						</div>
					</div>
					<!-- 按钮组 -->
					<div class="btn-group">
						<div class="btn-item btn-back" @click="btnSure(0)">返回</div>
						<div class="btn-item btn-sure" @click="btnSure(1)">确认</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 请求结果确认框 -->
		<div class="result-modal" v-show="modalSure">
			<div class="result">
				<div class="result-content">
					<h3>操作请求成功</h3>
					<p>具体处理结果需等运营商反馈</p>
				</div>
				<div class="btn-sure" @click="btnModalSure">确认</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {translateSystem,translatePackages,getPackageFlow,timestampToTime} from '../api/dataUtil'

	export default {
		data() {
			return {
				cardNoStr: '',
				msg: '',

				deviceIds: '',
				modalSure: false,

				resultMsg: ''
			};
		},
		mounted() {
			this.deviceIds = this.$route.params.deviceIds
			this.getBaseInfo()
		},
		methods: {
			// 确认按钮
			btnSure(i) {
				if(i===0) {
					this.$router.push({path: '/cardOperate'})
				}else {
					if(!this.msg) {
						this.$message.info('短信的内容不能为空')
						return
					}
					let loading = this.$loading({
						lock: true,
						text: '正在发送申请，请稍后...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios({
						url: '/smsSendInfo/sureSendSms',
						method: 'post',
						params: {
							deviceIds: this.deviceIds,
							content: this.msg
						}
					}).then(res => {
						let data = res.data
						console.log(data)
						if(data.code == 100) {
							loading.close();
							this.modalSure = true;
						}else {
							this.$message.error(data.object)
							this.$router.push({path: '/cardOperate'})
						}
					})
				}
			},
			// 获取到基本信息
			getBaseInfo() {
				this.$axios({
					url: '/smsSendInfo/getSmsCard',
					method: 'post',
					params: {
						deviceIds: this.deviceIds
					}
				}).then(res => {
					let data = res.data.object
					console.log(data)
//					console.log(res.data.object.cardInfos)
					this.cardNoStr = data.cardNumbers.replace(/,/g,'、')
				})
			},
			btnModalSure() {
				this.modalSure = false;
				this.$router.push({path: '/cardOperate'})
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	borderColor = #e7ebf3
	buttonColor = #878787
	.sendMsg-wrap {
		padding-top: 50px;
		padding-left: 200px;
		.content {
			width: 100%;
			height: calc(100vh - 50px);
			padding: 20px;
			overflow-y: scroll;
			/* 发送短信 */
			.send-msg {
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
					padding-left: 50px;
					/* 卡号 */
					.card-number {
						display: flex;
						span {
							font-size: 28px;
							color: #85888f;
							margin-right: 76px;
						}
						.card-box {
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
					}
					/* 发送短信 */
					.msg-number {
						display: flex;
						margin-top: 50px;
						span {
							font-size: 28px;
							color: #85888f;
							margin-right: 20px;
						}
						.msg-box {
							width: 350px;
							height: 200px;
							border: 1px solid borderColor;
							border-right: 20px solid borderColor;
							overflow-x: hidden;
							overflow-y: scroll;
							color: #393d42;
							textarea {
								width: 100%;
								height: 100%;
								padding: 10px;
								line-height: 30px;
								font-size: 17px;
							}
						}
					}
					/* 按钮组 */
					.btn-group {
						display: flex;
						margin-top: 50px;
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
		/* 请求结果确认框 */
		.result-modal {
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.2);
			position: fixed;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 999;
			.result {
				width: 550px;
				height: 300px;
				background-color: #fff;
				transform: translate(-50%, -50%);
				position: absolute;
				left: 50%;
				top: 50%;
				border-radius: 5px;
				.result-content {
					color #262626
					text-align: center
					h3 {
						font-size: 30px;
						margin: 70px 0 20px;
					}
					p {
						font-size: 24px;
					}
				}
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
					margin: 60px auto 0;
				}
			}
		}
	}
</style>


