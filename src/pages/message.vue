<template>
	<div class="message-wrap wrap">
		<div class="content wrap-content">
			<!-- 标题 -->
			<div class="page-title">
				<div class="line"></div>
				<span>公告消息</span>
			</div>
			<!-- 表格数据 -->
			<div class="message">
				<!-- 工具栏 -->
				<div class="tools">
					<!-- 筛选框和搜索按钮 -->
					<div class="search">
						<!-- 通知时间 -->
						<div class="notification-time">
							<span>通知时间: </span>
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
						<!-- 信息类型 -->
						<div class="msg-type">
							<span>信息类型: </span>
							<el-select class="select"
							           placeholder="全部"
							           clearable
							           v-model="tools.msgType">
								<el-option
										v-for="item in tools.msgTypeOptions"
										:key="item.value"
										:label="item.msgType"
										:value="item.value">
								</el-option>
							</el-select>
						</div>
						<!-- 标题内容 -->
						<div class="msg-title">
							<span>标题内容: </span>
							<el-input class="input"
							          v-model="tools.msgTitle">
							</el-input>
						</div>
						<!-- 搜索按钮 -->
						<div class="btn-search btn-main" @click="btnSearch">搜索</div>
					</div>
					<!-- 按钮组 -->
					<div class="btn-group" v-show="tableData.length">
						<div class="btn-delete btn-gray" @click="btnDelete">删除</div>
						<!--<div class="mark-read btn-gray">标为已读</div>-->
					</div>
				</div>
				<!-- 表格 -->
				<div class="table-box" v-show="tableData.length">
					<el-table
							:data="tableData"
							@select="selectRows"
							@select-all="selectAll"
							border
							v-loading="loading"
							element-loading-text="正在加载数据，请稍候"
							style="width: 100%">
						<el-table-column type="selection" width="55" align="center"></el-table-column>
						<el-table-column label="标题" align="center">
							<template slot-scope="scope">
								<span :class="[{ bold: !scope.row.isRead, announce: scope.row.type == 2 },'cursor']"
								      @click="btnRead(scope.row)">
									{{ scope.row.msgTitle }}
								</span>
							</template>
						</el-table-column>
						<el-table-column label="时间" align="center">
							<template slot-scope="scope">
								<span :class="{ bold: !scope.row.isRead, announce: scope.row.type == 2 }">{{ scope.row.time }}</span>
							</template>
						</el-table-column>
						<el-table-column label="信息类型" align="center">
							<template slot-scope="scope">
								<span :class="{ bold: !scope.row.isRead, announce: scope.row.type == 2 }">{{ scope.row.msgType }}</span>
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
				<!-- 暂无数据 -->
				<div class="no-data" v-show="!tableData.length">
					<img src="../../static/images/common/noMsg.png">
				</div>
			</div>
		</div>
		<!-- 公告消息详情 -->
		<div class="message-modal" v-show="modal.isShow" @click.self="modal.isShow = false">
			<div class="message">
				<div class="msg-header">
					<span>{{ modal.title }}</span>
				</div>
				<div class="msg-box">
					<div class="msg-content">{{ modal.content }}</div>
					<div class="btn">
						<div class="btn-main" @click="modal.isShow = false">关闭</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import bus from '../eventBus.js'
	import {timestampToTime,format} from '../api/dataUtil'
	export default {
		data() {
			return {
				// 表格工具栏
				tools: {
					// 批次日期
					startTime: '',
					endTime: '',
					// 标题内容
					msgTitle: '',
					// 信息类型
					msgType: '',
					msgTypeOptions: [
						{
							value: '1',
							msgType: '消息'
						},
						{
							value: '2',
							msgType: '公告'
						}
					],
				},
				// 表格数据
				tableData: [],
				// 表格分页
				totalCount: 0,
				pageSize: 20,
				pageNo: 1,
				// 当前选中的数组
				currentArr: [],
				// 加载
				loading: '',
				// 弹出框
				modal: {
					isShow: false,
					title: '',
					content: ''
				}
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
					url: '/message/getMessAndAnou',
					method: 'post',
					params: {
						pageSize: this.pageSize,
						pageNo: this.pageNo,
						// 通知时间
						startTime: this.tools.startTime,
						endTime: this.tools.endTime,
						// 标题
						title: this.tools.msgTitle,
						// type
						type: this.tools.msgType
					}
				}).then(res => {
					this.tableData = []
					let data = res.data.data;
					if(res.data.code == 1) {
						this.loading = false
						this.totalCount = res.data.totalCount
						for(let i=0; i<data.length; i++) {
							this.tableData.push({
								isRead: data[i].isRead,
								time: timestampToTime(Number(data[i].createTime)),
								msgType: this.getType(data[i].type),
								msgTitle: data[i].title,
								msgContent: data[i].content,
								id: data[i].id,
								type: data[i].type
							})
						}
					}
				})
			},
			getType(i) {
				if(i == 1) {
					return '消息'
				}else if(i==2) {
					return '公告'
				}else {
					return ''
				}
			},
			// 点击搜索按钮
			btnSearch() {
				if(!this.tools.startTime && this.tools.endTime) {
					this.$message.info('通知时间的开始和结束时间都要选择')
				}else if(this.tools.startTime && !this.tools.endTime) {
					this.$message.info('通知时间的开始和结束时间都要选择')
				}else if(this.tools.startTime > this.tools.endTime) {
					this.$message.info('开始时间不能大于结束时间')
				}else {
					this.getTableData()
				}
			},
			// 点击标题弹出详情
			btnRead(data) {
				this.modal.title = data.msgTitle
				this.modal.content = data.msgContent
				this.modal.isShow = true
				// 如果当前点击的是公告的话，则跳出
				if(data.type == 2) {
					return
				}else {
					this.$axios({
						url: '/message/messageRead',
						method: 'post',
						params: {
							id: data.id
						}
					}).then(res => {
						let code = res.data.code
						if(code == 100) {
							data.isRead = true
							bus.$emit('unReadNo', res.data.object.unReadCount)
						}
					})
				}
			},

			// 选中某几行
			selectRows(selection, row) {
				this.currentArr = selection
			},
			// 全选
			selectAll(selection){
				this.currentArr = selection
			},
			// 点击删除按钮
			btnDelete() {
				// 如果没有选中，则提示用户未选中
				if(!this.currentArr.length) {
					this.$message.info('请选择需要删除的选项！')
				}
				else {
					let idType = '',
						type = ''
					// 循环遍历选中的项
					for(let i=0; i<this.currentArr.length; i++) {
						type += `${this.currentArr[i].type},`
						idType += `${this.currentArr[i].id}-${this.currentArr[i].type},`
					}
					if(type.indexOf(2) > 0) {
						this.$message.info('您当前选中的项包含公告，请重新选择！')
						return
					}else {
						this.$axios({
							url: '/message/delAnnOrMess',
							method: 'post',
							params: {
								idTy: idType ? idType.slice(0,idType.length-1) : ''
							}
						}).then(res => {
							let code = res.data.code
							if(code == 100) {
								this.$message.success('删除成功！')
								this.getTableData()
							}else {
								this.$message.error(res.data.object)
							}
						})
					}
				}
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
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #1d9eed;
	mainButton = #4cb2ff;
	.message-wrap {
		.content {
			/* 表格数据 */
			.message {
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
						/* 通知时间、标题内容、信息类型 */
						.notification-time, .msg-title, .msg-type {
							display: flex;
							line-height: 40px;
							margin-right: 40px;
							margin-bottom: 20px;
							span {
								width: 80px;
								margin-right: 10px;
								font-size: 18px;
								color: #545454;
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
					/* 按钮组 */
					.btn-group {
						display: flex;
						.mark-read {
							margin-left: 30px;
						}
					}
				}
				/* 表格 */
				.table-box {
					margin-top: 40px;
					.cell {
						.bold {
							/*font-size: 16px;*/
							font-weight: 900;
						}
						.announce {
							color: mainButton;
						}
						.cursor {
							cursor: pointer;
						}
					}
					.el-pagination {
						text-align: center;
						margin-top: 40px;
					}
				}
				/* 暂无数据 */
				.no-data {
					text-align: center;
					padding: 120px 0;
					img {
						width: 508px;
						height: 167px;
					}
				}
			}
		}
		/* 公告消息详情 */
		.message-modal {
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.2);
			position: fixed;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 999;
			.message {
				width: 600px;
				/*height: 300px;*/
				background-color: #fff;
				transform: translate(-50%, -50%);
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				position: absolute;
				left: 50%;
				top: 50%;
				border-radius: 5px;
				padding-top 20px
				.msg-header {
					font-size 30px
					color #737374
					margin-bottom 30px
					display flex
					justify-content center
					span {
						margin 0 20px
					}
				}
				.msg-box {
					padding: 0 50px;
					.msg-content {
						text-indent: 2em;
					}
					.btn {
						margin: 100px auto 30px;
						display: flex;
						justify-content: center;
					}
				}
			}
		}
	}
</style>