<template>
	<div class="flowCard-wrap wrap">
		<div class="content wrap-content">
			<!-- 标题 -->
			<div class="page-title">
				<div class="line"></div>
				<span>流量池信息</span>
			</div>
			<!-- 运营商切换 -->
			<div class="tab-netWork">
				<div v-for="(item,index) in netWorkNav"
				     :class="[{current: tabIndex === item.tabIndex},'tab-item']"
				     @click="toggleNetWorkNav(item)"
				     :key="index">
					{{ item.netWork }}
				</div>
			</div>
			<!-- 流量池使用情况柱状图 -->
			<div class="usage-chart">
				<!-- 工具栏 -->
				<div class="tools">
					<!-- 套餐流量 -->
					<div class="package-flow">
						<span>套餐流量: </span>
						<el-select class="select"
						           placeholder="全部"
						           @change="packageFlowChange"
						           v-model="tools.packageFlow">
							<el-option
									v-for="item in tools.packageFlowOptions"
									:key="item.value"
									:label="item.packageFlow"
									:value="item.value">
							</el-option>
						</el-select>
					</div>
					<!-- 套餐类型 -->
					<div class="package-type">
						<span>套餐类型: </span>
						<el-select class="select"
						           placeholder="全部"
						           @change="packageTypeChange"
						           v-model="tools.packageTypeValue">
							<el-option
									v-for="item in tools.packageTypeOptions"
									:key="item.value"
									:label="item.packageType"
									:value="item.value">
							</el-option>
						</el-select>
					</div>
					<!-- 搜索按钮 -->
					<div class="btn-search btn-main" @click="btnSearch">搜索</div>
				</div>
				<!-- chart -->
				<div class="chart"
				     v-loading="tools.loading"
				     element-loading-text="正在加载数据，请稍候">
					<!-- 标题 -->
					<div class="title">
						<span>流量池使用概况</span>
						<!-- legend -->
						<div class="legend">
							<!-- 已使用 -->
							<div class="usage">
								<div class="icon"></div>
								<span>已使用</span>
							</div>
							<!-- 未使用 -->
							<div class="unused">
								<div class="icon"></div>
								<span>未使用</span>
							</div>
							<!-- 已超出 -->
							<div class="exceeded">
								<div class="icon"></div>
								<span>已超出</span>
							</div>
						</div>
					</div>
					<!-- 组件 -->
					<wl-Bar :options="flowData" :height="120"></wl-Bar>
					<!-- tip -->
					<div class="tip">
						<span :class="{ over: flow.total < flow.usage }">{{ flow.usage }}MB</span>/{{ flow.total }}MB
					</div>
				</div>
			</div>


			<!-- 流量池信息 -->
			<div class="flow-info"
			     v-loading="tools.loading"
			     element-loading-text="正在加载数据，请稍候">
				<!-- title -->
				<div class="title">
					<span>流量池信息</span>
					<div class="card-info btn-main" @click="jumpToCardInfo">卡片信息</div>
				</div>
				<!-- info-box -->
				<div class="info-box">
					<div class="info-item">
						<div class="total">
							<div class="num">
								<span>{{ flowPoolInfo.flow.total }}</span>MB
							</div>
							<div class="tip">流量池总量</div>
						</div>
						<div class="detail">
							<div class="detail-item usage">
								<div class="num">
									<span>{{ flowPoolInfo.flow.usage }}</span>MB
								</div>
								<div class="tip">已使用</div>
							</div>
							<div class="detail-item unused">
								<div class="num">
									<span>{{ flowPoolInfo.flow.unused }}</span>MB
								</div>
								<div class="tip">未使用</div>
							</div>
							<div class="detail-item exceeded">
								<div class="num">
									<span>{{ flowPoolInfo.flow.exceeded }}</span>MB
								</div>
								<div class="tip">已超出</div>
							</div>
						</div>
					</div>
					<div class="info-item card">
						<div class="total">
							<div class="num">
								<span>{{ flowPoolInfo.card.total }}</span>张
							</div>
							<div class="tip">总卡数</div>
						</div>
						<div class="detail">
							<div class="detail-item active">
								<div class="num">
									<span>{{ flowPoolInfo.card.active }}</span>张
								</div>
								<div class="tip">已激活</div>
							</div>
							<div class="detail-item overview">
								<div class="num">
									<span>{{ flowPoolInfo.card.overview }}</span>张
								</div>
								<div class="tip">超套卡数</div>
							</div>
							<div class="detail-item new-add">
								<div class="num">
									<span>{{ flowPoolInfo.card.newAdd }}</span>张
								</div>
								<div class="tip">最近新增卡数</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
