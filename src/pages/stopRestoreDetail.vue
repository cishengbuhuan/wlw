<template>
	<div class="stopRestore-wrap">
		<div class="content">
			<!-- 停复卡详情 -->
			<div class="stopRestore-detail">
				<div class="tips"><i class="line"></i>停复卡详情</div>
				<div class="operate-type">操作类型: {{ operateType }}</div>
				<div class="detail-box">
					<!-- 卡号和iccid号 -->
					<div class="number-wrap">
						<!-- 成功 -->
						<div class="success number-item">
							<h3>{{ operateType }}成功</h3>
							<div class="box">
								<!-- 卡号 -->
								<div class="card-number item">
									<span>卡号</span>
									<div class="card-box container">
										<p>{{ successCard }}</p>
									</div>
								</div>
								<!-- ICCID -->
								<div class="iccid-number item">
									<span>ICCID</span>
									<div class="iccid-box container">
										<p>{{ successIccid }}</p>
									</div>
								</div>
							</div>
						</div>
						<!-- 失败 -->
						<div class="failure number-item">
							<h3>{{ operateType }}失败</h3>
							<div class="box">
								<!-- 卡号 -->
								<div class="card-number item">
									<span>卡号</span>
									<div class="card-box container">
										<p>{{ failCard }}</p>
									</div>
								</div>
								<!-- ICCID -->
								<div class="iccid-number item">
									<span>ICCID</span>
									<div class="iccid-box container">
										<p>{{ failIccid }}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!-- 返回按钮 -->
					<div class="btn">
						<router-link to="/stopRestore">
							<div class="btn-back">返回</div>
						</router-link>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {translateSystem,translatePackages,getPackageFlow,timestampToTime} from '../api/dataUtil'

	export default {
		data() {
			return {
				successCard: '',
				successIccid: '',
				failCard: '',
				failIccid: '',
				operateType: '',

				id: ''
			};
		},
		mounted() {
			this.id = this.$route.query.id
			this.getBaseInfo()
		},
		methods: {
			// 获取到基本信息
			getBaseInfo() {
//				this.loading = true
				this.$axios({
					url: '/pauseActiveCard/changeDetails',
					method: 'post',
					params: {
						id: this.id
					}
				}).then(res => {
					let data = res.data.object
					console.log(data)
					this.successCard = data.successCard.replace(/,/g,'、')
					this.successIccid = data.successIccid.replace(/,/g,'、')
					this.failCard = data.failCard.replace(/,/g,'、')
					this.failIccid = data.failIccid.replace(/,/g,'、')

					this.operateType = data.type == 1 ? '复卡' : '停卡'
				})
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	borderColor = #e7ebf3
	buttonColor = #878787
	.stopRestore-wrap {
		padding-top: 50px;
		padding-left: 200px;
		.content {
			width: 100%;
			height: calc(100vh - 50px);
			padding: 20px;
			overflow-y: scroll;
			/* 停复卡详情 */
			.stopRestore-detail {
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
				.operate-type {
					font-size: 18px;
					color: #85888f;
					margin: 40px 0;
				}
				.detail-box {
					/* 卡号和iccid号 */
					.number-wrap {
						/* 成功或失败 */
						.success, .failure {
							h3 {
								font-size: 26px;
								color: #13232f;
								margin-bottom: 15px;
							}
							.box {
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
						}
						.failure {
							margin-top: 50px;
						}
					}
					/* 返回按钮 */
					.btn {
						display: flex;
						justify-content: flex-end;
						.btn-back {
							width: 100px;
							height: 44px;
							border-radius: 10px;
							background-color: mainBlue;
							font-size: 18px;
							color: #fff;
							text-align: center;
							line-height: 44px;
							cursor: pointer;
							margin-top: 50px;
						}
					}
				}
			}
		}
	}
</style>


