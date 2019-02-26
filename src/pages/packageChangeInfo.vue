<template>
	<div class="packageChangeSearch-wrap wrap">
		<div class="content wrap-content">
			<!-- 标题 -->
			<div class="page-title">
				<div class="line"></div>
				<span>套餐变更信息</span>
			</div>
			<!-- 表格数据 -->
			<div class="card">
				<!-- 工具栏 -->
				<div class="tools">
					<!-- 变更时间 -->
					<div class="change-time">
						<span>变更时间: </span>
						<el-date-picker
								v-model="tools.startTime"
								class="timePicker"
								type="datetime"
								placeholder="开始时间">
						</el-date-picker>
						&nbsp; 至 &nbsp;
						<el-date-picker
								v-model="tools.endTime"
								class="timePicker"
								type="date"
								placeholder="结束时间">
						</el-date-picker>
					</div>
					<!-- 变更状态 -->
					<div class="change-status">
						<span>变更状态: </span>
						<el-select class="select"
						           placeholder="全部"
						           clearable
						           v-model="tools.changeStatus">
							<el-option
									v-for="item in tools.changeStatusOptions"
									:key="item.value"
									:label="item.changeStatus"
									:value="item.value">
							</el-option>
						</el-select>
					</div>
					<!-- 搜索按钮 -->
					<div class="btn-search btn-main" @click="btnSearch">搜索</div>
				</div>
				<!-- 表格 -->
				<div class="table-box">
					<el-table
							:data="tableData"
							border
							v-loading="loading"
							element-loading-text="正在加载数据，请稍候"
							style="width: 100%">
						<el-table-column prop="changeTime" label="变更时间" width="200" align="center"></el-table-column>
						<el-table-column prop="expiryTime" label="到期日期" align="center"></el-table-column>
						<el-table-column prop="remainTime" label="剩余时间" align="center"></el-table-column>
						<el-table-column prop="totalCard" label="共计卡数" align="center"></el-table-column>
						<el-table-column prop="needPay" label="需支付费用" align="center"></el-table-column>
						<el-table-column prop="changeStatus" label="变更状态" align="center"></el-table-column>
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
	export default {
		data() {
			return {
				// 表格工具栏
				tools: {
					// 批次日期
					startTime: '',
					endTime: '',
					// 变更状态
					changeStatus: '',
					changeStatusOptions: [
						{
							value: '1',
							changeStatus: '成功'
						},
						{
							value: '2',
							changeStatus: '失败'
						},
						{
							value: '3',
							changeStatus: '待审核'
						}
					]
				},
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
					url: '/changeCardInfo/cardChangeInfo',
					method: 'post',
					params: {
						pageSize: this.pageSize,
						pageNo: this.pageNo,
						// 变更状态
						changeStatus: this.tools.changeStatus,
						// 批次日期
						startTime: this.tools.startTime,
						endTime: this.tools.endTime,
					}
				}).then(res => {
					this.tableData = []
					let data = res.data.data;
//					console.log(data)
					if(res.data.code == 1) {
						this.loading = false
						this.totalCount = res.data.totalCount
						for(let i=0; i<data.length; i++) {
							this.tableData.push({
								changeTime: data[i].changeTime,
								expiryTime: data[i].endTime.split(' ')[0],
								remainTime: data[i].residueMonth ? data[i].residueMonth + '个月' : '',
								totalCard: data[i].totalCard,
								needPay: data[i].priceDiff ? data[i].priceDiff + '元' : '',
								changeStatus: this.getChangeStatus(data[i].changeStatus),
								changeCardsId: data[i].changeCardsId
							})
						}
					}
				})
			},
			// 搜索按钮
			btnSearch() {
				if(!this.tools.startTime && this.tools.endTime) {
					this.$message.info('变更时间的开始和结束时间都要选择')
				}else if(this.tools.startTime && !this.tools.endTime) {
					this.$message.info('变更时间的开始和结束时间都要选择')
				}else if(this.tools.startTime > this.tools.endTime) {
					this.$message.info('开始时间不能大于结束时间')
				}else {
					this.getTableData()
				}
			},
			// 跳转到卡片信息页面
			goDetail(data) {
				let changeCardsId = data.changeCardsId
				this.$router.push({
					path: '/packageChangeDetail',
					query: {
						changeCardsId: changeCardsId
					}
				})
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
	mainBlue = #1d9eed;
	mainButton = #4cb2ff;
	.packageChangeSearch-wrap {
		.content {
			/* 表格数据 */
			.card {
				background-color: #fff;
				border-radius: 20px;
				margin-top: 20px;
				padding: 25px 50px;
				/* 工具栏 */
				.tools {
					display: flex;
					flex-wrap: wrap;
					/* 变更日期、变更状态 */
					.change-time, .change-status {
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