<template>
	<div class="stopRestore-wrap wrap">
		<div class="content wrap-content">
			<!-- 标题 -->
			<div class="page-title">
				<div class="line"></div>
				<span>流量卡停复管理<span class="small">变更详情</span></span>
			</div>
			<!-- 停复卡详情 -->
			<div class="stopRestore-detail">
				<div class="operate-type">操作类型: {{ operateType }}</div>
				<div class="detail-box">
					<!-- 卡号和iccid号 -->
					<div class="number-wrap">
						<!-- 成功 -->
						<div class="success number-item">
							<h3>变更成功</h3>
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
							<h3>变更失败</h3>
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
						<router-link to="/stopRestoreManage">
							<div class="btn-back btn-gray">返回</div>
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
			if(this.id==1) {
				this.operateType = '复卡'
			}else if(this.id == 0) {
				this.operateType = '停卡'
			}
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
		.content {
			/* 停复卡详情 */
			.stopRestore-detail {
				background-color: #fff;
				border-radius: 20px;
				padding: 30px;
				margin-top: 20px;
				.operate-type {
					font-size: 24px;
					color: #85888f;
					margin-bottom: 30px;
				}
				.detail-box {
					/* 卡号和iccid号 */
					.number-wrap {
						/* 成功或失败 */
						.success, .failure {
							h3 {
								font-size: 18px;
								color: #1d9eed;
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
							margin-top: 50px;
						}
					}
				}
			}
		}
	}
</style>


