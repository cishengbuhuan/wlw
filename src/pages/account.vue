<template>
	<div class="account-wrap wrap">
		<div class="content wrap-content">
			<!-- 公司基本信息 -->
			<div class="base-info">
				<!-- 公司名称和账户余额 -->
				<div class="name-balance">
					<div class="name">
						<span>{{ baseInfo.name }}</span>
						<div class="hello">
							<div class="icon"><img src="../../static/images/index/icon-admin.png"></div>
							<span>{{ baseInfo.hello }}好！</span>
						</div>
					</div>
					<div class="balance">
						<div class="tip">
							<img src="../../static/images/index/icon-balance.png">账户余额
						</div>
						<span>{{ baseInfo.balance }}</span>
					</div>
					<!-- 充值按钮 -->
					<router-link to="/recharge">
						<div class="btn-recharge btn-main">充值</div>
					</router-link>
				</div>
			</div>

			<!-- 交易类型切换 -->
			<div class="tab-type">
				<div v-for="(item,index) in typeNav"
				     :class="[{current: tabIndex === item.tabIndex},'tab-item']"
				     @click="toggleType(item)"
				     :key="index">
					{{ item.type }}
				</div>
			</div>
			<!-- 账户详情表格 -->
			<div class="account-table">
				<!-- 工具栏 -->
				<div class="tools">
					<!-- 筛选框和搜索按钮 -->
					<div class="search">
						<!-- 交易时间 -->
						<div class="time">
							<span>交易时间: </span>
							<el-date-picker
									v-model="tools.startTime"
									@change="startTimeChange"
									class="timePicker"
									type="date"
									placeholder="开始日期">
							</el-date-picker>
							&nbsp; 至 &nbsp;
							<el-date-picker
									v-model="tools.endTime"
									@change="endTimeChange"
									class="timePicker"
									type="date"
									placeholder="结束日期">
							</el-date-picker>
						</div>
						<!-- 交易类型 -->
						<div class="type">
							<span>交易类型: </span>
							<el-select class="select"
							           placeholder="全部"
							           clearable
							           v-model="tools.payType">
								<el-option
										v-for="item in tools.payTypeOptions"
										:key="item.value"
										:label="item.payType"
										:value="item.value">
								</el-option>
							</el-select>
						</div>
						<!-- 搜索按钮 -->
						<div class="btn-search btn-main" @click="btnSearch">搜索</div>
					</div>
				</div>
				<!-- 表格 -->
				<div class="table-box">
					<el-table
							:data="tableData"
							border
							v-loading="loading"
							element-loading-text="正在加载数据，请稍候"
							style="width: 100%">
						<el-table-column label="交易时间" prop="time" align="center"></el-table-column>
						<el-table-column label="交易类型" prop="type" align="center"></el-table-column>
						<el-table-column label="交易金额" prop="amount" align="center"></el-table-column>
						<el-table-column label="余额变动" prop="balanceChange" align="center"></el-table-column>
					</el-table>
					<el-pagination
							v-if="totalCount > pageSize"
							layout="total, sizes, prev, pager, next, jumper"
							:page-size="pageSize"
							:current-page="pageNo"
							:total="totalCount"
							:page-sizes="[20, 50, 100]"
							@size-change="changeSize"
							@current-change="changePageNo">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {allDateTime, translateRechargeType,format} from '../api/dataUtil'

	export default {
		data() {
			return {
				// 基本信息
				baseInfo: {
					name: '',
					balance: '',
					hello: ''
				},
				// 交易类型切换
				tabIndex: 0,
				typeNav: [
					{
						type: '总览',
						tabIndex: 0
					},
					{
						type: '消费',
						tabIndex: 1
					},
					{
						type: '充值',
						tabIndex: 2
					}
				],
				// 表格工具栏
				tools: {
					// 交易时间
					startTime: '',
					endTime: '',
					// 交易类型
					payType: '',
					payTypeOptions: [
//						{
//							value: '2',
//							payType: '支付宝'
//						},
//						{
//							value: '3',
//							payType: '银行转帐'
//						},
//						{
//							value: '4',
//							payType: '套餐支出'
//						},
//						{
//							value: '5',
//							payType: '超流支出'
//						},
//						{
//							value: '6',
//							payType: '短信发送'
//						},
					]
				},
				// 表格数据
				tableData: [],
				// 表格分页
				totalCount: 0,
				pageSize: 20,
				pageNo: 1,
				// 加载
				loading: '',
			};
		},
		mounted() {
			this.getCurrentTime()
			this.getBasicInfo()
			this.getPayList()
			this.getPay()
		},
		methods: {
			// 获取当前时间
			getCurrentTime() {
				let now = new Date(),
					hour = now.getHours()
				if (hour < 6) {
					this.baseInfo.hello = '凌晨'
				} else if (hour < 9) {
					this.baseInfo.hello = '早上'
				} else if (hour < 12) {
					this.baseInfo.hello = '上午'
				} else if (hour < 14) {
					this.baseInfo.hello = '中午'
				} else if (hour < 17) {
					this.baseInfo.hello = '下午'
				} else if (hour < 19) {
					this.baseInfo.hello = '傍晚'
				} else if (hour < 22) {
					this.baseInfo.hello = '晚上'
				} else {
					this.baseInfo.hello = '夜里'
				}
			},
			// 获取到基础数据
			getBasicInfo() {
				this.$axios({
					url: '/api/v2/base/getBasal',
					method: 'post'
				}).then(res => {
					let data = res.data.data;
//					console.log(data)
					this.baseInfo.name = data.companyName
					this.baseInfo.balance = Number(data.amount).toFixed(2)
				})
			},
			// 获取到交易类型
			getPay() {
				this.$axios({
					url: '/smsSendInfo/getPayType',
					method: 'post',
					params: {
						// 类型
						type: this.tabIndex
					}
				}).then(res => {
					let data = res.data.object

					this.tools.payTypeOptions = []
					for (let i = 0; i < data.length; i++) {
						this.tools.payTypeOptions.push({
							payType: this.getPayType(data[i].payType),
							value: data[i].payType
						})
					}
				})
			},
			// 获取到表格数据
			getPayList() {
				this.loading = true
				this.$axios({
					url: '/api/v2/account/buyRecord',
					method: 'post',
					params: {
						// 分页
						pageSize: this.pageSize,
						pageNo: this.pageNo,
						// 总览、消费、充值
						type: this.tabIndex,
						// 交易类型
						payType: this.tools.payType,
						// 交易时间
						startTime: this.tools.startTime,
						endTime: this.tools.endTime
					}
				}).then(res => {
					let data = res.data.data

					if(res.data.code == 1) {
						this.loading = false
						this.tableData = []
						for (let i = 0; i < data.length; i++) {
							this.tableData.push({
								time: allDateTime(data[i].createTime*1000),
								type: this.getPayType(data[i].payType),
								amount: data[i].amount,
								balanceChange: Number(data[i].moneyChange).toFixed(2)
							})
						}
					}
				})
			},
			// 切换类型
			toggleType(item) {
				this.tabIndex = item.tabIndex
				this.getPay()
				this.getPayList()
			},
			// 选择日期
			startTimeChange() {
				if (!this.tools.startTime) {
					this.tools.startTime = ''
					this.pageNo = 1
					return
				}
				this.tools.startTime = format(new Date(this.tools.startTime).getTime(), "Y-m-d")
				this.pageNo = 1
			},
			endTimeChange() {
				if (!this.tools.endTime) {
					this.tools.endTime = ''
					this.pageNo = 1
					return
				}
				this.tools.endTime = format(new Date(this.tools.endTime).getTime(), "Y-m-d")
				this.pageNo = 1
			},
			// 按照条件搜索
			btnSearch() {
				if(!this.tools.startTime && this.tools.endTime) {
					this.$message.info('交易时间的开始和结束时间都要选择')
				}else if(this.tools.startTime && !this.tools.endTime) {
					this.$message.info('交易时间的开始和结束时间都要选择')
				}else if(this.tools.startTime > this.tools.endTime) {
					this.$message.info('开始时间不能大于结束时间')
				}else {
					this.getPayList()
				}
			},
			// 获取到交易类型
			getPayType(i) {
				if(i==2) {
					return '支付宝'
				}else if(i==3) {
					return '银行转账'
				}else if(i==4) {
					return '套餐支出'
				}else if(i==5) {
					return '超流支出'
				}else if(i==6) {
					return '短信发送'
				}
			},
			// 获取到余额变动
			getBalanceChange(type,compAmount,amount) {
				if(type == 2 || type == 3) {
					return Number(compAmount + amount).toFixed(2)
				}else if(type == 4 || type == 5 || type == 6) {
					return Number(compAmount - amount).toFixed(2)
				}
			}
		},
		watch:{
			'tools.endTime'(val){console.log(val)}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	.account-wrap {
		.content {
			.icon {
				width: 28px;
				height: 28px;
				img {
					width: 100%;
					height: 100%;
				}
			}
			/* 公司基本信息 */
			.base-info {
				width: 100%;
				height: 200px;
				border-radius: 10px;
				display: flex;
				background-color: #fff;
				padding: 30px 40px 0;
				/* 公司名称和总卡数 */
				.name-balance {
					display: flex;
					/*justify-content: space-between;*/
					/* 公司名称 */
					.name {
						span {
							font-size: 30px;
						}
						.hello {
							display: flex;
							margin-top: 30px;
							.icon {
								margin-right: 10px;
							}
							span {
								font-size: 24px;
							}
						}
					}
					/* 账户余额 */
					.balance {
						text-align: center;
						margin: 40px 40px -5px 200px;
						.tip {
							font-size: 24px;
							img {
								width: 28px;
								height: 28px;
							}
						}
						span {
							color: #ed7f1d;
							font-size: 36px;
						}
					}
					.btn-recharge {
						margin-top: 60px;
					}
				}
			}
			/* 交易类型切换 */
			.tab-type {
				display: flex;
				margin-top: 20px;
				.tab-item {
					width: 166px;
					height: 78px;
					font-size: 24px;
					color: #545454;
					text-align: center;
					line-height: 58px;
					cursor: pointer;
				}
				.current {
					background-color: #fff;
					border-top-left-radius: 20px;
					border-top-right-radius: 20px;
					color: mainBlue;
					position: relative;
				}
				.current:before {
					content: '';
					display: block;
					width: 32px;
					height: 4px;
					background-color: mainBlue;
					position: absolute;
					bottom: 20px;
					left: 67px;
				}
			}
			/* 账户详情表格 */
			.account-table {
				background-color: #fff;
				border-radius: 20px;
				margin-top: -20px;
				padding: 25px 50px;
				/* 工具栏 */
				.tools {
					/* 筛选框和搜索按钮 */
					.search {
						display: flex;
						flex-wrap: wrap;
						/* 交易时间、交易类型 */
						.time, .type {
							display: flex;
							line-height: 40px;
							margin-right: 40px;
							margin-bottom: 20px;
							span {
								margin-right: 10px;
								font-size: 18px;
								color: #545454;
							}
							.select {
								width: 130px;
							}
							.timePicker {
								width: 150px;
							}
						}
						.btn-search {
							margin-bottom: 20px;
						}
					}
				}
				/* 表格 */
				.table-box {
					margin-top: 20px;
					.el-pagination {
						text-align: center;
						margin-top: 40px;
					}
				}
			}
		}
	}
</style>

