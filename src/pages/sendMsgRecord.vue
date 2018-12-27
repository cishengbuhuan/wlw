<template>
	<div class="sendMsgRecord-wrap">
		<div class="content">
			<!-- 短信发送记录 -->
			<div class="msg-record">
				<div class="tips"><i class="line"></i>短信发送记录</div>
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
						<div class="select">
							<!-- 卡号或者iccid -->
							<div class="cardNum">
								<span>卡号/ICCID: </span>
								<el-input
										clearable
										placeholder="请输入ICCID或者卡号"
										class="input"
										v-model="cardNo">
								</el-input>
							</div>
							<!-- 发送状态 -->
							<div class="status">
								<span>发送状态: </span>
								<el-select v-model="status"
								           clearable
								           placeholder="请选择发送状态">
									<el-option
											v-for="item in statusOptions"
											:key="item.value"
											:label="item.status"
											:value="item.value">
									</el-option>
								</el-select>
							</div>
							<!-- 查询按钮 -->
							<div class="btn-search" @click="btnSearch">查询</div>
						</div>
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
							<el-table-column prop="cardNum" label="卡号" align="center"></el-table-column>
							<el-table-column prop="iccid" width="220" label="ICCID" align="center"></el-table-column>
							<el-table-column prop="sendContent" label="发送内容" align="center"></el-table-column>
							<el-table-column prop="sendStatus" label="发送状态" align="center"></el-table-column>
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
				// 卡号或者iccid
				cardNo: '',
				// 发送状态
				status: '',
				statusOptions: [
					{
						value: '1',
						status: '成功'
					},
					{
						value: '2',
						status: '失败'
					}
				],
				// table
				tableData: [
					{
						sortNum: '1',
						operateTime: '2018-01-01',
						cardNum: '12345678',
						iccid: '移动',
						sendContent: '6',
						sendStatus: '成功'
					}
				],
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
					url: '/smsSendInfo/smsList',
					method: 'post',
					params: {
						pageSize: this.pageSize,
						pageNo: this.pageNo,
						beginTime: this.startTime,
						endTime: this.endTime,

						sendStatus: this.status,
						cardNo: this.cardNo
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
							cardNum: data[i].cardNumber,
							iccid: data[i].iccid,
							sendContent: data[i].content,
							sendStatus: this.getSendStatus(data[i].sendStatus)
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
			// 短信发送的状态
			getSendStatus(i) {
				if(i==1) {
					return '成功'
				}else if(i==2) {
					return '失败'
				}else {
					return ''
				}
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	borderColor = #e7ebf3
	buttonColor = #878787
	.sendMsgRecord-wrap {
		padding-top: 50px;
		padding-left: 200px;
		.content {
			width: 100%;
			height: calc(100vh - 50px);
			padding: 20px;
			overflow-y: scroll;
			/* 短信发送记录 */
			.msg-record {
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
						.date {
							display: flex;
							line-height: 40px;
							span {
								margin-right: 10px;
							}
						}
						.select {
							display: flex;
							margin-top: 20px
							.cardNum, .status {
								display: flex;
								justify-content: space-between
								line-height: 40px;
								width: 400px;
								/*span {
									flex: 1;
								}
								.el-input, .el-select {
									flex: 4;
								}*/
								.el-input {
									width: 310px;
								}
								.el-select {
									width: 230px;
							    }
							}
							/* 操作状态 */
							.status {
								width: 300px;
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


