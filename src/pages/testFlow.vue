<template>
	<div class="yd-flowPool-wrap wrap">
		<div class="content wrap-content">
			<!-- 基本信息 -->
			<div class="base-info">
				<div class="info-header">
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
				<!-- 基本信息的饼图 -->
				<div class="info-chart">
					<div class="no-more" v-if="noPoolId">
						没有相关数据
					</div>
					<!-- 饼图 -->
					<div class="chart" v-if="!noPoolId">
						<div class="chart-item">
							<ve-ring :data="baseInfo.usageData" :colors="usageColors" :settings="baseSettings"
							         :extend="baseExtend"></ve-ring>
						</div>
						<div class="chart-item">
							<ve-ring :data="baseInfo.alarmData" :colors="alarmColors" :settings="baseSettings"
							         :extend="alarmExtend"></ve-ring>
						</div>
					</div>
					<!-- tips -->
					<div class="chart-tips" v-if="!noPoolId">
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
						<!-- 地区运营商 -->
						<!--<el-select v-model="areaValue"-->
						<!--placeholder="请选择地区">-->
						<!--<el-option-->
						<!--v-for="item in selectData.areaOptions"-->
						<!--:key="item.value"-->
						<!--:label="item.area"-->
						<!--:value="item.value">-->
						<!--</el-option>-->
						<!--</el-select>-->
						<!-- 状态 -->
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
						<!-- 制式 -->
						<!--<el-select v-model="systemValue"-->
						<!--placeholder="请选择制式">-->
						<!--<el-option-->
						<!--v-for="item in selectData.systemOptions"-->
						<!--:key="item.value"-->
						<!--:label="item.system"-->
						<!--:value="item.value">-->
						<!--</el-option>-->
						<!--</el-select>-->
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
							style="width: 100%">
						<el-table-column prop="sortNum" width='100' label="序号" align="center"></el-table-column>
						<el-table-column prop="cardNum" label="卡号" align="center"></el-table-column>
						<el-table-column prop="iccid" label="iccid" align="center"></el-table-column>
						<el-table-column prop="operator" label="运营商" align="center"></el-table-column>
						<el-table-column prop="flowPackage" label="流量池套餐" align="center"></el-table-column>
						<!--<el-table-column prop="packageType" label="套餐类型" align="center"></el-table-column>-->
						<el-table-column prop="flowUsage" sortable='custom' width='150' label="本月已使用流量" align="center"></el-table-column>
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
	import VeRing from "v-charts/lib/ring.common";
	import {timestampToTime, format, translatePackages} from '../api/dataUtil'
	import router from 'vue-router'

	export default {
		components: {
			VeRing
		},
		data() {
			this.usageColors = ['#bbbbbb', '#4cb2ff', '#da2627']
			this.alarmColors = ['#4cb2ff', '#e3a51e', '#da2627']
			this.baseSettings = {
				label: {
					show: false
				},
				radius: ['120','80'],
				offsetY: 150
			}

			this.baseExtend = {
				legend: {
					orient: 'vertical',
					align: 'center',
					top: 100,
					left: 0,
					itemWidth: 11,
					itemHeight: 11,
					textStyle: {
						borderRadius: '50%',
						padding: [0, 0, 0, 70],
					}
				},
				tooltip : {
					trigger: 'item',
					formatter: "{b}:{c}M"
				},
			}
			this.alarmExtend = {
				legend: {
					orient: 'vertical',
					align: 'center',
					top: 100,
					left: 0,
					itemWidth: 11,
					itemHeight: 11,
					textStyle: {
						borderRadius: '50%',
						padding: [0, 0, 0, 70],
					}
				},
				tooltip : {
					trigger: 'item',
					formatter: "{b}:{c}个"
				},
			}
			return {
				noPoolId: false,
				packageTypeValue: '',
				packageValue: '',
				defaultPoolId: '',
				defaultPackageType: '',
				poolId: '',
				packageType: '',
				// 筛选的套餐
				packageOptions: [],
				// 套餐类型的筛选
				packageTypeOptions: [],
				// 饼状图数据
				baseInfo: {
					totalFlow: 0,
					singleFlow: 0,
					usageRate: '',
					overview: 0,
					warnNumber: 0,
					alarmCardNumber: 0,
					usageData: {
						columns: ['usage', 'number'],
						rows: []
					},
					alarmData: {
						columns: ['usage', 'number'],
						rows: []
					}
				},
				totalCount: 0,
				pageSize: 20,
				pageNo: 1,
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
				netWork: ''
			};
		},
		beforeRouteUpdate(to, from, next) {
			next()
			this.typeChange()
		},
		mounted() {
			this.getPackageOptions();
			this.typeChange()
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
			// 改变type的类型，即跳转不同的路由
			typeChange() {
				let type = this.$route.params.type
				this.netWork = this.$route.params.type
				this.timeValue = '';
				this.beginTime = '';
				this.endTime = '';
				this.numVal = '';
				this.defaultPoolId = '';
				this.packageValue = '';
				this.packageOptions = []
				this.tableData = []

				this.getPackageOptions(type);
				this.getPieUsage(type);
				this.getPieAlarm(type);
				this.getTableData(type)
				this.getPieTips(type)
				this.getAlarmTips(type)
			},
			// 获取到套餐选项 和 套餐类型
			getPackageOptions(type) {
				this.$axios({
					url: '/api/v2/pool/poolList',
					method: 'post',
					params: {
						netWork: type
					}
				}).then(res => {
					let data = res.data.data.poolList;
					let dataType = res.data.data.packageType
					// 套餐
					this.packageOptions = []
					this.packageValue = data[0].name
					this.defaultPoolId = data[0].poolId
					for (let i = 0; i < data.length; i++) {
						this.packageOptions.push({
							value: data[i].poolId,
							flowPackage: data[i].name
						})
					}

					// 套餐的类型
					this.packageTypeOptions = []
					this.packageTypeValue = dataType[0].packageType === 1 ? '月' :
						dataType[0].packageType === 2 ? '半年' :
							dataType[0].packageType === 3 ? '季' :
								dataType[0].packageType === 4 ? '年' : ''
					this.defaultPackageType = dataType[0].packageType
					for (let i = 0; i < dataType.length; i++) {
						this.packageTypeOptions.push({
							value: dataType[i].packageType,
							typePackage: dataType[i].packageType === 1 ? '月' :
								dataType[i].packageType === 2 ? '半年' :
									dataType[i].packageType === 3 ? '季' :
										dataType[i].packageType === 4 ? '年' : ''
						})
					}
//					console.log(this.packageTypeOptions)
					this.getPieTips();
					this.getAlarmTips();
					this.getPieUsage();
					this.getPieAlarm();
					this.getTableData();
				})
			},
			// 获取到饼状图下到相关信息
			getPieTips() {
				let poolId = this.poolId ? this.poolId : this.defaultPoolId;
				let packageType = this.packageType ? this.packageType : this.defaultPackageType;
				if(poolId === ''){
					this.noPoolId = true;
					return
				}
				this.noPoolId = false;
				this.$axios({
					url: '/api/v2/pool/poolUsage',
					method: 'post',
					params: {
						poolId: poolId,
						packageType: packageType
					}
				}).then(res => {
					let data = res.data.data;
					// 总流量
					this.baseInfo.totalFlow = data.total
					// 单卡流量
					this.baseInfo.singleFlow = data.dataSize
					// 使用率
					this.baseInfo.usageRate = parseFloat(data.usage).toFixed(2)
				})
			},
			getAlarmTips() {
				let poolId = this.poolId ? this.poolId : this.defaultPoolId;
				let packageType = this.packageType ? this.packageType : this.defaultPackageType;
				if(poolId === ''){
					this.noPoolId = true;
					return
				}
				this.noPoolId = false;
				this.$axios({
					url: '/api/v2/pool/poolCardWarning',
					method: 'post',
					params: {
						poolId: poolId,
						packageType: packageType
					}
				}).then(res => {
					let data = res.data.data;

					// 已超出
					this.baseInfo.overview = data.over
					// 预警数
					this.baseInfo.warnNumber = data.warn
					// 报警卡数
					this.baseInfo.alarmCardNumber = data.alarm
				})

			},
			// 获取到使用信息
			getPieUsage() {
				let poolId = this.poolId ? this.poolId : this.defaultPoolId;
				let packageType = this.packageType ? this.packageType : this.defaultPackageType;
				if(poolId === ''){
					this.noPoolId = true;
					return
				}
				this.$axios({
					url: '/api/v2/pool/poolUsageChart',
					method: 'post',
					params: {
						poolId: poolId,
						packageType: packageType
					}
				}).then(res => {
					let data = res.data.data;
					this.baseInfo.usageData.rows = []
					for (let i = 0; i < data.length; i++) {
						this.baseInfo.usageData.rows.push({
							usage: data[i].usage,
							number: data[i].number
						})
					}
				})
			},
			// 获取到预警图表
			getPieAlarm() {
				let poolId = this.poolId ? this.poolId : this.defaultPoolId;
				let packageType = this.packageType ? this.packageType : this.defaultPackageType;
				if(poolId === ''){
					this.noPoolId = true;
					return
				}
				this.$axios({
					url: '/api/v2/pool/poolCardWarningChart',
					method: 'post',
					params: {
						poolId: poolId,
						packageType: packageType
					}
				}).then(res => {
					let data = res.data.data;
					this.baseInfo.alarmData.rows = []
					for (let i = 0; i < data.length; i++) {
						this.baseInfo.alarmData.rows.push({
							usage: data[i].usage,
							number: data[i].number
						})
					}
				})
			},
			// 基本信息的下拉框的值发生变化的时候触发
			packageChange(val) {
				this.poolId = val;
				this.getPieTips();
				this.getAlarmTips();
				this.getPieUsage();
				this.getPieAlarm();
				this.getTableData()
			},
			// 套餐类型下拉框的值发生变化的时候触发
			packageTypeChange(val){
				this.packageType = val;
				this.getPieTips();
				this.getAlarmTips();
				this.getPieUsage();
				this.getPieAlarm();
				this.getTableData()
			},
			// 获取表格 数据
			getTableData() {
				let reg = /.*[\u4e00-\u9fa5]+.*$/;
				if (reg.test(this.numVal)) {
					this.$message({
						type: 'info',
						message: '请输入正确的卡号或ICCID'
					});
					return
				}
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
						cardPackage: this.packagesTypeValue
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
							flowUsage: !data[i].usageMonth ? 0 : parseFloat(data[i].usageMonth).toFixed(2)+'MB',
							message: data[i].msgNo,
//							endTime: timestampToTime(data[i].endTime),
							endTime: data[i].endTime.split(' ')[0],
							cardStatus: data[i].onlineStatus === 1 ? '在线' :
								data[i].onlineStatus === 0 ? '离线' : '',
							deviceId: data[i].deviceId
						})
					}
				})
			},
			// 跳转到详情页
			goDetail(data) {
				let deviceId = data.deviceId
				this.$router.push({
					path:'/cardDetail',
					query:{
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
				if (this.timeValue == '') {
					this.beginTime = ''
					this.endTime = ''
					return
				}
				this.beginTime = format(new Date(this.timeValue[0]).getTime(), "Y-m-d")
				this.endTime = format(new Date(this.timeValue[1]).getTime(), "Y-m-d")
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
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	.yd-flowPool-wrap {
		.content {
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
				.info-chart {
					width: 100%;
					padding-bottom: 30px;
					.no-more {
						font-size: 30px;
						color: #999;
						text-align: center;
					}
					/* 饼图 */
					.chart {
						display: flex;
						.chart-item {
							flex: 1;
							text-align: center;
						}
					}
					/* tips */
					.chart-tips {
						text-align: center;
						font-size: 20px;
						display: flex;
						justify-content: space-between;
						padding: 0 70px;
						margin-top: -100px;
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


