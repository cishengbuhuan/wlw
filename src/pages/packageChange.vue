<template>
	<div class="packageChange-wrap">
		<div class="content">
			<!-- 套餐变更 -->
			<div class="package-change">
				<div class="tips"><i class="line"></i>套餐变更</div>
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
					</div>
					<!-- 新老流量对比 -->
					<div class="flow">
						<!-- 原套餐流量 -->
						<div class="old-package">
							原套餐流量: <span>{{ oldPackageFlow }}</span>
						</div>
						<!-- 需变更套餐流量 -->
						<div class="new-package">
							<span>需变更套餐流量: </span>
							<el-select v-model="newPackageFlow"
							           clearable
							           @change="getPackageChangeData"
							           placeholder="请选择">
								<el-option
										v-for="item in newPackageOptions"
										:key="item.value"
										:label="item.newPackage"
										:value="item.value">
								</el-option>
							</el-select>
						</div>
					</div>
					<!-- 表格 -->
					<div class="table">
						<el-table
								:data="tableData"
								border
								v-loading="loading"
								style="width: 100%">
							<el-table-column prop="endDate" label="到期日期" align="center"></el-table-column>
							<el-table-column prop="remainTime" label="剩余时间" align="center"></el-table-column>
							<el-table-column prop="totalCard" label="共计卡数" align="center"></el-table-column>
							<el-table-column prop="oldPrice" label="原价格" align="center"></el-table-column>
							<el-table-column prop="newPrice" label="变更后价格" align="center"></el-table-column>
							<el-table-column prop="needPrice" label="需补差价" align="center"></el-table-column>
						</el-table>
						<!-- 总计 -->
						<div class="total-price" v-show="tableData.length">
							总计: {{ totalPrice }}元
						</div>
					</div>
					<!-- 按钮组 -->
					<div class="btn-group">
						<div class="btn-item btn-back" @click="btnSure(0)">返回</div>
						<div class="btn-item btn-sure" v-show="tableData.length" @click="btnSure(1)">确认</div>
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
				cardNoStr: '',
				iccidStr: '',
				netWork: '',
				system: '',
				packageType: '',
				oldPackageFlow: '',
				// 需变革套餐流量
				newPackageFlow: '',
				newPackageOptions: [],
				// table
				tableData: [],
				totalPrice: '',
				loading: '',

				deviceIds: '',
				userLimit: '',
				netWorkValue: '',
				netWorkType: '',
				businessCard: '',
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
					if(!this.tableData.length) {
						this.$router.push({path: '/cardOperate'})
						return
					}
					let loading = this.$loading({
						lock: true,
						text: '正在发送申请，请稍后...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios({
						url: '/ucenterDevice/changeFlow',
						method: 'post',
						params: {
							deviceIds: this.deviceIds,
							userLimit: this.userLimit,
							changeUserLimit: this.newPackageFlow,
							netWork: this.netWorkValue,
							netWorkType: this.netWorkType,
							businessCard: this.businessCard
						}
					}).then(res => {
						let data = res.data
						if(data.code == '100') {
							loading.close();
							this.$message.success(data.object)
							this.$router.push({path: '/cardOperate'})
						}else {
							loading.close();
							this.$message.error(data.object)
						}
					})
				}
			},
			// 获取到基本信息
			getBaseInfo() {
				this.$axios({
					url: '/ucenterDevice/getDeviceInfos',
					method: 'post',
					params: {
						deviceIds: this.deviceIds
					}
				}).then(res => {
//					console.log(res.data.object.cardInfos)
					let cardInfos = res.data.object.cardInfos
					let cardNumbers = cardInfos.cardNumbers
					let iccids = cardInfos.iccids
					this.cardNoStr = cardNumbers.replace(/,/g,'、')
					this.iccidStr = iccids.replace(/,/g,'、')
					// 运营商
					this.netWork = cardInfos.netWork == 1 ? '移动' : cardInfos.netWork == 2 ? '联通' : '电信'
					this.netWorkValue = cardInfos.netWork
					// 制式
					this.system = translateSystem(cardInfos.netWorkType)
					this.netWorkType = cardInfos.netWorkType
					// 原套餐流量
					this.oldPackageFlow = cardInfos.userLimit + 'M'
					this.userLimit = cardInfos.userLimit
					// 套餐类型
					this.packageType = translatePackages(cardInfos.packageType)
					// 是否车联卡
					this.businessCard = cardInfos.businessCard == '2' ? '2' : '1'
					// 需变革套餐流量
					let flow = res.data.object.flow
					this.newPackageOptions = []
					for(let i=0; i<flow.length; i++) {
						this.newPackageOptions.push({
							value: flow[i].flow,
							newPackage: getPackageFlow(flow[i].flow)
						})
					}
				})
			},
			// 获取到套餐变更的表格数据
			getPackageChangeData() {
				this.loading = true
				this.$axios({
					url: '/ucenterDevice/isChangeFlow',
					method: 'post',
					params: {
						deviceIds: this.deviceIds,
						userLimit: this.userLimit,
						changeUserLimit: this.newPackageFlow,
						netWork: this.netWorkValue,
						netWorkType: this.netWorkType,
						businessCard: this.businessCard
					}
				}).then(res => {
//					console.log(res.data.object)
					let data = res.data.object.cardList
					this.totalPrice = res.data.object.total
					this.tableData = []
					for(let i=0; i<data.length; i++) {
						this.tableData.push({
							endDate: timestampToTime(Number(data[i].endTime) * 1000),
							remainTime: data[i].residueMonth + '月',
							totalCard: data[i].totalCard,
							oldPrice: data[i].price + '元',
							newPrice: data[i].changePrice + '元',
							needPrice: data[i].diffPrice + '元'
						})
					}
					this.loading = false
				})
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	borderColor = #e7ebf3
	buttonColor = #878787
	.packageChange-wrap {
		padding-top: 50px;
		padding-left: 200px;
		.content {
			width: 100%;
			height: calc(100vh - 50px);
			padding: 20px;
			overflow-y: scroll;
			/* 套餐变更 */
			.package-change {
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
					/* 新老流量对比 */
					.flow {
						display: flex;
						font-size: 18px;
						color: #85888f;
						line-height: 40px;
						.old-package {
							margin-right: 50px;
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
	}
</style>


