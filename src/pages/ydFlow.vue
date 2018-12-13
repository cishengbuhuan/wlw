<template>
	<div class="flowPool-wrap">
		<div class="content">
			<!-- 基本信息 -->
			<div class="base-info">
				<div class="info-header">
					<!-- 套餐 -->
					<el-select v-model="packageValue"
					           @change="packageChange"
					           value-key="value"
					           placeholder="请选择套餐">
						<el-option
								v-for="item in packageOptions"
								:key="item.value"
								:label="item.flowPackage"
								:value="item.value">
						</el-option>
					</el-select>
					<!-- 类型 -->
					<el-select v-model="packageTypeValue"
					           @change="packageTypeChange"
					           value-key="value"
					           placeholder="请选择类型">
						<el-option
								v-for="item in packageTypeOptions"
								:key="item.value"
								:label="item.typePackage"
								:value="item.value">
						</el-option>
					</el-select>
				</div>
				<!-- 基本信息的柱状图 -->
				<div class="info-content">
					<!-- 柱状图 -->
					<div class="chart-bar">
						<ve-bar :data="flowData"
						        :settings="flowSettings"
						        :colors="colors"
						        class="bar"
						        :extend="flowExtend">
						</ve-bar>
					</div>
					<!-- tips -->
					<div class="chart-tips">
						<span>总流量：{{ baseInfo.totalFlow }}M</span>
						<span>单卡流量：{{ baseInfo.singleFlow }}M</span>
						<span>使用率：{{ baseInfo.usageRate }}%</span>
						<span>已超出：{{ baseInfo.overview }}个</span>
						<span>预警数：{{ baseInfo.warnNumber }}个</span>
						<span>超套卡数：{{ baseInfo.alarmCardNumber }}个</span>
					</div>
				</div>
			</div>
			<!-- 流量池表格 -->
			<div class="flow-table">
				<div class="table-header">
					<!-- 搜索框 -->
					<div class="search-box">
						<input type="text" placeholder="请输入卡号查询" v-model="numVal">
						<div class="btn-search" @click="getTableData"><i class="el-icon-search"></i></div>
					</div>
					<!-- 联动选择器 -->
					<div class="cascader">
						<el-select v-model="statusValue"
						           clearable
						           @change="toggleStatus"
						           placeholder="请选择状态">
							<el-option
									v-for="item in statusOptions"
									:key="item.value"
									:label="item.status"
									:value="item.value">
							</el-option>
						</el-select>
					</div>
					<br>
					<!-- 时间查询 -->
					<div class="time-inquire">
						<span>时间：</span>
						<el-date-picker
								v-model="timeValue"
								type="daterange"
								align="right"
								unlink-panels
								range-separator="至"
								start-placeholder="计费时间起"
								end-placeholder="计费时间止">
						</el-date-picker>
						<div class="btn-inquire" @click="pickChange">查询</div>
					</div>
				</div>
				<!-- table内容 -->
				<div class="table-box">
					<el-table
							:data="tableData"
							@sort-change='sortChange'
							border
							v-loading="loading"
							style="width: 100%">
						<el-table-column prop="sortNum" width='100' label="序号" align="center"></el-table-column>
						<el-table-column prop="cardNum" label="卡号" align="center"></el-table-column>
						<el-table-column prop="iccid" label="iccid" align="center"></el-table-column>
						<el-table-column prop="operator" label="运营商" align="center"></el-table-column>
						<el-table-column prop="flowPackage" label="流量池套餐" align="center"></el-table-column>
						<!--<el-table-column prop="packageType" label="套餐类型" align="center"></el-table-column>-->
						<el-table-column prop="flowUsage" sortable='custom' width='150' label="本月已使用流量"
						                 align="center"></el-table-column>
						<el-table-column prop="message" width='70' label="短信" align="center"></el-table-column>
						<el-table-column prop="endTime" label="到期时间" align="center"></el-table-column>
						<el-table-column prop="cardStatus" label="卡状态" align="center"></el-table-column>
						<el-table-column prop="operate" label="操作" align="center">
							<template slot-scope="scope">
								<span class="more" @click="goDetail(scope.row)">查看详情</span>
							</template>
						</el-table-column>
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
	import VeBar from "v-charts/lib/bar.common";
	import {timestampToTime, format, translatePackages} from '../api/dataUtil'
	import router from 'vue-router'

	export default {
		components: {
			VeBar
		},
		data() {
			this.flowSettings = {
				stack: {
					'xxx': ['usage', 'unused', 'exceeded']
				},
				legendName: {
					'usage': '已使用',
					'unused': '未使用',
					'exceeded': '已超出'
				},
				labelMap: {
					'usage': '已使用',
					'unused': '未使用',
					'exceeded': '已超出'
				}
			}
			this.flowExtend = {
				tooltip: {
					formatter: function (params) {
						return `流量池: ${params[0].axisValue}</br>
								<span style='display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; background-color: ${params[0].color};'></span>${params[0].seriesName}: ${params[0].value}M</br>
								<span style='display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; background-color: ${params[1].color};'></span>${params[1].seriesName}: ${params[1].value}M`
					}
				},
				barWidth: '60'
			}
			return {
				colors: ['#4cb2ff', '#bbbbbb', '#da2627'],
				noPoolId: true,
				packageTypeValue: '',
				packageValue: '',
				defaultPoolId: '',
				defaultPackageType: '',
				poolId: '',
				packageType: '',
				// 套餐的下拉框
				packageOptions: [],
				// 套餐类型的下拉框
				packageTypeOptions: [],
				// 数据
				baseInfo: {
					totalFlow: 0,
					singleFlow: 0,
					usageRate: '',
					overview: 0,
					warnNumber: 0,
					alarmCardNumber: 0
				},
				// 柱状图数据
				flowDataDemo: {
					columns: ['flowSize', 'usage', 'unused', 'exceeded'],
					rows: [
						{
							'flowSize': 100,
							'usage': 100,
							'unused': 200,
							'exceeded': 0
						},
						{
							'flowSize': 200,
							'usage': 100,
							'unused': 0,
							'exceeded': 200
						}
					]
				},
				flowData: {
					columns: ['flowSize', 'usage', 'unused', 'exceeded'],
					rows: []
				},
				totalCount: 0,
				pageSize: 20,
				pageNo: 1,
				// 加载
				loading: '',
				areaValue: '',
				statusValue: '',
				systemValue: '',
				statusOptions: [
					{
						value: '1',
						status: '在线'
					},
					{
						value: '0',
						status: '离线'
					}
				],
				timeValue: '',
				tableData: [],
				typeValue: '',
				status: '',
				defaultStatus: '',
				numVal: '',
				beginTime: '',
				endTime: '',
				// 表格流量排序
				sortData: '',
				direct: '',
				netWork: 1
			};
		},
		mounted() {
			this.getPackageOptions();
		},
		methods: {
			// 改变当前页数
			changePageNo(val) {
				this.pageNo = val;
				this.getTableData()
			},
			// 改变每页显示的条数
			changeSize(val) {
				this.pageSize = val;
				this.getTableData()
			},
			// 获取到套餐
			getPackageOptions() {
				let that = this
				that.$axios({
					url: '/api/getPoolAndPack',
					method: 'post',
					params: {
						netWork: this.netWork
					}
				}).then(res => {
					// console.log(res.data.data)
					let data = res.data.data
					that.packageOptions = []
					that.packageValue = data[0].name
					that.defaultPoolId = data[0].poolId
					for (let i = 0; i < data.length; i++) {
						that.packageOptions.push({
							value: data[i].poolId,
							flowPackage: data[i].name
						})
					}
					that.getPackageType()
				})
			},
			// 获取到套餐种类
			getPackageType() {
				let poolId = this.poolId ? this.poolId : this.defaultPoolId
				let that = this
				that.$axios({
					url: '/api/getPoolAndPack',
					method: 'post',
					params: {
						netWork: this.netWork,
						poolId: poolId
					}
				}).then(res => {
					// console.log(res.data.data)
					let data = res.data.data
//					debugger
					if (data.length === 0) {
						that.packageTypeOptions = []
						that.packageTypeValue = ''
						that.packageType = ''
						that.defaultPackageType = ''

						that.getBarInfo()
						that.getTableData()
						return
					}
					that.packageTypeOptions = []
					that.packageTypeValue = ''
					that.packageType = ''
					that.defaultPackageType = ''
					that.packageTypeValue = this.transformPackageType(data[0].packageType)
					that.defaultPackageType = data[0].packageType
					for (let i = 0; i < data.length; i++) {
						that.packageTypeOptions.push({
							value: data[i].packageType,
							typePackage: this.transformPackageType(data[i].packageType)
						})
					}
					that.getBarInfo()
					that.getTableData()
				})
			},
			// 获取到图表基本信息
			getBarInfo() {
				let that = this
				let poolId = this.poolId ? this.poolId : this.defaultPoolId;
				let packageType = this.packageType ? this.packageType : this.defaultPackageType;
//				console.log(poolId,packageType)
				// 如果套餐和种类有一项为空，则不做请求直接return
				if (!poolId || !packageType) {
					that.noPoolId = true;
					return
				}
				that.noPoolId = false;
				that.$axios({
					url: '/api/v2/pool/poolUsage',
					method: 'post',
					params: {
						poolId: poolId,
						packageType: packageType
					}
				}).then(res => {
					let data = res.data.data;

					console.log(data)
					// 总流量
					that.baseInfo.totalFlow = data.cardInfo.total
					// 单卡流量
					that.baseInfo.singleFlow = data.cardInfo.dataSize
					// 使用率
					that.baseInfo.usageRate = parseFloat(data.cardInfo.usage).toFixed(2)
					// 已超出
					that.baseInfo.overview = data.cardNum.over
					// 预警数
					that.baseInfo.overview = data.cardNum.warn
					// 超套卡数
					that.baseInfo.overview = data.cardNum.alarm

					// 给柱状图追加数据
					that.flowData.rows = []
					that.flowData.rows.push({
						flowSize: data.cardInfo.dataSize + 'M',
						usage: data.cardInfo.poolUse,
						unused: this.getUnused(data.cardInfo.total, data.cardInfo.poolUse),
						exceeded: this.getExceeded(data.cardInfo.total, data.cardInfo.poolUse)
					})
				})
			},
			// 套餐的下拉框的值发生变化的时候触发
			packageChange(val) {
				this.poolId = val;
				this.getPackageType()
//				this.getBarInfo()
//				this.getTableData()
			},
			// 套餐类型下拉框的值发生变化的时候触发
			packageTypeChange(val) {
				this.packageType = val;
				this.getBarInfo();
			},
			// 获取表格 数据
			getTableData() {
				let reg = /.*[\u4e00-\u9fa5]+.*$/;
				let packageType = this.packageType ? this.packageType : this.defaultPackageType;
				if (reg.test(this.numVal)) {
					this.$message({
						type: 'info',
						message: '请输入正确的卡号或ICCID'
					});
					return
				}
				this.loading = true
				this.$axios({
					url: '/api/v2/device/devicePageList',
					method: 'post',
					params: {
						pageSize: this.pageSize,
						pageNo: this.pageNo,
						cardNo: this.numVal,
						poolId: this.poolId ? this.poolId : this.defaultPoolId,
						status: this.status ? this.status : this.defaultStatus,
						startTime: this.beginTime,
						endTime: this.endTime,
						sort: this.sortData,
						direct: this.direct,
						netWork: this.netWork,
						cardPackage: this.packagesTypeValue,
						packageType: packageType
					}
				}).then(res => {
					let data = res.data.data;
					this.totalCount = res.data.totalCount
					this.tableData = []
					for (let i = 0; i < data.length; i++) {
						this.tableData.push({
							sortNum: data[i].no,
							cardNum: data[i].cardNumber,
							iccid: data[i].iccid,
							operator: data[i].netWork === 1 ? '移动' : data[i].netWork === 2 ? '联通' : '电信',
							flowPackage: data[i].packages,
//							packageType: translatePackages(data[i].packageType),
							flowUsage: !data[i].usageMonth ? 0 : parseFloat(data[i].usageMonth).toFixed(2) + 'MB',
							message: data[i].msgNo,
//							endTime: timestampToTime(data[i].endTime),
							endTime: data[i].endTime.split(' ')[0],
							cardStatus: data[i].onlineStatus === 1 ? '在线' :
								data[i].onlineStatus === 0 ? '离线' : '',
							deviceId: data[i].deviceId
						})
					}
					this.loading = false
				})
			},
			// 跳转到详情页
			goDetail(data) {
				let deviceId = data.deviceId
				this.$router.push({
					path: '/cardDetail',
					query: {
						deviceId: deviceId
					}
				})
//				console.log(data)
			},
			// 状态的下拉框的值发生变化的时候触发
			toggleStatus(val) {
				this.status = val;
				this.pageNo = 1;
				this.getTableData()
			},
			// 选择日期
			pickChange() {
				if (!this.timeValue) {
					this.beginTime = ''
					this.endTime = ''
					this.pageNo = 1
					this.getTableData();
					return
				}
				this.beginTime = format(new Date(this.timeValue[0]).getTime(), "Y-m-d")
				this.endTime = format(new Date(this.timeValue[1]).getTime(), "Y-m-d")
				this.pageNo = 1
				this.getTableData();
			},
			// 流量的排序
			sortChange(column, prop, order) {
				if (column.prop == 'flowUsage' && column.order == 'ascending') {
					this.sortData = 'usage_month'
					this.direct = column.order.substring(0, 3)
				} else if (column.prop == 'flowUsage' && column.order == 'descending') {
					this.sortData = 'usage_month'
					this.direct = column.order.substring(0, 4)
				}
				this.getTableData()
			},
			// 处理返回的套餐类型
			transformPackageType(i) {
				if (i == 1) {
					return '月'
				} else if (i == 2) {
					return '半年'
				} else if (i == 3) {
					return '季'
				} else {
					return '年'
				}
			},
			// 处理未使用
			getUnused(total, used) {
				if (total > used) {
					return total - used
				} else {
					return o
				}
			},
			// 处理已超出
			getExceeded(total, used) {
				if (total > used) {
					return 0
				} else {
					return used - total
				}
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	.flowPool-wrap {
		padding-top: 50px;
		padding-left: 200px;
		.content {
			width: 100%;
			height: calc(100vh - 50px);
			padding: 20px;
			overflow-y: scroll;
			/* 基本信息 */
			.base-info {
				width: 100%;
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				border-radius: 5px;
				margin-bottom: 20px;
				padding: 30px 0 0 0;
				.info-header {
					padding-left: 40px;
				}
				/* 基本信息的柱状图 */
				.info-content {
					width: 100%;
					padding-bottom: 30px;
					.no-more {
						font-size: 30px;
						color: #999;
						text-align: center;
					}
					/* 柱状图 */
					.chart-bar {
						.bar {
							canvas {
								height: 200 !important;
							}
						}
					}
					/* tips */
					.chart-tips {
						text-align: center;
						font-size: 20px;
						display: flex;
						justify-content: space-between;
						padding: 0 70px;
						/*span {
						  margin-right: 50px;
						}*/
					}
				}
			}
			/* 流量池表格 */
			.flow-table {
				width: 100%;
				padding: 30px 30px 40px 30px;
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				border-radius: 5px;
				.table-header {
					display: flex;
					/*flex-wrap: wrap;*/
					justify-content space-between
					/* 搜索框 */
					.search-box {
						width: 300px;
						height: 40px;
						border-radius: 5px
						border: 1px solid #dcdfe6;
						display: flex;
						justify-content: space-between;
						margin-right: 10px;
						margin-bottom: 30px;
						input {
							width: 100%;
							height: 100%;
							padding-left: 20px;
							font-size: 16px;
							color: #606266;
						}
						input:
						:-webkit-input-placeholder {
							color: #999;
						}
						.btn-search {
							width: 56px;
							height: 100%;
							line-height: 40px;
							border-left: 1px solid #dcdfe6;
							font-size: 24px;
							color: #cbcccd;
							text-align: center;
							cursor: pointer;
						}
					}
					/* 联动选择器 */
					.cascader {
						display: flex;
						.el-select {
							margin-right: 10px;
						}
						.el-select:last-child {
							margin-right: 0;
						}
						/* 地区运营商 */
						.area, .status, .system {
							position: relative;
							margin-right: 10px;
							.default {
								width: 200px;
								height: 50px;
								border-radius: 5px
								border: 1px solid #999;
								display: flex;
								justify-content: space-between;
								input {
									width: 100%;
									height: 100%;
									padding-left: 20px;
									font-size: 16px;
								}
								input:
								:-webkit-input-placeholder {
									color: #999999;
								}
								.btn-select {
									width: 56px;
									height: 100%;
									line-height: 50px;
									border-left: 1px solid #999;
									font-size: 24px;
									color: #656565;
									text-align: center;
									cursor: pointer;
								}
							}
							.options {
								width: 100%;
								background-color: #fff;
								border: 1px solid #999;
								border-radius: 5px;
								position: absolute;
								z-index: 999;
								left: 0;
								top: 55px;
								.options-item {
									width: 100%;
									height: 44px;
									line-height: 44px;
									border-bottom: 1px solid #999;
									padding-left: 20px;
									cursor: pointer;
									font-size: 16px;
									color: #666666;
								}
								.options-item:hover {
									background-color: #eee;
								}
								.options-item:last-child {
									border-bottom: none;
								}
							}
						}
						.system {
							margin-right: 0;
						}
					}
					/* 时间查询 */
					.time-inquire {
						line-height: 40px;
						display: flex;
						span {
							font-size: 16px;
						}
						.btn-inquire {
							width: 90px;
							height: 40px;
							line-height: 40px;
							border: 1px solid #999;
							border-radius: 5px;
							text-align: center;
							cursor: pointer;
							font-size: 16px;
							margin-left: 40px;
						}
					}
				}
				.table-box {
					/*margin-top: 40px;*/
					.more {
						cursor: pointer;
						color: mainBlue;
					}
					.el-pagination {
						text-align: center;
						margin-top: 40px;
					}
				}
			}
		}
	}
</style>


