<template>
	<div class="packageInfo-wrap wrap">
		<div class="content wrap-content">
			<!-- 标题 -->
			<div class="page-title">
				<div class="line"></div>
				<span>套餐信息</span>
			</div>
			<!-- 表格数据 -->
			<div class="card"
			     v-loading="loading"
			     element-loading-text="正在加载数据，请稍侯">
				<!-- 工具栏 -->
				<div class="tools">
					<!-- 筛选框和搜索按钮 -->
					<div class="search">
						<!-- 运营商 -->
						<div class="net-work">
							<span>运营商: </span>
							<el-select class="select"
							           placeholder="全部"
							           clearable
							           v-model="tools.netWork">
								<el-option
										v-for="item in tools.netWorkOptions"
										:key="item.value"
										:label="item.netWork"
										:value="item.value">
								</el-option>
							</el-select>
						</div>
						<!-- 制式 -->
						<div class="netWork-type">
							<span>制式: </span>
							<el-select class="select"
							           placeholder="全部"
							           clearable
							           v-model="tools.netWorkType">
								<el-option
										v-for="item in tools.netWorkTypeOptions"
										:key="item.value"
										:label="item.netWorkType"
										:value="item.value">
								</el-option>
							</el-select>
						</div>
						<!-- 批次日期 -->
						<div class="batch-time">
							<span>批次日期: </span>
							<el-date-picker
									v-model="tools.startTime"
									@change="pickChange"
									class="timePicker"
									type="date"
									placeholder="开始日期">
							</el-date-picker>
							&nbsp; 至 &nbsp;
							<el-date-picker
									v-model="tools.endTime"
									@change="pickChange"
									class="timePicker"
									type="date"
									placeholder="结束日期">
							</el-date-picker>
						</div>
						<!-- 搜索按钮 -->
						<div class="btn-search btn-main" @click="btnSearch">搜索</div>
					</div>
					<!-- 套餐变更按钮 -->
					<div class="btn-packageChange btn-main" @click="changePackage">套餐变更</div>
				</div>
				<!-- 表格 -->
				<div class="table-box">
					<el-table
							:data="tableData"
							@sort-change='sortChange'
							highlight-current-row
							@row-click = "showRow"
							border
							style="width: 100%">
						<el-table-column label="选择" width="70" align="center">
							<template slot-scope="scope">
								<el-radio class="radio"
								          v-model="radio"
								          :label="scope.$index"
								          @change.native="getCurrentRow(scope.row)"></el-radio>
							</template>
						</el-table-column>
						<el-table-column prop="batchTime" label="批次日期" align="center"></el-table-column>
						<el-table-column prop="packageFlow" sortable='custom' label="套餐流量" align="center"></el-table-column>
						<el-table-column prop="packageType" label="套餐类型" align="center"></el-table-column>
						<el-table-column prop="netWork" label="运营商" align="center"></el-table-column>
						<el-table-column prop="netWorkType" label="制式" align="center"></el-table-column>
						<el-table-column prop="totalCard" label="总卡数" align="center"></el-table-column>
						<el-table-column prop="active" label="已激活" align="center"></el-table-column>
						<el-table-column prop="online" label="设备在线数" align="center"></el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<span class="more" @click="goDetail(scope.row)">卡片信息</span>
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
	import {translatePackages,getNetWork,translateSystem} from '../api/dataUtil'
	export default {
		data() {
			return {
				// 表格工具栏
				tools: {
					// 运营商
					netWork: '',
					netWorkOptions: [
						{
							value: '1',
							netWork: '移动'
						},
						{
							value: '2',
							netWork: '联通'
						},
						{
							value: '3',
							netWork: '电信'
						}
					],
					// 制式
					netWorkType: '',
					netWorkTypeOptions: [
						{
							value: '1',
							netWorkType: '5G'
						},
						{
							value: '2',
							netWorkType: '4G'
						},
						{
							value: '3',
							netWorkType: '3G'
						},
						{
							value: '4',
							netWorkType: '2G'
						},
						{
							value: '5',
							netWorkType: 'NB'
						},
						{
							value: '6',
							netWorkType: 'EMTC'
						}
					],
					// 批次日期
					startTime: '',
					endTime: '',
				},
				// 表格数据
				tableData: [],
				// 表格分页
				totalCount: 0,
				pageSize: 20,
				pageNo: 1,
				// 表格流量排序
				sortData: '',
				direct: '',
				// 加载
				loading: '',
				radio: '',
				// 当前选中的项
				currentSelect: '',
				selectedType: ''
			};
		},
		mounted() {
			this.getTableData()
		},
		created() {

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
				this.pageNo = 1;
				this.getTableData()
			},
			// 获取到套餐信息列表
			getTableData() {
				this.loading = true
				this.$axios({
					url: '/ucenterDevice/packageInfoList',
					method: 'post',
					params: {
						pageSize: this.pageSize,
						pageNo: this.pageNo,
						// 运营商
						netWork: this.tools.netWork,
						// 制式
						netWorkType: this.tools.netWorkType,
						// 批次日期
						start: this.tools.startTime,
						end: this.tools.endTime,


						// 排序
						sort: this.sortData,
						direct: this.direct
					}
				}).then(res => {
					this.tableData = []
					let data = res.data.data;
					console.log(data)
					if(res.data.code == 1) {
						this.loading = false
						this.totalCount = res.data.totalCount
						for(let i=0; i<data.length; i++) {
							this.tableData.push({
								batchTime: data[i].serveTime.split(' ')[0],
								packageFlow: this.packageFlow(data[i].dataSize,data[i].netWork,data[i].netWorkType),
								packageType: translatePackages(data[i].packageType),
								netWork: getNetWork(data[i].netWork),
								netWorkType: translateSystem(data[i].netWorkType),
								totalCard: data[i].totalCard,
								active: data[i].acticeCardCount,
								online: data[i].onlineCount,
								originalNetWork: data[i].netWork,
								originalNetWorkType: data[i].netWorkType,
								poolId: data[i].poolId
							})
						}
					}
				})
			},

			showRow(row){
				//赋值给radio
				this.radio = this.tableData.indexOf(row);
				this.currentSelect = row.batchTime
				this.selectedType = row.packageType

//				console.log(row)
			},
			getCurrentRow(data){
				console.log(data)
				this.currentSelect = data.batchTime
				this.selectedType = data.packageType
			},
			// 选择日期
			pickChange() {
				if (!this.tools.startTime && !this.tools.endTime) {
					this.tools.startTime = ''
					this.tools.endTime = ''
					this.pageNo = 1
					return
				}
				this.tools.startTime = format(new Date(this.tools.startTime).getTime(), "Y-m-d")
				this.tools.endTime = format(new Date(this.tools.endTime).getTime(), "Y-m-d")
				this.pageNo = 1
			},
			// 搜索按钮
			btnSearch() {
				if(!this.tools.startTime && this.tools.endTime) {
					this.$message.info('批次日期的开始和结束日期都要选择')
				}else if(this.tools.startTime && !this.tools.endTime) {
					this.$message.info('批次日期的开始和结束日期都要选择')
				}else if(this.tools.startTime > this.tools.endTime) {
					this.$message.info('开始日期不能大于结束日期')
				}else {
					this.getTableData()
				}
			},
			// 跳转到套餐变更页面
			changePackage() {
				if(!this.currentSelect) {
					this.$message.info('请先选择一个套餐')
					return
				}else if(this.selectedType != '月') {
					this.$message.info('当前选择的套餐不可变更')
					return
				}
				this.$router.push({
					path: '/packageChange',
					query: {
						batchTime: this.currentSelect
					}
				})
			},
			// 跳转到卡片信息页面
			goDetail(data) {
				let batchTime = data.batchTime
				let netWork = data.originalNetWork
				let netWorkType = data.originalNetWorkType
				let poolId = data.poolId
				this.$router.push({
					path: '/packageInfoCard',
					query: {
						batchTime: batchTime,
						netWork: netWork,
						netWorkType: netWorkType,
						poolId: poolId
					}
				})
			},
			// 流量的排序
			sortChange(column, prop, order) {
				if (column.prop == 'packageFlow' && column.order == 'ascending') {
					this.sortData = 'p.data_size'
					this.direct = column.order.substring(0, 3)
				} else if (column.prop == 'packageFlow' && column.order == 'descending') {
					this.sortData = 'p.data_size'
					this.direct = column.order.substring(0, 4)
				}
				this.pageNo = 1
				this.getTableData()
			},
			// 套餐流量
			packageFlow(dataSize,netWork,netWorkType) {
				if(netWork == 3 && netWorkType == 5) {
					return dataSize + '次'
				}else if (dataSize < 1000) {
					return dataSize + 'M'
				} else {
					return (dataSize / 1024) + 'G'
				}
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #1d9eed;
	mainButton = #4cb2ff;
	.packageInfo-wrap {
		.content {
			/* 表格数据 */
			.card {
				background-color: #fff;
				border-radius: 20px;
				margin-top: 20px;
				padding: 25px 50px;
				/* 工具栏 */
				.tools {
					/* 筛选框和搜索按钮 */
					.search {
						display: flex;
						flex-wrap: wrap;
						/* 卡号或iccid */
						.card-iccid {
							display: flex;
							margin-right: 40px;
							.select {
								width: 130px;
								margin-right: 10px;
							}
							.input {
								width: 200px;
							}
							span {
								line-height: 40px;
								margin: 0 10px;
							}
						}
						/* 在线状态、激活状态、制式 */
						.net-work, .netWork-type, .batch-time {
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
					}
					/* 套餐变更按钮 */
					.btn-packageChange {
						margin-top: 30px;
					}
				}
				/* 表格 */
				.table-box {
					margin-top: 40px;
					.more, .remark {
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
<style lang="stylus">
	.cell {
		.radio {
			display: flex;
			justify-content: center;
			.el-radio__label {
				display: none;
			}
		}
	}
</style>