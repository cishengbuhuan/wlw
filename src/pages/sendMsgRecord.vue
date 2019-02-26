<template>
	<div class="sendMsgRecord-wrap wrap">
		<div class="content wrap-content">
			<!-- 标题 -->
			<div class="page-title">
				<div class="line"></div>
				<span>短信发送记录</span>
			</div>
			<!-- 发送记录 -->
			<div class="send-record">
				<!-- 工具栏 -->
				<div class="tools">
					<!-- 操作时间 -->
					<div class="operate-time">
						<span>操作时间: </span>
						<el-date-picker
								v-model="tools.startTime"
								@change="startTimeChange"
								class="timePicker"
								type="date"
								placeholder="开始日期">
						</el-date-picker>
						&nbsp; 至 &nbsp;
						<el-date-picker
								v-model="tools.endTime"
								@change="endTimeChange"
								class="timePicker"
								type="date"
								placeholder="结束日期">
						</el-date-picker>
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
							style="width: 100%">
						<el-table-column prop="operateTime" label="操作时间" align="center"></el-table-column>
						<el-table-column prop="netWork" label="运营商" align="center"></el-table-column>
						<el-table-column prop="sendNumber" label="发送数量" align="center"></el-table-column>
						<el-table-column prop="sendContent" label="短信内容" align="center"></el-table-column>
						<el-table-column prop="sendMoney" label="短信费用" align="center"></el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<span class="more" @click="goDetail(scope.row)">号码详情</span>
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
					endTime: ''
				},
				// 表格数据
				tableData: [
					{
						operateTime: '',
						cardNum: '',
						iccid: '',
						netWork: '',
						sendContent: '',
						sendStatus: ''
					}
				],
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
			// 获取短信发送记录的列表
			getTableData() {
				this.loading = true
				this.$axios({
					url: '/smsRate/smsRateList',
					method: 'post',
					params: {
						pageSize: this.pageSize,
						pageNo: this.pageNo,
						// 操作时间
						start: this.tools.startTime,
						end: this.tools.endTime
					}
				}).then(res => {
					this.tableData = []
					let data = res.data.data;
					console.log(data)
					if(res.data.code == 1) {
						this.loading = false
						this.totalCount = res.data.totalCount
						this.returnIds = res.data.msg
						for(let i=0; i<data.length; i++) {
							this.tableData.push({
								operateTime: data[i].createTime,
								netWork: getNetWork(data[i].netWork),
								sendNumber: data[i].count,
								sendContent: data[i].content,
								sendMoney: data[i].money,
								id: data[i].id
							})
						}
					}
				})
			},
			// 选择日期
			startTimeChange() {
				if (!this.tools.startTime) {
					this.tools.startTime = ''
					this.pageNo = 1
					return
				}
				this.tools.startTime = format(new Date(this.tools.startTime).getTime(), "Y-m-d")
				this.pageNo = 1
			},
			endTimeChange() {
				if (!this.tools.endTime) {
					this.tools.endTime = ''
					this.pageNo = 1
					return
				}
				this.tools.endTime = format(new Date(this.tools.endTime).getTime(), "Y-m-d")
				this.pageNo = 1
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
			// 号码详情
			goDetail(data) {
				let id = data.id;
				let sendTime = data.operateTime
				this.$router.push({
					path: '/numberDetail',
					query: {
						id: id,
						sendTime: sendTime
					}
				})
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #1d9eed;
	mainButton = #4cb2ff;
	.sendMsgRecord-wrap {
		.content {
			/* 发送记录 */
			.send-record {
				background-color: #fff;
				border-radius: 20px;
				margin-top: 20px;
				padding: 25px 50px;
				/* 工具栏 */
				.tools {
					display: flex;
					flex-wrap: wrap;
					/* 操作时间、发送卡号、发送状态 */
					.operate-time, .card-num, .send-status {
						display: flex;
						line-height: 40px;
						margin-right: 40px;
						margin-bottom: 20px;
						span {
							margin-right: 10px;
							width: 80px;
							font-size: 18px;
							color: #545454;
						}
						.card-iccid {
							width: 135px;
						}
						.input {
							width: 220px;
						}
						.select {
							width: 130px;
						}
						.timePicker {
							width: 150px;
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