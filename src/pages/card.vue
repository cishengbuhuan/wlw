<template>
	<div class="card-wrap">
		<div class="content">
			<!-- 今日卡况 -->
			<div class="card-info">
				<div class="info-title"><i class="line"></i>今日卡况</div>
				<div class="info-box">
					<!-- 总卡数 -->
					<div class="info-item total">
						<span><i></i>总卡数</span>
						<div class="num">
							{{ cardInfo.total }}
						</div>
					</div>
					<!-- 在线数 -->
					<div class="info-item online">
						<span><i></i>在线数</span>
						<div class="num">
							{{ cardInfo.online }}
						</div>
					</div>
					<!-- 离线数 -->
					<div class="info-item offline">
						<span><i></i>离线数</span>
						<div class="num">
							{{ cardInfo.offline }}
						</div>
					</div>
					<!-- 欠费数 -->
					<div class="info-item arrears">
						<span><i></i>欠费数</span>
						<div class="num">
							{{ cardInfo.arrears }}
						</div>
					</div>
					<!-- 沉默数 -->
					<div class="info-item silence">
						<span><i></i>沉默数</span>
						<div class="num">
							{{ cardInfo.silence }}
						</div>
					</div>
				</div>
			</div>
			<!-- 流量池表格 -->
			<div class="flow-table">
				<div class="table-header">
					<!-- 搜索框 -->
					<div class="search-box">
						<input type="text" placeholder="请输入ICCID或者卡号" v-model="numVal">
						<div class="btn-search" @click="getTableData"><i class="el-icon-search"></i></div>
					</div>
					<!-- 联动选择器 -->
					<div class="cascader">
						<el-select v-model="statusValue"
						           clearable
						           @change="toggleStatus"
						           placeholder="请选择状态">
							<el-option
									v-for="item in selectData.statusOptions"
									:key="item.value"
									:label="item.status"
									:value="item.value">
							</el-option>
						</el-select>
						<!-- 种类 -->
						<el-select v-model="systemValue"
						           clearable
						           @change="toggleSystem"
						           placeholder="请选择种类">
							<el-option
									v-for="item in selectData.systemOptions"
									:key="item.value"
									:label="item.system"
									:value="item.value">
							</el-option>
						</el-select>
					</div>
					<!-- 时间查询 -->
					<div class="time-inquire">
						<span>时间：</span>
						<el-date-picker
								v-model="timeValue"
								@change="pickChange"
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
				<div class="table-box">
					<el-table
							:data="tableData"
							@sort-change='sortChange'
							border
							style="width: 100%">
						<el-table-column prop="sortNum" label="序号" align="center"></el-table-column>
						<el-table-column prop="cardNum" label="卡号" align="center"></el-table-column>
						<el-table-column prop="iccid" label="ICCID" align="center"></el-table-column>
						<el-table-column prop="operator" label="运营商" align="center"></el-table-column>
						<el-table-column prop="flowPackage" label="流量池套餐" width='70' align="center"></el-table-column>
						<el-table-column prop="message" label="短信(已使用)" align="center"></el-table-column>
						<el-table-column prop="flowUsage" width="90" sortable='custom' label="本月已使用流量"
						                 align="center"></el-table-column>
						<el-table-column prop="flowOverage" sortable='custom' label="本月剩余流量"
						                 align="center"></el-table-column>
						<el-table-column prop="startTime" label="计费时间" width='100' align="center"></el-table-column>
						<el-table-column prop="endTime" label="到期时间" width='100' align="center"></el-table-column>
						<el-table-column prop="cardKind" label="卡种类" align="center"></el-table-column>
						<el-table-column prop="system" label="制式" align="center"></el-table-column>
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
	import {timestampToTime, format} from '../api/dataUtil'

	export default {
		data() {
			return {
				totalCount: 0,
				pageSize: 20,
				pageNo: 1,
				areaValue: '',
				statusValue: '',
				systemValue: '',
				cardInfo: {
					total: '',
					online: '',
					offline: '',
					arrears: '',
					silence: ''
				},
				// 联动选择的数据
				selectData: {
					// 状态
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
					// 制式
					systemOptions: [
						{
							value: '1',
							system: '大卡'
						},
						{
							value: '2',
							system: '双切micro'
						},
						{
							value: '3',
							system: '三切nano'
						},
						{
							value: '4',
							system: '2*2贴片'
						},
						{
							value: '5',
							system: '5*6贴片'
						},
						{
							value: '6',
							system: 'eSim'
						},
						{
							value: '7',
							system: 'NB'
						},
						{
							value: '8',
							system: '其他'
						}
					]
				},
				timeValue: '',
				tableData: [],
				numVal: '',
				beginTime: '',
				endTime: '',
				netWork: '',
				status: '',
				netWorkType: '',
				defaultNetWork: '',
				defaultStatus: '',
				defaultNetWorkType: '',
				// 表格流量排序
				sortData: '',
				direct: ''
			};
		},
		mounted() {
			this.getAllDeviceStatus()
			this.getTableData()
		},
		methods: {
			// 获取今日卡况的数据
			getAllDeviceStatus() {
				this.$axios({
					url: '/api/v2/device/getAllDeviceStatus',
					method: 'post'
				}).then(res => {
					let data = res.data.data;
					this.cardInfo.total = data.totalCard
					this.cardInfo.online = data.activeNo
					this.cardInfo.offline = data.stopNo
					this.cardInfo.arrears = data.debetNo
					this.cardInfo.silence = data.unactiveNo
				})
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
//                        area: this.netWork ? this.netWork : this.defaultNetWork,
						status: this.status ? this.status : this.defaultStatus,
						netWorkType: this.netWorkType ? this.netWorkType : this.defaultNetWorkType,
						startTime: this.beginTime,
						endTime: this.endTime,
						sort: this.sortData,
						direct: this.direct
					}
				}).then(res => {
					console.log(res.data)
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
							message: data[i].msgNo,
							flowUsage: data[i].usageMonth.toFixed(2) + 'M',
							flowOverage: data[i].flowOverage.toFixed(2) + 'M',
							startTime: timestampToTime(data[i].chargeTime),
							endTime: timestampToTime(data[i].endTime),
							cardKind: data[i].cardType === 1 ? '大卡' :
								data[i].cardType === 2 ? '双切' :
									data[i].cardType === 3 ? '三切' :
										data[i].cardType === 4 ? '2*2' :
											data[i].cardType === 5 ? '5*6' :
												data[i].cardType === 6 ? 'eSim' : '其他',
							system: data[i].networkType === 1 ? '5G' :
								data[i].networkType === 2 ? '4G' :
									data[i].networkType === 3 ? '3G' :
										data[i].networkType === 4 ? '2G' :
											data[i].networkType === 5 ? 'NB' :
												data[i].networkType === 6 ? 'EMTC' : '',
							cardStatus: data[i].onlineStatus === 1 ? '在线' :
								data[i].onlineStatus === 0 ? '离线' : '',
							deviceId: data[i].deviceId
						})
					}
				})
			},
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
			// 选择日期
			pickChange() {
				if (!this.timeValue) {
					this.beginTime = ''
					this.endTime = ''
					this.getTableData();
					return
				}
				this.beginTime = format(new Date(this.timeValue[0]).getTime(), "Y-m-d")
				this.endTime = format(new Date(this.timeValue[1]).getTime(), "Y-m-d")
				this.getTableData();
			},
			// 状态 的下拉框的值发生变化的时候触发
			toggleStatus(val) {
				this.status = val;
				this.pageNo = 1
				this.getTableData()
			},
			// 制式 的下拉框的值发生变化的时候触发
			toggleSystem(val) {
				this.netWorkType = val;
				this.pageNo = 1
				this.getTableData()
			},
			// 流量的排序
			sortChange(column, prop, order) {
				if (column.prop == 'flowUsage' && column.order == 'ascending') {
					this.sortData = 'usage_month'
					this.direct = column.order.substring(0, 3)
				} else if (column.prop == 'flowUsage' && column.order == 'descending') {
					this.sortData = 'usage_month'
					this.direct = column.order.substring(0, 4)
				} else if (column.prop == 'flowOverage' && column.order == 'ascending') {
					this.sortData = 'usage_month'
					this.direct = 'desc'
				} else if (column.prop == 'flowOverage' && column.order == 'descending') {
					this.sortData = 'usage_month'
					this.direct = 'asc'
				}
				this.getTableData()
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
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	.card-wrap {
		padding-top: 50px;
		padding-left: 200px;
		.content {
			width: 100%;
			height: calc(100vh - 50px);
			padding: 20px;
			overflow-y: scroll;
			/* 今日卡况 */
			.card-info {
				width: 100%;
				height: 226px;
				border: 1px solid #ddd;
				border-radius: 5px;
				padding: 25px 52px 0;
				margin-bottom: 20px;
				.info-title {
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
				.info-box {
					display: flex;
					justify-content: space-around;
					text-align: center;
					margin-top: 30px;
					.info-item {
						span {
							font-size: 22px;
							display: flex;
							i {
								display: block;
								width: 14px;
								height: 14px;
								border-radius: 50%;
								margin: 7px 10px 0 0;
								background-color: mainBlue;
							}
						}
						.num {
							font-size: 32px;
							margin-top: 20px;
						}
					}
					/* 总卡数 */
					.total {
						span {
							i {
								background-color: mainBlue;
							}
						}
					}
					/* 在线数 */
					.online {
						span {
							i {
								background-color: #72ff4c;
							}
						}
					}
					/* 离线数 */
					.offline {
						span {
							i {
								background-color: #ff4c59;
							}
						}
					}
					/* 欠费数 */
					.arrears {
						span {
							i {
								background-color: #ff0012;
							}
						}
					}
					/* 沉默数 */
					.silence {
						span {
							i {
								background-color: #999999;
							}
						}
					}
				}
			}
			/* 流量池表格 */
			.flow-table {
				width: 100%;
				padding: 30px 30px 40px 30px;
				border: 1px solid #ddd;
				border-radius: 5px;
				.table-header {
					display: flex;
					flex-wrap: wrap;
					/*justify-content space-between*/
					/* 搜索框 */
					.search-box {
						width: 400px;
						height: 40px;
						border-radius: 5px
						border: 1px solid #dcdfe6;
						display: flex;
						justify-content: space-between;
						margin-right: 60px;
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
							margin-right: 60px;
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
					margin-top: 40px;
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


