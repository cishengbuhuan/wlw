<template>
	<div class="cardStop-wrap">
		<div class="content">
			<!-- 停卡 -->
			<div class="card-stop">
				<div class="tips"><i class="line"></i>停卡</div>
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
					<div class="help-txt">确认是否停用所选流量卡？</div>
					<!-- 按钮组 -->
					<div class="btn-group">
						<div class="btn-item btn-back" @click="btnSure(0)">返回</div>
						<div class="btn-item btn-sure" @click="btnSure(1)">确认</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 处理结果弹出框 -->
		<div class="modal-result" v-show="modalResult" @click.self="modalResult = false">
			<div class="result">
				<div class="result-header">
					<div class="icon"></div>
					<span>处理结果</span>
					<div class="icon"></div>
				</div>
				<div class="result-content">
					<!-- 成功或失败的数据 -->
					<div class="data-result">
						<!-- 成功 -->
						<div class="success">
							<span>成功数</span>
							<div class="num">{{ success }}</div>
						</div>
						<!-- 失败 -->
						<div class="failure">
							<span>失败数</span>
							<div class="num">{{ failure }}</div>
						</div>
					</div>
					<!-- 确认按钮 -->
					<div class="btn-sure" @click="modalSure">确认</div>
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
				cardNoStr: '1234567890123、1234567890123、1234567890123、1234567890123、1234567890123、1234567890123、1234567890123、1234567890123、1234567890123、1234567890123、1234567890123、1234567890123、1234567890123、1234567890123、1234567890123、1234567890123、1234567890123、1234567890123、1234567890123、1234567890123、1234567890123、1234567890123、1234567890123',
				iccidStr: '12345678901234567890、12345678901234567890、12345678901234567890、12345678901234567890、12345678901234567890、12345678901234567890、12345678901234567890、12345678901234567890、12345678901234567890、12345678901234567890、12345678901234567890、12345678901234567890、12345678901234567890、12345678901234567890、12345678901234567890、12345678901234567890、12345678901234567890、12345678901234567890、',
				// 处理结果的弹出框
				modalResult: false,
				success: '10',
				failure: '20'
			};
		},
		mounted() {
		},
		methods: {
			// 确认按钮
			btnSure(i) {
				if(i===0) {
					this.$router.push({path: '/cardOperate'})
				}else {

					this.modalResult = true
				}
			},
			modalSure() {
				this.modalResult = false
				this.$router.push({path: '/cardOperate'})
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	borderColor = #e7ebf3
	buttonColor = #878787
	.cardStop-wrap {
		padding-top: 50px;
		padding-left: 200px;
		.content {
			width: 100%;
			height: calc(100vh - 50px);
			padding: 20px;
			overflow-y: scroll;
			/* 停卡 */
			.card-stop {
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
					.help-txt {
						font-size: 18px;
						color: #85888f;
						margin: 50px 0;
						padding-left: 80px;
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
		// 处理结果的弹出框
		.modal-result {
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
				padding-top 20px
				.result-header {
					font-size 30px
					color #737374
					margin-bottom 30px
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
				.result-content {
					padding: 0 20px;
					/* 成功或失败的数据 */
					.data-result {
						display: flex;
						justify-content: center;
						/* 成功 */
						.success {
							flex: 1;
							text-align: center;
							span {
								font-size: 24px;
							}
							.num {
								font-size: 38px;
								color: mainBlue;
							}
						}
						/* 失败 */
						.failure {
							flex: 1;
							text-align: center;
							span {
								font-size: 24px;
							}
							.num {
								font-size: 38px;
								color: #ff4c59;
							}
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
	}
</style>


