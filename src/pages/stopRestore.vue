<template>
	<div class="stopRestore-wrap">
		<div class="content">
			<!-- 流量卡断复网详情 -->
			<div class="stop-restore">
				<div class="tips"><i class="line"></i>流量卡断复网详情</div>
				<div class="search-box">
					<!-- 工具栏 -->
					<div class="tools">
						<!-- 操作时间 -->
						<div class="date">
							<span>操作时间: </span>
							<el-date-picker
									v-model="operateTime"
									@change="btnChangeTime"
									type="daterange"
									align="right"
									unlink-panels
									range-separator="至"
									start-placeholder="开始时间"
									end-placeholder="结束时间">
							</el-date-picker>
						</div>
						<!-- 操作类型 -->
						<div class="type">
							<span>操作类型: </span>
							<el-select v-model="type"
							           clearable
							           placeholder="请选择操作类型">
								<el-option
										v-for="item in typeOptions"
										:key="item.value"
										:label="item.type"
										:value="item.value">
								</el-option>
							</el-select>
						</div>
						<!-- 查询按钮 -->
						<div class="btn-search" @click="btnSearch">查询</div>
					</div>
					<!-- 表格 -->
					<div class="table">
						<el-table
								:data="tableData"
								border
								v-loading="loading"
								style="width: 100%">
							<el-table-column prop="sortNum" label="序号" align="center"></el-table-column>
							<el-table-column prop="operateTime" width="200" label="操作时间" align="center"></el-table-column>
							<el-table-column prop="operateType" label="操作类型" align="center"></el-table-column>
							<el-table-column prop="netWork" label="运营商" align="center"></el-table-column>
							<el-table-column prop="needChangeCard" label="需变更卡数" align="center"></el-table-column>
							<el-table-column prop="changeSuccess" label="变更成功" align="center"></el-table-column>
							<el-table-column prop="changeFailure" label="变更失败" align="center"></el-table-column>
							<el-table-column label="操作" align="center">
								<template slot-scope="scope">
									<span class="more" @click="changeDetail(scope.row)">变更详情</span>
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
	</div>
</template>

<script>
	import {timestampToTime, format, translatePackages, baseUrl, getNetWork} from '../api/dataUtil'

	export default {
		data() {
			return {
				// 操作时间
				operateTime: '',
				// 操作类型
				type: '',
				typeOptions: [
					{
						value: '0',
						type: '停卡'
					},
					{
						value: '1',
						type: '复卡'
					}
				],
				// table
				tableData: [],
				totalCount: 0,
				pageSize: 20,
				pageNo: 1,
				// 加载
				loading: '',
				startTime: '',
				endTime: ''
			};
		},
		mounted() {
			this.getTableData()
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
			// 查询按钮
			btnSearch() {
				this.pageNo = 1
				this.getTableData()
			},
			// 获取到表格数据
			getTableData() {
				this.loading = true
				this.$axios({
					url: '/pauseActiveCard/activeAndPauseList',
					method: 'post',
					params: {
						pageSize: this.pageSize,
						pageNo: this.pageNo,
						startTime: this.startTime,
						endTime: this.endTime,
						type: this.type
					}
				}).then(res => {
					let data = res.data.data
					console.log(data)

					this.totalCount = res.data.totalCount
					this.tableData = []
					for(let i=0; i<data.length; i++) {
						this.tableData.push({
							sortNum: ((this.pageNo - 1) * this.pageSize) + i + 1,
							operateTime: data[i].createTime,
							operateType: data[i].type == 1 ? '复卡' : '停卡',
							netWork: getNetWork(data[i].netWork),
							needChangeCard: data[i].totalCard,
							changeSuccess: data[i].successCard,
							changeFailure: data[i].failCard,
							id: data[i].id
						})
					}
					this.loading = false
				})
			},
			// 跳转到变更详情
			changeDetail(data) {
				let id = data.id
				this.$router.push({
					path: '/stopRestoreDetail',
					query: {
						id: id
					}
				})
			},
			// 日期更改的时候
			btnChangeTime() {
				if (!this.operateTime) {
					this.startTime = ''
					this.endTime = ''
					return
				}
				this.startTime = format(new Date(this.operateTime[0]).getTime(), "Y-m-d")
				this.endTime = format(new Date(this.operateTime[1]).getTime(), "Y-m-d")
			},
			// 变更状态
			getChangeStatus(i) {
				if(i==1) {
					return '成功'
				}else if(i==2) {
					return '失败'
				}else {
					return '待审核'
				}
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	borderColor = #e7ebf3
	buttonColor = #878787
	.stopRestore-wrap {
		padding-top: 50px;
		padding-left: 200px;
		.content {
			width: 100%;
			height: calc(100vh - 50px);
			padding: 20px;
			overflow-y: scroll;
			/* 流量卡断复网详情 */
			.stop-restore {
				width: 100%;
				border-radius: 5px;
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				padding: 30px 40px 40px;
				margin-bottom: 20px;
				.tips {
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
				.search-box {
					margin-top: 60px;
					/* 工具栏 */
					.tools {
						display: flex;
						/* 操作类型 */
						.type {
							margin-left: 40px;
						}
						.btn-search {
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
					/* table */
					.table {
						margin-top: 50px;
						.el-pagination {
							text-align: center;
							margin-top: 40px;
						}
						.cell {
							.more {
								cursor: pointer;
								color: mainBlue;
							}
						}
					}
				}
			}
		}
	}
</style>


