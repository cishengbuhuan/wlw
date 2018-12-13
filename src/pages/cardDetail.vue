<template>
	<div class="cardDetail-wrap">
		<div class="content">
			<!-- 基本信息 -->
			<div class="base-info">
				<div class="tips"><i></i>基本信息</div>
				<div class="info-content">
					<div class="row1">
						<div class="item">
							<img class="icon icon1" src="../../static/images/base-info-icon1.png">
							<div class="info-data">
								<div class="data-item">卡号: {{ baseInfo.cardNumber }}</div>
								<div class="data-item">ICCID: {{ baseInfo.iccid }}</div>
							</div>
						</div>
						<div class="item">
							<img class="icon icon3" src="../../static/images/base-info-icon3.png">
							<div class="info-data">
								<div class="data-item">卡种类: {{ baseInfo.cardKind }}</div>
								<div class="data-item">卡状态: {{ baseInfo.cardStatus }}</div>
							</div>
						</div>
						<div class="item">
							<img class="icon icon4" src="../../static/images/base-info-icon4.png">
							<div class="info-data">
								<div class="data-item">运营商: {{ baseInfo.operator }}</div>
								<div class="data-item">卡制式: {{ baseInfo.system }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 流量信息 -->
			<div class="flow-info">
				<div class="tips"><i></i>流量信息</div>
				<div class="info-content">
					<div class="row1">
						<div class="item">
							<img class="icon icon2" src="../../static/images/base-info-icon2.png">
							<div class="info-data">
								<div class="data-item">本月套餐流量: {{ baseInfo.flowMonth }}</div>
								<div class="data-item">本月已使用: {{ baseInfo.usageMonth }}</div>
							</div>
						</div>
						<div class="item">
							<img class="icon icon6" src="../../static/images/base-info-icon6.png">
							<div class="info-data">
								<div class="data-item">开始时间: {{ baseInfo.startTime }}</div>
								<div class="data-item">结束时间: {{ baseInfo.endTime }}</div>
							</div>
						</div>
						<div class="item single">
							<img class="icon-single" src="../../static/images/base-info-icon7.png">
							<div class="info-data">已使用短信: {{ baseInfo.usageMsg }}</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 折线统计图 -->
			<div class="polyline-chart">
				<div class="tips"><i></i>折线统计图</div>
				<div class="chart-content">
					<!-- 时间筛选框 -->
					<div class="tools">
						<span>时间：</span>
						<el-date-picker
								v-model="timeValue"
								type="daterange"
								align="right"
								unlink-panels
								:clearable="isClearable"
								range-separator="至"
								start-placeholder="开始时间"
								end-placeholder="结束时间">
						</el-date-picker>
						<div class="btn-search" @click="pickChange">查询</div>
						<div class="btn-export" @click="btnExport">导出</div>
					</div>
					<!-- 折线图 -->
					<div class="chart">
						<ve-line :data="chartData" :settings="settings" :extend="extend"></ve-line>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		format, timestampToTime,
		translateCardKind, translateSystem,
		startDate, endDate, baseUrl
	} from '../api/dataUtil'
	import VeLine from "v-charts/lib/line.common";

	export default {
		components: {
			VeLine
		},
		data() {
			// 折线图
			this.settings = {
				labelLine: 'show',
				yAxisName: ['流量/MB'],
				xAxisName: ['日期'],
				label: {
					show: false
				},
				offsetY: 200,
			}
			this.extend = {
				legend: {
					show: false
				},
				series(v) {
					v.forEach((e, idx) => {
						e.lineStyle = {
							color: '#4cb2ff', // 线条颜色
							width: 2 // 线条宽度
						}
						e.itemStyle = {
							borderColor: '#4cb2ff',
							borderWidth: 6,
							color: '#4cb2ff',
							borderType: 'solid'
						}
					})
					return v
				},
				tooltip: {
					formatter: '{c0}MB' // 自定义提示
				}
			}
			return {
				// 基本信息
				baseInfo: {
					cardNumber: '',
					iccid: '',
					flowMonth: '',
					usageMonth: '',
					cardKind: '',
					cardStatus: '',
					operator: '',
					system: '',
					flowPackages: '',
					singleFlow: '',
					startTime: '',
					endTime: '',
					usageMsg: ''
				},
				chartData: {
					columns: ['date', 'usage'],
					rows: []
				},
				timeValue: [],
				// 预警值
				warningStatus: 0,
				deviceId: '',
				// 起始时间
				beginTime: '',
				endTime: '',

				pageSize: 50,
				pageNo: 1,
				isClearable: false,

				// 下载的href
				baseUrl: `${baseUrl}/api/importLog`,
				uploadHref: ''
			};
		},
		created() {
			// 设置默认日期为当前日期
			this.timeValue[0] = startDate
			this.timeValue[1] = endDate
			this.beginTime = startDate
			this.endTime = endDate
//			console.log(startDate)
		},
		mounted() {
			this.deviceIdChange()
			this.getBaseInfo()
		},
		methods: {
			deviceIdChange() {
				this.deviceId = this.$route.query.deviceId
				console.log(this.deviceId)
			},
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
					console.log(data)
					this.baseInfo.cardNumber = data.cardNumber
					this.baseInfo.iccid = data.iccid
					this.baseInfo.flowMonth = data.poolName
					this.baseInfo.usageMonth = (data.usageMonth / 1024).toFixed(2) + 'M'
					this.baseInfo.cardKind = translateCardKind(data.cardType)
					this.baseInfo.cardStatus = data.onlineStatus === 1 ? '在线' : data.onlineStatus === 0 ? '离线' : '',
						this.baseInfo.operator = data.netWork === 1 ? '移动' : data.netWork === 2 ? '联通' : '电信'
					this.baseInfo.system = translateSystem(data.networkType)
					this.baseInfo.flowPackages = data.packages
					this.baseInfo.singleFlow = data.usageMonth
//					this.baseInfo.startTime = timestampToTime(Number(data.chargeTime))
//					this.baseInfo.endTime = timestampToTime(Number(data.endTime))
					this.baseInfo.startTime = data.chargeTime.split(' ')[0]
					this.baseInfo.endTime = data.endTime.split(' ')[0]
					this.baseInfo.usageMsg = data.msgNo


					this.getFlowData()
				})
			},
			// 获取到折线图数据
			getFlowData() {
				this.$axios({
					url: '/api/v2/device/getLog',
					method: 'post',
					params: {
						cardNo: this.baseInfo.cardNumber,
						beginTime: this.beginTime,
						endTime: this.endTime,
						pageSize: this.pageSize,
						pageNo: this.pageNo
					}
				}).then(res => {
					let data = res.data.data
//					console.log(data)
					this.chartData.rows = []
					for (let i = 0; i < data.length; i++) {
						this.chartData.rows.push({
							date: data[i].insertTime.split(' ')[0],
							usage: (data[i].usageYesterday / 1024).toFixed(2)
						})
					}
				})
			},
			// 选择日期
			pickChange() {
				if (!this.timeValue) {
					this.beginTime = ''
					this.endTime = ''
					this.getFlowData();
					return
				}
				this.beginTime = format(new Date(this.timeValue[0]).getTime(), "Y-m-d")
				this.endTime = format(new Date(this.timeValue[1]).getTime(), "Y-m-d")
				this.getFlowData();
			},
			// 导出表格
			btnExport() {
				let token = sessionStorage.getItem('_token'),
					cardNo = this.baseInfo.cardNumber ? this.baseInfo.cardNumber : this.baseInfo.iccid,
					beginTime = this.beginTime,
					endTime = this.endTime
				this.uploadHref = `${this.baseUrl}?_token=${token}
						&cardNo=${cardNo}&beginTime=${beginTime}
						&endTime=${endTime}`

				console.log(this.uploadHref)
				let iframe = document.createElement('iframe');
				iframe.src = this.uploadHref
				document.body.appendChild(iframe)
				iframe.style.display = 'none'
			},
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	.cardDetail-wrap {
		padding-top: 50px;
		padding-left: 200px;
		.content {
			width: 100%;
			height: calc(100vh - 50px);
			padding: 20px;
			overflow-y: scroll;
			/* 基本信息 */
			.base-info, .flow-info {
				width: 100%;
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				border-radius: 5px;
				margin-bottom: 20px;
				.tips {
					height: 110px;
					line-height: 110px;
					border-bottom: 1px solid #ddd;
					font-size: 26px;
					display: flex;
					padding-left: 45px;
					i {
						width: 6px;
						height: 28px;
						display: block;
						background-color: mainBlue;
						margin-top: 41px;
						margin-right: 5px;
					}
				}
				.info-content {
					padding: 20px 50px;
					.row1, .row2, .row3 {
						display: flex;
						margin-bottom: 20px;
						.item {
							display: flex;
							flex: 1;
							justify-content: center;
							.icon {
								width: 58px;
								height: 72px;
								margin-top: 23px;
							}
							.icon1 {

							}
							.info-data {
								margin-left: 5px;
								.data-item {
									font-size: 18px;
									height: 60px;
									line-height: 60px;
								}
							}
						}
						.single {
							margin-top: 43px;
							display: flex;
							flex: 1;
							.icon-single {
								width: 56px;
								height: 28px;
							}
							.info-data {
								margin-left: 5px;
								font-size: 20px;
								/*height: 60px;*/
								line-height: 30px;
							}
						}
					}
				}
			}
			/* 折线统计图 */
			.polyline-chart {
				width: 100%;
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				border-radius: 5px;
				margin-bottom: 20px;
				.tips {
					height: 110px;
					line-height: 110px;
					border-bottom: 1px solid #ddd;
					font-size: 26px;
					display: flex;
					padding-left: 45px;
					i {
						width: 6px;
						height: 28px;
						display: block;
						background-color: mainBlue;
						margin-top: 41px;
						margin-right: 5px;
					}
				}
				.chart-content {
					padding-bottom: 40px;
					/* 时间筛选框 */
					.tools {
						display: flex;
						justify-content: center;
						font-size: 16px;
						line-height: 40px;
						margin-top: 50px;
						span {
							margin-right: 10px;
						}
						.btn-search, .btn-export {
							width: 90px;
							height: 40px;
							border: 1px solid #ddd;
							text-align: center;
							line-height: 40px;
							cursor: pointer;
							border-radius: 5px;
							margin-left: 40px;
						}
					}
					/* 折线图 */
					.chart {
						padding: 0 40px;
					}
				}
			}
		}
	}
</style>


