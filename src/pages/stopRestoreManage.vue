<template>
	<div class="stopRestoreManage-wrap wrap">
		<div class="content wrap-content">
			<!-- 标题 -->
			<div class="page-title">
				<div class="line"></div>
				<span>流量卡停复管理</span>
			</div>
			<!-- 表格数据 -->
			<div class="card">
				<!-- 工具栏 -->
				<div class="tools">
					<!-- 筛选框和搜索按钮 -->
					<div class="search">
						<!-- 操作时间 -->
						<div class="operate-time">
							<span>操作时间: </span>
							<el-date-picker
									v-model="tools.startTime"
									@change="pickChange"
									class="timePicker"
									type="datetime"
									placeholder="开始时间">
							</el-date-picker>
							&nbsp; 至 &nbsp;
							<el-date-picker
									v-model="tools.endTime"
									@change="pickChange"
									class="timePicker"
									type="datetime"
									placeholder="结束时间">
							</el-date-picker>
						</div>
						<!-- 操作类型 -->
						<div class="operate-type">
							<span>操作类型: </span>
							<el-select class="select"
							           placeholder="全部"
							           clearable
							           v-model="tools.operateType">
								<el-option
										v-for="item in tools.operateTypeOptions"
										:key="item.value"
										:label="item.operateType"
										:value="item.value">
								</el-option>
							</el-select>
						</div>
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
						<!-- 搜索按钮 -->
						<div class="btn-search btn-main" @click="btnSearch">搜索</div>
					</div>
					<!-- 停卡、复卡按钮 -->
					<div class="btn-operate">
						<div class="btn-stop btn-gray" @click="cardOperate(0)">停卡</div>
						<div class="btn-restore btn-main" @click="cardOperate(1)">复卡</div>
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
						<el-table-column prop="operateTime" width="220" label="操作时间" align="center"></el-table-column>
						<el-table-column prop="operateType" label="操作类型" align="center"></el-table-column>
						<el-table-column prop="netWork" label="运营商" align="center"></el-table-column>
						<el-table-column prop="needChange" label="需变更卡数" align="center"></el-table-column>
						<el-table-column prop="changeSuccess" label="变更成功" align="center"></el-table-column>
						<el-table-column prop="changeFailure" label="变更失败" align="center"></el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<span class="more" @click="goDetail(scope.row)">变更详情</span>
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
	import {getNetWork,format} from '../api/dataUtil'
	export default {
		data() {
			return {
				// 表格工具栏
				tools: {
					// 操作时间
					startTime: '',
					endTime: '',
					// 操作类型
					operateType: '',
					operateTypeOptions: [
						{
							value: '1',
							operateType: '停卡'
						},
						{
							value: '2',
							operateType: '复卡'
						}
					],
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
					]
				},
				// 
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
			this.getTableData()
		},
		created() {

		},
		methods: {
			// 获取到表格数据
			getTableData() {
				this.loading = true
				this.$axios({
					url: '/pauseActiveCard/activeAndPauseList',
					method: 'post',
					params: {
						pageSize: this.pageSize,
						pageNo: this.pageNo,
						startTime: this.tools.startTime,
						endTime: this.tools.endTime,
						type: this.tools.operateType,
						netWork: this.tools.netWork
					}
				}).then(res => {
					let data = res.data.data
//					console.log(data)

					this.totalCount = res.data.totalCount
					this.tableData = []
					for(let i=0; i<data.length; i++) {
						this.tableData.push({
							operateTime: data[i].createTime,
							operateType: data[i].type == 1 ? '复卡' : '停卡',
							netWork: getNetWork(data[i].netWork),
							needChange: data[i].totalCard,
							changeSuccess: data[i].successCard,
							changeFailure: data[i].failCard,
							id: data[i].id
						})
					}
					this.loading = false
				})
			},
			// 改变当前页数
			changePageNo(val) {
				this.pageNo = val;
			},
			// 改变每页显示的条数
			changeSize(val) {
				this.pageSize = val;
			},

			// 搜索按钮
			btnSearch() {
				if(!this.tools.startTime && this.tools.endTime) {
					this.$message.info('操作时间的开始和结束时间都要选择')
				}else if(this.tools.startTime && !this.tools.endTime) {
					this.$message.info('操作时间的开始和结束时间都要选择')
				}else if(this.tools.startTime > this.tools.endTime) {
					this.$message.info('开始时间不能大于结束时间')
				}else {
					this.getTableData()
				}
			},

			// 选择日期
			pickChange() {
				if (!this.tools.startTime && !this.tools.endTime) {
					this.tools.startTime = ''
					this.tools.endTime = ''
					this.pageNo = 1
					return
				}
				this.tools.startTime = format(new Date(this.tools.startTime).getTime(), "Y-m-d H:m:s")
				this.tools.endTime = format(new Date(this.tools.endTime).getTime(), "Y-m-d H:m:s")
				this.pageNo = 1
			},

			// 跳转到变更详情页面
			goDetail(data) {
				let id = data.id
				this.$router.push({
					path: '/stopRestoreDetail',
					query: {
						id: id
					}
				})
			},
			// 跳转到停复卡页面
			cardOperate(i) {
				this.$router.push({
					path: '/cardOperate',
					query: {
						operateType: i
					}
				})
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #1d9eed;
	mainButton = #4cb2ff;
	.stopRestoreManage-wrap {
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
						/* 操作时间、操作类型、运营商 */
						.operate-time, .operate-type, .net-work {
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
								width: 220px;
							}
						}
					}
					/* 停卡、复卡按钮 */
					.btn-operate {
						display: flex;
						margin-top: 30px
						.btn-restore {
							margin-left: 25px;
						}
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