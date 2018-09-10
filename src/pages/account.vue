<template>
	<div class="message-wrap">
		<div class="content">
			<!-- 个人资料 -->
			<div class="admin-data">
				<div class="head-account">
					<img :src="userInfo.headImg" class="head-img">
					<div class="account">
						<img src="../../static/images/icon-account.png" class="icon">
						<span>账号：{{ userInfo.account }}</span>
					</div>
				</div>
				<div class="my-assets">
					<span>我的资产</span>
					<div class="num">¥ {{ userInfo.assets }}</div>
				</div>
			</div>
			<!-- 记录 -->
			<div class="record">
				<div class="record-header">
					<span>交易记录</span>
					<div class="title" @click="toggleNav(0)" :class="[{ current: index == 0 }]">消费记录</div>
					<div class="title" @click="toggleNav(1)" :class="[{ current: index == 1 }]">充值记录</div>
				</div>
				<div class="record-content">
					<!-- 消费记录 -->
					<div class="consumption-record" v-if="index == 0">
						<el-table
								:data="consumptionData"
								style="width: 100%">
							<el-table-column prop="type" label="消费类型" align="center"></el-table-column>
							<el-table-column prop="amount" label="消费金额" align="center"></el-table-column>
							<el-table-column prop="time" label="消费时间" align="center"></el-table-column>
							<el-table-column prop="way" label="扣款方式" align="center"></el-table-column>
							<el-table-column prop="remark" label="备注" align="center"></el-table-column>
						</el-table>
						<el-pagination
								v-if="totalCount > pageSize"
								layout="prev, pager, next"
								:page-size='pageSize'
								:current-page="pageNo"
								:total="totalCount"
								@current-change="pageConsumption">
						</el-pagination>
					</div>
					<!-- 充值记录 -->
					<div class="recharge-record" v-if="index == 1">
						<el-table
								:data="rechargeData"
								style="width: 100%">
							<el-table-column prop="amount" label="充值金额" align="center"></el-table-column>
							<el-table-column prop="time" label="充值时间" align="center"></el-table-column>
							<el-table-column prop="way" label="充值方式" align="center"></el-table-column>
							<el-table-column prop="remark" label="备注" align="center"></el-table-column>
						</el-table>
						<el-pagination
								v-if="totalCount > pageSize"
								layout="prev, pager, next"
								:page-size='pageSize'
								:current-page="pageNo"
								:total="totalCount"
								@current-change="pageConsumption">
						</el-pagination>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {
					headImg: '../../static/images/default-head.png',
					account: '',
					assets: 0
				},
				index: 0,
				// 消费记录
				consumptionData: [],
				// 充值记录
				rechargeData: [],
				// 分页
				totalCount: 0,
				pageSize: 3,
				pageNo: 1
			};
		},
		mounted() {
			this.getConsumptionRecords()
			this.getRechargeRecords()
			this.getUserBasic()
			this.getUserAssets()
		},
		methods: {
			toggleNav(i) {
				this.index = i
			},
			// 获取我的账户的基本信息
			getUserBasic() {
				this.$axios({
					url: '/api/v2/base/getUser',
					method: 'post'
				}).then(res => {
					let data = res.data.data;
					this.userInfo.account = data.phone
				})
			},
			getUserAssets() {
				this.$axios({
					url: '/api/v2/base/getBasal',
					method: 'post'
				}).then(res => {
					let data = res.data.data;
					this.userInfo.assets = data.amount
				})
			},
			// 获取消费记录
			getConsumptionRecords() {
				this.$axios({
					url: '/api/v2/account/buyRecord',
					method: 'post',
					params: {
						type: 1,
						pageNo: this.pageNo,
						pageSize: this.pageSize
					}
				}).then(res => {
					let data = res.data.data;
					this.totalCount = res.data.totalCount
					for (let i = 0; i < data.length; i++) {
						this.consumptionData.push({
							type: data[i].remark,
							amount: data[i].amount,
							time: data[i].tradeTime,
							way: data[i].type,
							remark: data[i].remark
						})
					}
				})
			},
			// 分页(消费记录)
			pageConsumption(val) {
				this.pageNo = val;
				this.getConsumptionRecords()
			},
			// 获取充值记录
			getRechargeRecords() {
				this.$axios({
					url: '/api/v2/account/buyRecord',
					method: 'post',
					params: {
						type: 2,
						pageNo: this.pageNo,
						pageSize: this.pageSize
					}
				}).then(res => {
					let data = res.data.data;
					console.log(data)
					this.totalCount = res.data.totalCount
					for (let i = 0; i < data.length; i++) {
						this.rechargeData.push({
							amount: data[i].amount,
							time: data[i].tradeTime,
							way: data[i].type,
							remark: data[i].remark
						})
					}
				})
			},
			// 分页(消费记录)
			pageConsumption(val) {
				this.pageNo = val;
				this.getRechargeRecords()
			},
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	.message-wrap {
		padding-top: 50px;
		padding-left: 200px;
		.content {
			width: 100%;
			height: calc(100vh - 50px);
			padding: 20px;
			overflow-y: scroll;
			/* 个人资料 */
			.admin-data {
				width: 100%;
				height: 200px;
				border: 1px solid #ddd;
				border-radius: 5px;
				display: flex;
				padding-left: 100px;
				margin-bottom: 20px;
				.head-account {
					display: flex;
					line-height: 200px;
					margin-right: 100px;
					.head-img {
						width: 70px;
						height: 70px;
						margin-top: 65px;
						border-radius: 50%;
						margin-right: 20px;
					}
					.account {
						.icon {
							width: 16px;
							height: 22px;
							margin-top: -5px;
						}
						span {
							font-size: 18px;
						}
					}
				}
				.my-assets {
					padding-top: 60px;
					span {
						font-size: 20px;
					}
					.num {
						font-size: 30px;
						font-weight: 500;
						margin-top: 20px;
					}
				}
			}
			/* 交易记录 */
			.record {
				width: 100%;
				border: 1px solid #ddd;
				border-radius: 5px;
				.record-header {
					height: 106px;
					line-height: 106px;
					border-bottom: 1px solid #ddd;
					padding-left: 100px;
					display: flex;
					span {
						font-size: 24px;
						margin-right: 100px;
					}
					.title {
						font-size: 18px;
						color: #666;
						margin-right: 90px;
						cursor: pointer;
						position: relative;
					}
					.current {
						color: #2483c6;
					}
					.current:after {
						content: '';
						display: block;
						width: 80px;
						height: 4px;
						background-color: #2483c6;
						position: absolute;
						left: -3px;
						bottom: 25px;
					}
				}
				.record-content {
					padding: 0 100px;
					/*.el-table::before {
					  content: '';
					  position: absolute;
					  background-color: #fff;
					  z-index: 1;
					}*/
				}
			}
		}
	}
</style>

