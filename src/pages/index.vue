<template>
	<div class="index-wrap wrap">
		<div class="content wrap-content">
			<!-- 公司基本信息 -->
			<div class="base-info">
				<!-- 公司名称和总卡数 -->
				<div class="info-item name-card">
					<div class="name">
						<span>{{ baseInfo.name }}</span>
						<div class="hello">
							<div class="icon"><img src="../../static/images/index/icon-admin.png"></div>
							<span>{{ baseInfo.hello }}好！</span>
						</div>
					</div>
					<div class="card">
						<div class="icon"><img src="../../static/images/index/icon-card.png"></div>
						<div class="tip">总卡数</div>
						<span>{{ baseInfo.totalCard }}</span>
					</div>
				</div>
				<!-- 账户余额 -->
				<div class="info-item balance" v-if="baseInfo.customerShow">
					<div class="icon"><img src="../../static/images/index/icon-balance.png"></div>
					<div class="tip">账户余额</div>
					<span>{{ baseInfo.balance }}</span>
				</div>
				<!-- 客户数量 -->
				<div class="info-item customer" v-if="baseInfo.customerShow">
					<div class="icon"><img src="../../static/images/index/icon-customer.png"></div>
					<div class="tip">客户数量</div>
					<span>{{ baseInfo.customer }}</span>
				</div>
			</div>
			<!-- 图表区域 -->
			<div class="chart">
				<!-- 激活数 -->
				<div class="chart-item active">
					<!-- tip -->
					<div class="tip">
						<div class="header">
							<div class="icon"><img src="../../static/images/index/icon-active.png"></div>
							<span>激活数</span>
							<el-tooltip class="tooltip" content="显示卡片激活数" placement="right">
								<i class="el-icon-question"></i>
							</el-tooltip>
						</div>
						<el-select v-model="active.time"
						           @change="getActiveChart">
							<el-option
									v-for="item in active.timeOptions"
									:key="item.value"
									:label="item.time"
									:value="item.value">
							</el-option>
						</el-select>
					</div>
					<!-- chart -->
					<div class="chart-area"
					     element-loading-text="正在加载数据，请稍候"
					     v-loading="active.loading">
						<wl-line :options="active.options" :height="300"></wl-line>
					</div>
				</div>
				<!-- 设备在线数 -->
				<div class="chart-item online">
					<!-- tip -->
					<div class="tip">
						<div class="header">
							<div class="icon"><img src="../../static/images/index/icon-online.png"></div>
							<span>设备在线数</span>
							<el-tooltip class="tooltip" content="显示卡片在线数" placement="right">
								<i class="el-icon-question"></i>
							</el-tooltip>
						</div>
						<el-select v-model="online.time"
						           @change="getOnlineChart">
							<el-option
									v-for="item in online.timeOptions"
									:key="item.value"
									:label="item.time"
									:value="item.value">
							</el-option>
						</el-select>
					</div>
					<!-- chart -->
					<div class="chart-area"
					     element-loading-text="正在加载数据，请稍候"
					     v-loading="online.loading">
						<wl-line :options="online.options" :height="300"></wl-line>
					</div>
				</div>
				<!-- 流量池（月） -->
				<div class="chart-item flow"
				     v-loading="loading"
				     element-loading-text="正在加载数据，请稍侯">
					<!-- tip -->
					<div class="tip">
						<div class="header">
							<div class="icon"><img src="../../static/images/index/icon-flow.png"></div>
							<span>流量池</span>
							<el-tooltip class="tooltip" content="流量池本月使用概况" placement="right">
								<i class="el-icon-question"></i>
							</el-tooltip>
						</div>
						<router-link to="/flowPoolInfo">
							<span>更多信息</span>
						</router-link>
					</div>
					<!-- chart -->
					<div class="chart-area" v-if="!flowData.noData">
						<wl-bar :options="flowData" :height="300"></wl-bar>
					</div>
					<!-- 没有月套餐的流量池 -->
					<div class="no-data" v-if="flowData.noData">
						<img src="../../static/images/index/no-pool.png">
					</div>
				</div>
				<!-- 非流量池卡 -->
				<div class="chart-item"
				     v-loading="loading"
				     element-loading-text="正在加载数据，请稍候">
					<!-- tip -->
					<div class="tip">
						<div class="header">
							<div class="icon"><img src="../../static/images/index/icon-single.png"></div>
							<span>非共享流量卡(月)</span>
							<el-tooltip class="tooltip" content="非共享流量卡本月概况" placement="right">
								<i class="el-icon-question"></i>
							</el-tooltip>
						</div>
						<router-link to="notFlowCard">
							<span>更多信息</span>
						</router-link>
					</div>
					<!-- 单卡数量 -->
					<div class="card-info" v-if="!singleCard.noData">
						<div class="info-item total">
							<div class="num">{{ singleCard.total }}</div>
							<span>总数量</span>
						</div>
						<div class="info-item stop">
							<div class="num">{{ singleCard.stop }}</div>
							<span>离线数<br/>(GPRS)</span>
						</div>
						<div class="info-item active">
							<div class="num">{{ singleCard.active }}</div>
							<span>已激活</span>
						</div>
						<div class="info-item newAdd">
							<div class="num">{{ singleCard.newAdd }}</div>
							<span>新增数</span>
						</div>
					</div>
					<!-- 没有月套餐的流量池 -->
					<div class="no-data" v-if="singleCard.noData">
						<!--贵公司暂无该规格产品-->
						<img src="../../static/images/index/no-single.png">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	let echarts = require('echarts/lib/echarts')
	import wlLine from '../components/chart/line.vue'
	import wlBar from '../components/chart/bar.vue'

	import {getPackageFlow,getNetWork} from '../api/dataUtil'

	export default {
		components: {
			wlLine,
			wlBar
		},
		data() {
			return {
				baseInfo: {
					name: '',
					totalCard: '',
					balance: '',
					customer: '',
					hello: '',
					customerShow: false
				},
				// 激活数
				active: {
					time: '30天',
					timeOptions: [
						{
							value: '30',
							time: '30天'
						},
						{
							value: '7',
							time: '7天'
						}
					],

					// 图表数据
					options: {
						color: ['#6cdf07'],
						tooltip: {
							trigger: 'axis',
							formatter: function (params) {
								return `日期: ${params[0].axisValue}</br>
								<span style='display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; background-color: ${params[0].color};'></span>${params[0].seriesName}: ${params[0].value}个`
							}
						},
						// 可以保存为图片
//						toolbox: {
//							feature: {
//								saveAsImage: {}
//							}
//						},
						xAxis: {
							type: 'category',
							boundaryGap: false,
							// 隐藏刻度的设置
//							axisTick: {
//								show: false
//							},
							data: []
						},
						yAxis: {
							type: 'value'
						},
						series: [{
							name: '激活数',
							stack: '总量',
							data: [],
							type: 'line'
						}]
					},
					// loading
					loading: ''
				},
				// 在线数
				online: {
					time: '7天',
					timeOptions: [
						{
							value: '7',
							time: '7天'
						},
						{
							value: '30',
							time: '30天'
						}
					],
					// 图表数据
					options: {
						color: ['#1d9eed'],
						tooltip: {
							trigger: 'axis',
							formatter: function (params) {
								return `日期: ${params[0].axisValue}</br>
								<span style='display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; background-color: ${params[0].color};'></span>${params[0].seriesName}: ${params[0].value}个`
							}
						},
						xAxis: {
							type: 'category',
							data: []
						},
						yAxis: {
							type: 'value'
						},
						series: [{
							name: '在线数',
							stack: '总量',
							data: [],
							type: 'line'
						}]
					},
					// loading
					loading: ''
				},
				// 流量池
				flowData: {
					noData: false,
					color: ['#1d9eed', '#6cdf07'],
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'line'
						},
						formatter: function (params) {
							return `套餐: ${params[0].axisValue}</br>
								<span style='display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; background-color: #1d9eed;'></span>${params[0].seriesName}: ${params[0].value}M<br/>
								<span style='display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; background-color: #68de00;'></span>${params[1].seriesName}: ${params[1].value}M`
						}
					},
					legend: {
//						data: ['总流量', '已使用']
						show: false
					},
					grid: {
						left: '13%',
						right: '5%'
					},
					xAxis: {
						type: 'category',
						axisLabel:{
							interval: 0,
							rotate: 40
						},
//						name: '套餐',
						data: []
					},
					yAxis: {
						type: 'value',
//						name: '使用量',
					},
					series: [
						{
							name: '总流量',
							data: [],
							type: 'bar',
							itemStyle: {
								normal: {
									color: new echarts.graphic.LinearGradient(
										0, 0, 0, 1,
										[
											{offset: 0, color: '#1d9eed'},
											{offset: 1, color: '#19e7c8'}
										]
									)
								}
							}
						},
						{
							name: '已使用',
							data: [],
							type: 'bar',
							barGap: '0',
							itemStyle: {
								normal: {
									color: new echarts.graphic.LinearGradient(
										0, 0, 0, 1,
										[
											{offset: 0, color: '#1dec9c'},
											{offset: 1, color: '#bbff92'}
										]
									)
								}
							}
						}
					],
					barMaxWidth: '40'
				},
				// 单卡
				singleCard: {
					noData: false,
					total: '',
					stop: '',
					active: '',
					newAdd: ''
				},
				loading: ''
			};
		},
		mounted() {
			this.getCurrentTime()
			this.getBaseInfo()
			this.getActiveChart()
			this.getOnlineChart()
		},
		created() {
			this.getFlowPoolOrNot()
		},
		methods: {
			// 获取当前时间
			getCurrentTime() {
				let now = new Date(),
					hour = now.getHours()
				if(hour < 6) {
					this.baseInfo.hello = '凌晨'
				}else if(hour<9) {
					this.baseInfo.hello = '早上'
				}else if(hour<12) {
					this.baseInfo.hello = '上午'
				}else if(hour<14) {
					this.baseInfo.hello = '中午'
				}else if(hour<17) {
					this.baseInfo.hello = '下午'
				}else if(hour<19) {
					this.baseInfo.hello = '傍晚'
				}else if(hour<22) {
					this.baseInfo.hello = '晚上'
				}else {
					this.baseInfo.hello = '夜里'
				}
			},
			// 获取到基本信息
			getBaseInfo() {
				this.$axios({
					url: '/api/v2/base/getBasal',
					method: 'post'
				}).then(res => {
					let data = res.data.data;
//					console.log(data)
					this.baseInfo.name = data.companyName
					this.baseInfo.totalCard = data.cardNo
				})
			},
			// 获取到激活数
			getActiveChart() {
				this.active.loading = true
				this.$axios({
					url: '/statisCardCount/getActiceOrStop',
					method: 'post',
					params: {
						day: this.active.time ? parseFloat(this.active.time) : 30
					}
				}).then(res => {
					if(res.data.code == 100) {
						this.active.loading = false
						let data = res.data.object.actStoCount;
//					    console.log(data)
						this.active.options.xAxis.data = []
						this.active.options.series[0].data = []
						for(let i=0; i<data.length; i++) {
							this.active.options.xAxis.data.push(data[i].createTime.split(' ')[0])
							this.active.options.series[0].data.push(data[i].activeCardCount)
						}
					}
				})
			},
			// 获取到在线数
			getOnlineChart() {
				this.online.loading = true
				this.$axios({
					url: '/statisCardCount/getActiceOrStop',
					method: 'post',
					params: {
						day: this.online.time ? parseFloat(this.online.time) : 7
					}
				}).then(res => {
					if(res.data.code == 100) {
						this.online.loading = false
						let data = res.data.object.actStoCount;
//					    console.log(data)
						this.online.options.xAxis.data = []
						this.online.options.series[0].data = []
						for(let i=0; i<data.length; i++) {
							this.online.options.xAxis.data.push(data[i].createTime.split(' ')[0])
							this.online.options.series[0].data.push(data[i].onlineCardCount)
						}
					}
				})
			},
			// 获取流量池和非流量池
			getFlowPoolOrNot() {
				this.loading = true
				this.$axios({
					url: '/statisCardCount/getPoolAndNotPool',
					method: 'post'
				}).then(res => {
					if(res.data.code == 100) {
						this.loading = false
						let data = res.data.object;
						let flowPool = data.pool
						let notPool = data.isNotPool


//						console.log(flowPool)
//						console.log(notPool)



						// 非流量池
//						console.log(notPool)
						if(notPool.totalCard == 0) {
							this.singleCard.noData = true
						}else {
							this.singleCard.noData = false
							this.singleCard.total = notPool.totalCard
							this.singleCard.stop = notPool.stopCardCount
							this.singleCard.active = notPool.acticeCardCount
							this.singleCard.newAdd = notPool.newAdd
						}



						if(!flowPool.length) {
							this.flowData.noData = true
							return
						}
						// 循环流量池
						for(let i=0; i<flowPool.length; i++) {
//							debugger
							// 如果poolUseInfo为空，则跳出
							if(!flowPool[i].poolUseInfo.length) {
								continue
							}
							// 如果poolUseInfo不为空，则循环poolUseInfo
							for(let j=0; j<flowPool[i].poolUseInfo.length; j++) {
//								if(j%2==0) {
//									this.flowData.xAxis.data.push(`${getNetWork(flowPool[i].netWork)}${getPackageFlow(flowPool[i].poolUseInfo[j].dataSize)}`)
//								}else {
//									this.flowData.xAxis.data.push(`\n${getNetWork(flowPool[i].netWork)}${getPackageFlow(flowPool[i].poolUseInfo[j].dataSize)}`)
//								}
								this.flowData.xAxis.data.push(`${getNetWork(flowPool[i].netWork)}${getPackageFlow(flowPool[i].poolUseInfo[j].dataSize)}`)
								this.flowData.series[0].data.push(flowPool[i].poolUseInfo[j].total)
								this.flowData.series[1].data.push(flowPool[i].poolUseInfo[j].poolUse)
							}
						}
					}
				})
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	.index-wrap {
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
				.name-card {
					display: flex;
					flex: 4;
					justify-content: space-between;
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
					.card {
						padding-right: 30px;
						text-align: center;
						.icon {
							margin: 0 auto;
							margin-top: 20px;
						}
						.tip {
							font-size: 24px;
							margin: 15px 0 -5px;
						}
						span {
							color: #1d9eed;
							font-size: 36px;
						}
					}
				}
				/* 账户余额 */
				.balance, .customer {
					flex: 1;
					text-align: center;
					position: relative;
					.icon {
						margin: 0 auto;
						margin-top: 20px;
					}
					.tip {
						font-size: 24px;
						margin: 15px 0 -5px;
					}
					span {
						color: #ed7f1d;
						font-size: 36px;
					}
				}
				/* 客户数量 */
				.customer {
					span {
						color: #68de00;
					}
				}
				.balance:before, .customer:before {
					content: '';
					display: block;
					width: 1px;
					height: 60px;
					background-color: #d2d2d2;
					position: absolute;
					top: 70px;
					left: 0;
				}
			}
			/* 图表区域 */
			.chart {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.chart-item {
					border-radius: 10px;
					margin-top: 20px;
					height: 400px;
					background-color: #fff;
					padding-top: 30px;
					width: 49%;
					.tip {
						display: flex;
						justify-content: space-between;
						padding: 0 40px;
						line-height: 40px;
						.header {
							display: flex;
							height: 40px;
							line-height: 40px;
							span {
								font-size: 24px;
								margin-left: 15px;
							}
							.tooltip {
							}
						}
						.el-select {
							width: 120px;
						}
						>a span {
							font-size: 18px;
							color: #1d9eed;
						}
					}
					.card-info {
						display: flex;
						margin-top: 100px;
						position: relative;
						.info-item {
							flex: 1;
							text-align: center;
							.num {
								font-size: 36px;
								margin-bottom: 15px;
							}
							span {
								font-size: 22px;
								color: #585858;
							}
						}
						.total {
							flex: 2;
							margin-top: -18px;
							position: relative;
							.num {
								font-size: 48px;
								color: #585858;
							}
						}
						.total:before {
							content: '';
							display: block;
							width: 1px;
							height: 95px;
							background-color: #d2d2d2;
							position: absolute;
							right: 0;
							top: 18px;
						}
						.stop {
							.num {
								color: #ed1d1d;
							}
						}
						.active {
							.num {
								color: #1d9eed;
							}
						}
						.newAdd {
							.num {
								color: #68de00;
							}
						}
					}

					.no-data {
						width: 100%;
						padding: 40px 40px 0;
						img {
							width: 100%;
						}
					}
				}
			}
		}
	}
</style>
