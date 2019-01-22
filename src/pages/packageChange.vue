<template>
	<div class="packageChange-wrap wrap">
		<div class="content wrap-content">
			<!-- 标题 -->
			<div class="page-title">
				<div class="line"></div>
				<span>套餐信息<span class="small">套餐变更</span></span>
			</div>
			<!-- 套餐变更 -->
			<div class="package-change">
				<!-- 工具栏 -->
				<div class="tools">
					<div class="radio">
						<span>套餐卡号</span>
						<div class="radio-group">
							<el-radio v-model="tools.radio" label="1">所有卡号</el-radio>
							<el-radio v-model="tools.radio" label="2">选取卡号</el-radio>
						</div>
					</div>
					<!-- 卡号或iccid -->
					<div class="card-iccid" v-show="tools.radio == 2">
						<el-select class="select"
						           placeholder="卡号/ICCID"
						           @change="checkCardOrIccid"
						           clearable
						           v-model="tools.cardNum">
							<el-option
									v-for="item in tools.cardOptions"
									:key="item.value"
									:label="item.card"
									:value="item.value">
							</el-option>
						</el-select>
						<el-input class="input"
						          v-show="tools.inputShow"
						          :placeholder="tools.startPlaceHolder"
						          v-model="tools.startNum">
						</el-input>
						<span v-show="tools.inputShow">-</span>
						<el-input class="input"
						          v-show="tools.inputShow"
						          :placeholder="tools.endPlaceHolder"
						          v-model="tools.endNum">
						</el-input>
						<!-- 搜索按钮 -->
						<div class="btn-search btn-main" @click="getBaseInfo">搜索</div>
					</div>
				</div>
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
					<div class="btn-item btn-back btn-gray" @click="btnSure(0)">返回</div>
					<div class="btn-item btn-sure btn-main" v-show="tableData.length" @click="btnSure(1)">确认</div>
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
				// 工具栏
				tools: {
					// 单选
					radio: '1',
					// 卡号或者iccid
					cardNum: '',
					cardOptions: [
						{
							value: '1',
							card: '卡号'
						},
						{
							value: '2',
							card: 'ICCID'
						}
					],
					inputShow: false,
					startNum: '',
					endNum: '',
					startPlaceHolder: '',
					endPlaceHolder: ''
				},
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
				// 传递过来的批次日期
				serverTime: ''
			};
		},
		created() {
			this.serverTime = this.$route.query.batchTime
			this.getBaseInfo()
		},
		methods: {
			// 所有卡号
			checkAllCard() {
				this.tools.startNum = ''
				this.tools.endNum = ''
				this.getBaseInfo()
			},
			// 选择卡号或者iccid
			checkCardOrIccid(i) {
				if(i == '1') {
					this.tools.startPlaceHolder = '请输入开始的卡号'
					this.tools.endPlaceHolder = '请输入结束的卡号'
					this.tools.inputShow = true
				}else if(i == '2') {
					this.tools.startPlaceHolder = '请输入开始的ICCID'
					this.tools.endPlaceHolder = '请输入结束的ICCID'
					this.tools.inputShow = true
				}else {
					this.tools.startPlaceHolder = ''
					this.tools.endPlaceHolder = ''
					this.tools.inputShow = false
				}
			},
			// 确认按钮
			btnSure(i) {
				if(i===0) {
					this.$router.push({path: '/packageInfo'})
				}else {
					if(!this.tableData.length) {
						this.$router.push({path: '/packageInfo'})
						return
					}
					let loading = this.$loading({
						lock: true,
						text: '正在发送申请，请稍侯...',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$axios({
						url: '/ucenterDevice/changeFlow',
						method: 'post',
						params: {
							serveTime: this.serverTime,
							// 卡号段
							cardNo: this.tools.startNum ? `${this.tools.startNum}-${this.tools.endNum}` : '',
							isAll: 1,
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
							this.$router.push({path: '/packageInfo'})
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
						serveTime: this.serverTime,
						// 1为所有卡号，2为选取卡号
//						isAll: this.tools.radio,
						// 卡号段
						cardNo: this.tools.startNum ? `${this.tools.startNum}-${this.tools.endNum}` : '',
					}
				}).then(res => {

					this.deviceIds = ''
					this.cardNoStr = ''
					this.iccidStr = ''
					// 运营商
					this.netWork = ''
					this.netWorkValue = ''
					// 制式
					this.system = ''
					this.netWorkType = ''
					// 原套餐流量
					this.oldPackageFlow = ''
					this.userLimit = ''
					// 套餐类型
					this.packageType = ''
					// 是否车联卡
					this.businessCard = ''
					// 需变革套餐流量
					this.newPackageFlow = ''
					this.newPackageOptions = []
					// 清空套餐变更的表格数据
					this.tableData = []



					let cardInfos = res.data.object.cardInfos
					let cardNumbers = cardInfos.cardNumbers
					let iccids = cardInfos.iccids
					this.deviceIds = cardInfos.deviceIds
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
						serveTime: this.serverTime,
						// 卡号段
						cardNo: this.tools.startNum ? `${this.tools.startNum}-${this.tools.endNum}` : '',
						isAll: 1,
//						deviceIds: this.deviceIds,
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
		},
		watch: {
			'tools.radio'(val) {
				if(val == 1) {
					this.checkAllCard()
				}
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	borderColor = #e7ebf3
	buttonColor = #878787
	.packageChange-wrap {
		.content {
			/* 套餐变更 */
			.package-change {
				background-color: #fff;
				border-radius: 20px;
				margin-top: 20px;
				padding: 25px 50px;
				/* 工具栏 */
				.tools {
					margin-bottom: 35px;
					.radio {
						display: flex;
						span {
							font-size: 18px;
							color: #585858;
							margin-right: 60px;
						}
						.radio-group {
							.el-radio__label {
								display: inline-block;
							}
						}
					}
					/* 卡号或iccid */
					.card-iccid {
						display: flex;
						margin-top: 15px;
						.select {
							width: 130px;
							margin-right: 10px;
						}
						.input {
							width: 300px;
						}
						span {
							line-height: 40px;
							margin: 0 10px;
						}
						.btn-search {
							margin-left: 40px;
						}
					}
				}
				/* 卡号和iccid号 */
				.number-wrap {
					display: flex;
					.item {
						display: flex;
						span {
							width: 60px;
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
					.iccid-number {
						margin-left: 60px;
						span {
							margin-right: 30px;
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
					.btn-sure {
						margin-left: 110px;
					}
				}
			}
		}
	}
</style>
<style lang="stylus">
	.el-radio {
		line-height: 25px;
		.el-radio__label {
			font-size: 18px;
			color: #585858;
		}
	}
</style>


