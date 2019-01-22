<template>
	<div class="changeDetail-wrap wrap">
		<div class="content wrap-content">
			<!-- 标题 -->
			<div class="page-title">
				<div class="line"></div>
				<span>套餐变更信息<span class="small">变更详情</span></span>
			</div>
			<!-- 变更详情 -->
			<div class="detail-box">
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
				<!-- 基本信息 -->
				<div class="base">
					<!-- 运营商 -->
					<div class="base-item network">
						运营商: <span>{{ netWork }}</span>
					</div>
					<!-- 制式 -->
					<div class="base-item system">
						制式: <span>{{ system }}</span>
					</div>
					<!-- 套餐类型 -->
					<div class="base-item package-type">
						套餐类型: <span>{{ packageType }}</span>
					</div>
					<!-- 到期日期 -->
					<div class="base-item end-date">
						到期日期: <span>{{ endDate }}</span>
					</div>
				</div>
				<!-- 表格 -->
				<div class="table">
					<el-table
							:data="tableData"
							border
							style="width: 100%">
						<el-table-column label="套餐流量" align="center">
							<el-table-column prop="oldFlow" label="变更前" align="center"></el-table-column>
							<el-table-column prop="newFlow" label="变更后" align="center"></el-table-column>
						</el-table-column>
						<el-table-column label="套餐费用" align="center">
							<el-table-column prop="oldCost" label="变更前" align="center"></el-table-column>
							<el-table-column prop="newCost" label="变更后" align="center"></el-table-column>
						</el-table-column>
						<el-table-column label="总计费用" align="center">
							<el-table-column prop="oldTotalCost" label="变更前" align="center"></el-table-column>
							<el-table-column prop="newTotalCost" label="变更后" align="center"></el-table-column>
						</el-table-column>
						<el-table-column prop="needPay" label="需支付费用" align="center"></el-table-column>
					</el-table>
				</div>
				<!-- 返回按钮 -->
				<div class="btn">
					<router-link to="/packageChangeInfo">
						<div class="btn-back">返回</div>
					</router-link>
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
				cardNoStr: '',
				iccidStr: '',
				netWork: '',
				system: '',
				packageType: '',
				endDate: '',

				// table
				tableData: [
					{
						oldFlow: '10M',
						newFlow: '20M',
						oldCost: '10元',
						newCost: '20元',
						oldTotalCost: '100元',
						newTotalCost: '300元',
						needPay: '200元'
					}
				],

				changeCardsId: ''
			};
		},
		mounted() {
			this.changeCardsId = this.$route.query.changeCardsId
			this.getBaseInfo()
		},
		methods: {
			// 获取到基本信息
			getBaseInfo() {
//				this.loading = true
				this.$axios({
					url: '/changeCardInfo/changeCardDetails',
					method: 'post',
					params: {
						changeCardsId: this.changeCardsId
					}
				}).then(res => {
					let data = res.data.data
//					console.log(data)
					this.cardNoStr = data.cardNumbers.replace(/,/g,'、')
					this.iccidStr = data.iccids.replace(/,/g,'、')
					// 运营商
					this.netWork = data.netWork == '1' ? '移动' :data.netWork == '2' ? '联通' : '电信'
					// 制式
					this.system = translateSystem(data.netWorkType)
					// 套餐类型
					this.packageType = translatePackages(data.packageType)
					// 到期时间
					this.endDate = timestampToTime(Number(data.endTime) * 1000)

					this.tableData = []
					this.tableData.push({
						oldFlow: getPackageFlow(data.userLimitBefore),
						newFlow: getPackageFlow(data.userLimitAfter),
						oldCost: data.packageFeeBefore + '元',
						newCost: data.packageFeeAfter + '元',
						oldTotalCost: data.totalFeeBefore + '元',
						newTotalCost: data.totalFeeAfter + '元'
					})
				})
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	borderColor = #e7ebf3
	buttonColor = #878787
	.changeDetail-wrap {
		.content {
			/* 变更详情 */
			.detail-box {
				background-color: #fff;
				border-radius: 20px;
				padding: 25px 50px;
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
				/* 基本信息 */
				.base {
					display: flex;
					margin: 50px 0 30px;
					.base-item {
						font-size: 18px;
						color: #85888f;
						margin-right: 80px;
						span {
							color: #393d42;
						}
					}
				}
				/* table */
				.table {
					margin-top: 50px;
					.el-pagination {
						text-align: center;
						margin-top: 40px;
					}
					.total-price {
						font-size: 18px;
						margin-top: 20px;
						text-align: right;
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
</style>


