<template>
	<div class="cardDetail-wrap wrap">
		<div class="content wrap-content">
			<!-- 标题 -->
			<div class="page-title">
				<div class="line"></div>
				<span>单卡详情</span>
			</div>
			<!-- 基本信息 -->
			<div class="base-info">
				<div class="tip">基本信息</div>
				<div class="info-box">
					<div class="info-item card-iccid">
						<div class="item card">
							卡号: {{ baseInfo.cardNum }}
						</div>
						<div class="item iccid">
							ICCID: {{ baseInfo.iccid }}
						</div>
					</div>
					<div class="info-item base">
						<div class="item kind">
							卡种类: {{ baseInfo.cardType }}
						</div>
						<div class="item net-work">
							运营商: {{ baseInfo.netWork }}
						</div>
						<div class="item netWork-type">
							卡制式: {{ baseInfo.netWorkType }}
						</div>
					</div>
					<div class="info-item status">
						<span>卡状态: </span>
						<div class="item-box">
							<div class="item kind">
								激活状态: {{ baseInfo.status.active }}
							</div>
							<div class="item net-work">
								设备在线状态: {{ baseInfo.status.online }}
							</div>
							<div class="item netWork-type">
								GPRS使用情况: {{ baseInfo.status.stop }}
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 流量信息 -->
			<div class="flow-info">
				<div class="tip">流量信息</div>
				<div class="info-box">
					<div class="info-item card-iccid">
						<div class="item package">
							本月套餐流量: {{ flowInfo.packageFlow }}
						</div>
						<div class="item iccid">
							本月已使用: {{ flowInfo.usage }}
						</div>
					</div>
					<div class="info-item time">
						<div class="item kind">
							开始时间: {{ flowInfo.startTime }}
						</div>
						<div class="item net-work">
							结束时间: {{ flowInfo.endTime }}
						</div>
					</div>
					<div class="info-item msg">
						<div class="item">
							已使用短信: {{ flowInfo.usageMsg }}
						</div>
					</div>
				</div>
			</div>
			<!-- 折线统计图 -->
			<div class="line-chart">
				<div class="tip">折线统计图</div>
				<!-- chart -->
				<div class="chart">
					<!-- 工具栏 -->
					<div class="tools">
						<!-- 时间 -->
						<div class="time">
							<span>时间: </span>
							<el-date-picker
									v-model="startTime"
									@change="startTimeChange"
									class="timePicker"
									type="date"
									format="yyyy-MM-dd"
									value-format="yyyy-MM-dd"
									placeholder="开始时间">
							</el-date-picker>
							&nbsp; 至 &nbsp;
							<el-date-picker
									v-model="endTime"
									@change="endTimeChange"
									class="timePicker"
									type="date"
									format="yyyy-MM-dd"
									value-format="yyyy-MM-dd"
									placeholder="结束时间">
							</el-date-picker>
						</div>
						<!-- 搜索按钮 -->
						<div class="btn-search btn-main" @click="btnSearch">搜索</div>
						<!-- 导出 -->
						<div class="btn-export btn-gray" @click="btnExport">导出</div>
					</div>
					<!-- 折线图 -->
					<wl-line :options="chartData"
					         :height="300"
					         v-loading="loading"
					         element-loading-text="正在加载数据，请稍侯">
					</wl-line>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		format, timestampToTime,getNetWork,getOnlineStatus,getActiveStatus,getGPRS,
		translateCardKind, translateSystem,
		startDate, endDate, baseUrl
	} from '../api/dataUtil'
	import wlLine from '../components/chart/line.vue'
	export default {
		components: {
			wlLine
		},
		data() {
			return {
				// 基本信息
				baseInfo: {
					cardNum: '',
					iccid: '',
					cardType: '',
					netWork: '',
					netWorkType: '',
					status: {
						active: '',
						online: '',
						stop: ''
					}
				},
				// 流量信息
				flowInfo: {
					packageFlow: '',
					usage: '',
					startTime: '',
					endTime: '',
					usageMsg: ''
				},
				// 加载
				loading: '',
				// 折线图数据
				startTime: '',
				endTime: '',
				chartData: {
					color: ['#1d9eed'],
					tooltip: {
						trigger: 'axis',
						formatter: function (params) {
							return `日期: ${params[0].axisValue}</br>
								<span style='display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; background-color: ${params[0].color};'></span>${params[0].seriesName}: ${params[0].value}M`
						}
					},
					// 可以保存为图片
//						toolbox: {
//							feature: {
//								saveAsImage: {}
//							}
//						},

					grid: {
						left: '3%',
						right: '5%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						axisLabel:{
							interval: 0,
							rotate: 50
						},
						data: []
					},
					yAxis: {
						type: 'value'
					},
					series: [{
						name: '使用量',
						stack: '总量',
						data: [],
						type: 'line'
					}]
				},
				deviceId: '',
				pageNo: 1,
				pageSize: 50,

				// 下载的href
				baseUrl: `${baseUrl}/api/importLog`,
				uploadHref: ''
			};
		},
		mounted() {
			// 设置默认日期为当前日期
			this.startTime = startDate
			this.endTime = endDate
			this.deviceId = this.$route.query.deviceId
			this.getBaseInfo()
		},
		created() {
		},
		methods: {
			// 获取到基本信息
			getBaseInfo() {
				this.$axios({
					url: '/api/v2/device/getDeviceDetail',
					method: 'post',
					params: {
						deviceId: this.deviceId
					}
				}).then(res => {
					let data = res.data.data
//					console.log(data)
					// 基本信息
					this.baseInfo.cardNum = data.cardNumber
					this.baseInfo.iccid = data.iccid
					this.baseInfo.cardType = translateCardKind(data.cardType)
					this.baseInfo.netWork = getNetWork(data.netWork)
					this.baseInfo.netWorkType = translateSystem(data.networkType)

					this.baseInfo.status.active = getActiveStatus(data.cardStatus)
					this.baseInfo.status.online = getOnlineStatus(data.onlineStatus)
					this.baseInfo.status.stop = getGPRS(data.stopStatus)

					// 流量信息
					this.flowInfo.packageFlow = data.poolName
					this.flowInfo.usage = (data.usageMonth / 1024).toFixed(2) + 'M'
					this.flowInfo.startTime = data.chargeTime.split(' ')[0]
					this.flowInfo.endTime = data.endTime.split(' ')[0]
					this.flowInfo.usageMsg = data.msgNo




					this.getChartData()
				})
			},
			// 搜索
			btnSearch() {
//				debugger
				if(!this.startTime || !this.endTime) {
					this.$message.info('开始时间和结束时间都要选择')
				}else if(this.startTime > this.endTime) {
					this.$message.info('开始时间不能大于结束时间')
				}else {
					this.getChartData()
				}
			},
			// 获取到折线图数据
			getChartData() {
				this.loading = true
				this.$axios({
					url: '/api/v2/device/getLog',
					method: 'post',
					params: {
						cardNo: this.baseInfo.cardNum ? this.baseInfo.cardNum : this.baseInfo.iccid,
						beginTime: this.startTime,
						endTime: this.endTime,
						pageSize: this.pageSize,
						pageNo: this.pageNo
					}
				}).then(res => {
					let data = res.data.data
					if(res.data.code == 1) {
						this.loading = false
						this.chartData.xAxis.data = []
						this.chartData.series[0].data = []
						for (let i = 0; i < data.length; i++) {
							this.chartData.xAxis.data.push(data[i].insertTime.split(' ')[0]),
								this.chartData.series[0].data.push((data[i].usageYesterday / 1024).toFixed(2))
						}
					}
				})
			},
			// 选择日期
			startTimeChange() {
				if (!this.startTime) {
					this.startTime = ''
					return
				}
				this.startTime = format(new Date(this.startTime).getTime(), "Y-m-d")
			},
			endTimeChange() {
				if (!this.endTime) {
					this.endTime = ''
					return
				}
				this.endTime = format(new Date(this.endTime).getTime(), "Y-m-d")
			},
			// 导出表格
			btnExport() {
				let token = sessionStorage.getItem('_token'),
					cardNo = this.baseInfo.cardNum ? this.baseInfo.cardNum : this.baseInfo.iccid,
					beginTime = this.startTime,
					endTime = this.endTime
				this.uploadHref = `${this.baseUrl}?_token=${token}
						&cardNo=${cardNo}&beginTime=${beginTime}
						&endTime=${endTime}`

				let iframe = document.createElement('iframe');
				iframe.src = this.uploadHref
				document.body.appendChild(iframe)
				iframe.style.display = 'none'
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #1d9eed;
	mainButton = #4cb2ff;
	.cardDetail-wrap {
		.content {
			/* 基本信息 */
			.base-info {
				background-color: #fff;
				height: 234px;
				border-radius: 20px;
				padding: 30px;
				margin-bottom: 20px;
				/* tip */
				.tip {
					font-size: 24px;
					color: #585858;
				}
				.info-box {
					display: flex;
					margin-top: 20px;
					.info-item {
						flex: 1;
						.item {
							font-size: 18px;
							color: #585858;
						}
					}
					.card-iccid {
						flex: 2;
						display: flex;
						flex-direction: column;
						justify-content: space-around;
					}
					.base {
						flex: 1;
						border-left: 1px solid #ddd;
						border-right: 1px solid #ddd;
						text-align: center;
						.item {
							line-height: 40px;
						}
					}
					.status {
						flex: 2;
						display: flex;
						span {
							margin: 44px 30px 0 70px;
							font-size: 24px;
							color: #585858;
						}
						.item {
							line-height: 40px;
						}
					}
				}
			}
			/* 流量信息 */
			.flow-info {
				background-color: #fff;
				height: 200px;
				border-radius: 20px;
				padding: 30px;
				margin-bottom: 20px;
				/* tip */
				.tip {
					font-size: 24px;
					color: #585858;
				}
				.info-box {
					height: 90px;
					display: flex;
					margin-top: 20px;
					.info-item {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						text-align: center;
						.item {
							font-size: 18px;
							color: #585858;
							line-height: 40px;
						}
					}
					.card-iccid {
						text-align: left;
					}
					.time {
						border-left: 1px solid #ddd;
						border-right: 1px solid #ddd;
					}
					.msg {
						justify-content: space-around;
					}
				}
			}
			/* 折线统计图 */
			.line-chart {
				background-color: #fff;
				border-radius: 20px;
				padding: 30px;
				/* tip */
				.tip {
					font-size: 24px;
					color: #585858;
				}
				.chart {
					margin-top: 50px;
					/* 工具栏 */
					.tools {
						display: flex;
						/* 时间 */
						.time {
							display: flex;
							line-height: 40px;
							margin-right: 40px;
							margin-bottom: 20px;
							span {
								margin-right: 10px;
								font-size: 18px;
								color: #545454;
							}
							.timePicker {
								width: 150px;
							}
						}
						/* 导出按钮 */
						.btn-export {
							margin-left: 40px;
						}
					}
					/* 折线图 */
				}
			}
		}
	}
	@media (min-width: 1600px) {
		.cardDetail-wrap {
			.content {
				/* 基本信息 */
				.base-info {
					.info-box {
						.info-item {
							flex: 1;
						}
					}
				}
			}
		}
	}
</style>