//	let echarts = require('echarts/lib/echarts')
	import wlBar from '../components/chart/bar.vue'
	import {translatePackages,getNetWork} from '../api/dataUtil'
	export default {
		components: {
			wlBar
		},
		data() {
			return {
				// 运营商切换
				tabIndex: 1,
				netWorkNav: [],
				// 工具栏
				tools: {
					loading: '',
					// 套餐流量
					packageFlow: '',
					poolId: '',
					defaultPoolId: '',
					packageFlowOptions: [],
					// 套餐类型
					packageTypeValue: '',
					packageType: '',
					defaultPackageType: '',
					packageTypeOptions: []
				},
				// 流量池柱状图数据
				flowData: {
					color: ['#4cb2ff', '#e5e5e5', '#f44242'],
					tooltip : {
						trigger: 'axis',
						axisPointer : {
							type : 'line'
						},
						formatter: function (params) {
							return `套餐: ${params[0].axisValue}M</br>
								<span style='display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; background-color: #4cb2ff;'></span>${params[0].seriesName}: ${params[0].value}M<br/>
								<span style='display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; background-color: #e5e5e5;'></span>${params[1].seriesName}: ${params[1].value}M<br/>
								<span style='display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; background-color: #f44242;'></span>${params[2].seriesName}: ${params[2].value}M`
						}
					},
//					legend: {
//						data: ['已使用', '未使用', '已超出']
//					},
					grid: {
						left: '-2%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis:  {
						show: false,
						type: 'value'
					},
					yAxis: {
						show: false,
						type: 'category',
						data: []
					},
					barMaxWidth: '20',
					series: [
						{
							name: '已使用',
							type: 'bar',
							stack: '总量',
							data: [0]
						},
						{
							name: '未使用',
							type: 'bar',
							stack: '总量',
							data: [0]
						},
						{
							name: '已超出',
							type: 'bar',
							stack: '总量',
							data: [0]
						}
					]
				},
				// tip
				flow: {
					total: 0,
					usage: 0
				},
				// 加载
				loading: '',
				// 流量池信息
				flowPoolInfo: {
					// 流量池
					flow: {
						total: 0,
						usage: 0,
						unused: 0,
						exceeded: 0
					},
					// 卡片
					card: {
						total: 0,
						active: 0,
						overview: 0,
						newAdd: 0
					}
				}
			};
		},
		mounted() {
			this.getNetWork()
			this.getPackageFlow()
		},
		created() {

		},
		methods: {
			// 获取所有的运营商
			getNetWork() {
				this.$axios({
					url: '/api/getNetWork',
					method: 'post'
				}).then(res => {
					// console.log(res.data.data)
					let data = res.data.object
//					console.log(data)
					this.netWorkNav = []
					for(let i=0; i<data.length; i++) {
						this.netWorkNav.push({
							netWork: getNetWork(data[i].netWork),
							tabIndex: data[i].netWork
						})
					}
				})
			},
			// 切换运营商
			toggleNetWorkNav(item) {
				this.tabIndex = item.tabIndex
				this.tools.poolId = ''
				this.getPackageFlow()
			},
			// 套餐流量的下拉框变化的时候
			packageFlowChange(val) {
				this.tools.poolId = val;
				this.getPackageType()
			},
			// 套餐类型的下拉框变化的时候
			packageTypeChange(val) {
				this.tools.packageType = val;
			},
			// 获取到套餐
			getPackageFlow() {
				let that = this
				that.$axios({
					url: '/api/getPoolAndPack',
					method: 'post',
					params: {
						netWork: this.tabIndex
					}
				}).then(res => {
					// console.log(res.data.data)
					let data = res.data.data
					// 如果没有套餐
					if(!data.length) {
						// 清空筛选框
						that.tools.packageFlowOptions = []
						that.tools.packageFlow = ''
						that.tools.packageTypeOptions = []
						that.tools.packageTypeValue = ''
						return
					}
					that.tools.packageFlowOptions = []
					that.tools.packageFlow = data[0].name
					that.tools.defaultPoolId = data[0].poolId
					for (let i = 0; i < data.length; i++) {
						that.tools.packageFlowOptions.push({
							value: data[i].poolId,
							packageFlow: data[i].name
						})
					}
					that.getPackageType()
				})
			},
			// 获取到套餐种类
			getPackageType() {
				let poolId = this.tools.poolId ? this.tools.poolId : this.tools.defaultPoolId
				let that = this
				that.$axios({
					url: '/api/getPoolAndPack',
					method: 'post',
					params: {
						netWork: this.tabIndex,
						poolId: poolId
					}
				}).then(res => {
//					console.log(res.data.data)
					let data = res.data.data
//					debugger
					if (data.length === 0) {
						that.tools.packageTypeOptions = []
						that.tools.packageTypeValue = ''
						that.tools.packageType = ''
						that.tools.defaultPackageType = ''

						return
					}
					that.tools.packageTypeOptions = []
					that.tools.packageTypeValue = ''
					that.tools.packageType = ''
					that.tools.defaultPackageType = ''
					that.tools.packageTypeValue = translatePackages(data[0].packageType)
					that.tools.defaultPackageType = data[0].packageType
					for (let i = 0; i < data.length; i++) {
						that.tools.packageTypeOptions.push({
							value: data[i].packageType,
							packageType: translatePackages(data[i].packageType)
						})
					}
					this.getFlowPoolUsage()
				})
			},
			// 搜索按钮
			btnSearch() {
				this.getFlowPoolUsage()
			},
			// 获取到流量池使用概况
			getFlowPoolUsage() {
				let that = this
				that.tools.loading = true
				let poolId = this.tools.poolId ? this.tools.poolId : this.tools.defaultPoolId;
				let packageType = this.tools.packageType ? this.tools.packageType : this.tools.defaultPackageType;
				that.$axios({
					url: '/api/v2/pool/poolUsage',
					method: 'post',
					params: {
						poolId: poolId,
						packageType: packageType
					}
				}).then(res => {
					that.tools.loading = false
					let data = res.data.data.cardInfo
//					console.log(data)
					// total,poolUse

					// 流量池
					that.flowData.yAxis.data = []
					// 已使用
					that.flowData.series[0].data = []
					// 未使用
					that.flowData.series[1].data = []
					// 已超出
					that.flowData.series[2].data = []


					// 流量池
					that.flowData.yAxis.data.push(data.dataSize)
					// 已使用
					that.flowData.series[0].data.push(data.poolUse)
					// 未使用
					that.flowData.series[1].data.push(that.getUnused(data.total,data.poolUse))
					// 已超出
					that.flowData.series[2].data.push(that.getExceeded(data.total,data.poolUse))

					// 总量和已使用量的提示
					that.flow.total = data.total
					that.flow.usage = data.poolUse

					// 流量池信息
					// ->流量池
					that.flowPoolInfo.flow.total = data.total
					that.flowPoolInfo.flow.usage = data.poolUse
					that.flowPoolInfo.flow.unused = that.getUnused(data.total,data.poolUse)
					that.flowPoolInfo.flow.exceeded = that.getExceeded(data.total,data.poolUse)
					// ->卡片
					that.flowPoolInfo.card.total = data.deviceNo
					that.flowPoolInfo.card.active = data.activeCardCount
					that.flowPoolInfo.card.overview = data.overPackageCount
					that.flowPoolInfo.card.newAdd = data.newAddCount
				})
			},
			// 处理未使用
			getUnused(total, used) {
				if (total > used) {
					return Number(total - used).toFixed(2)
				} else {
					return 0
				}
			},
			// 处理已超出
			getExceeded(total, used) {
				if (total > used) {
					return 0
				} else {
					return Number(used - total).toFixed(2)
				}
			},
			// 跳转到卡片信息页面
			jumpToCardInfo() {
				let poolId = this.tools.poolId ? this.tools.poolId : this.tools.defaultPoolId;
				this.$router.push({
					path: '/flowPoolInfoCard',
					query: {
						poolId: poolId
					}
				})
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #1d9eed;
	mainButton = #4cb2ff;
	.flowCard-wrap {
		.content {
			/* 运营商切换 */
			.tab-netWork {
				display: flex;
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
			/* 流量池使用情况柱状图 */
			.usage-chart {
				background-color: #fff;
				height: 305px;
				border-radius: 20px;
				padding: 30px;
				margin-top: -20px;
				/* 工具栏 */
				.tools {
					display: flex;
					flex-wrap: wrap;
					margin-bottom: 40px;
					padding-left: 25px;
					/* 套餐流量、套餐类型 */
					.package-flow, .package-type {
						display: flex;
						line-height: 40px;
						margin-right: 60px;
						span {
							margin-right: 10px;
							font-size: 18px;
							color: #545454;
						}
						.select {
							width: 130px;
						}
					}
				}
				/* chart */
				.chart {
					/* 标题 */
					.title {
						display: flex;
						margin-bottom: -30px;
						>span {
							font-size: 24px;
							margin-left: 25px;
						}
						/* legend */
						.legend {
							display: flex;
							margin-left: 180px;
							.usage, .unused, .exceeded {
								display: flex;
								.icon {
									width: 28px;
									height: 10px;
									border-radius: 5px;
									background-color: #4cb2ff;
									margin-top: 8px;
								}
								span {
									font-size: 18px;
									margin-left: 10px;
								}
							}
							/* 未使用 */
							.unused {
								margin: 0 40px;
								.icon {
									background-color: #e5e5e5;
								}
							}
							/* 已超出 */
							.exceeded {
								.icon {
									background-color: #f44242;
								}
							}
						}
					}
					/* 组件 */
					/* tip */
					.tip {
						font-size: 18px;
						padding-left: 25px;
						margin-top: -10px;
						span {
							color: #4cb2ff;
						}
						.over {
							color: #f44242;
						}
					}
				}
			}
			/* 流量池信息 */
			.flow-info {
				background-color: #fff;
				height: 320px;
				border-radius: 20px;
				padding: 30px;
				margin-top: 20px;
				/* title */
				.title {
					display: flex;
					justify-content: space-between;
					margin-bottom: 10px;
					span {
						font-size: 24px;
						color: #585858;
					}
				}
				/* info-box */
				.info-box {
					display: flex;
					.info-item {
						flex: 1;
						text-align: center;
						.total {
							color: #585858;
							.num {
								font-size: 18px;
								span {
									font-size: 40px;
									margin-right: 5px;
									font-weight: 500;
								}
							}
							.tip {
								font-size: 22px;
							}
						}
						.detail {
							display: flex;
							margin-top: 40px;
							.detail-item {
								flex: 1;
								text-align: center;
								.num {
									font-size: 18px;
									span {
										font-size: 30px;
										margin-right: 5px;
										font-weight: 500;
									}
								}
								.tip {
									font-size: 22px;
									color: #585858;
								}
							}
							/* 已使用 */
							.usage {
								.num {
									color: #4cb2ff;
								}
							}
							/* 未使用 */
							.unused {
								.num {
									color: #c7c7c7;
								}
							}
							/* 已超出 */
							.exceeded {
								.num {
									color: #f44242;
								}
							}
							/* 已激活 */
							.active {
								.num {
									color: #4cb2ff;
								}
							}
							/* 超套卡数 */
							.overview {
								.num {
									color: #f44242;
								}
							}
							/* 最近新增卡数 */
							.new-add {
								.num {
									color: #6cdf07;
								}
							}
						}
					}
					.card {
						border-left: 1px solid #ddd;
					}
				}
			}
		}
	}
</style>