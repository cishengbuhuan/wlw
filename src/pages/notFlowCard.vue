<template>
	<div class="notFlowCard-wrap wrap">
		<div class="content wrap-content">
			<!-- 标题 -->
			<div class="page-title">
				<div class="line"></div>
				<span>非流量池卡库</span>
			</div>
			<!-- 运营商切换 -->
			<div class="tab-netWork">
				<div v-for="(item,index) in netWorkNav"
				     :class="[{current: tabIndex === item.tabIndex},'tab-item']"
				     @click="toggleNetWorkNav(item)"
				     :key="index">
					{{ item.netWork }}
				</div>
			</div>
			<!-- 卡片概况 -->
			<div class="card-overview"
			     v-loading="overview.loading"
			     element-loading-text="正在加载数据，请稍侯">
				<div class="tip">
					<span>卡片概况</span>
					<el-tooltip class="tooltip" content="统计信息根据运营商反馈，可能出现延迟情况。" placement="right">
						<i class="el-icon-question"></i>
					</el-tooltip>
					<div class="total-card">
						总卡量: {{ overview.totalCard }}
					</div>
				</div>
				<div class="overview">
					<div class="overview-item">
						<div class="item-top active">已激活: {{ overview.active }}</div>
						<div class="item-bottom inactivated">未激活: {{ overview.inactivated }}</div>
					</div>
					<div class="overview-item isOnline">
						<div class="item-top online">在线数: {{ overview.online }}</div>
						<div class="item-bottom offline">离线数: {{ overview.offline }}</div>
					</div>
					<div class="overview-item">
						<div class="item-center stop">停卡数: {{ overview.stop }}</div>
					</div>
				</div>
			</div>
			<!-- 表格数据 -->
			<div class="card">
				<!-- 工具栏 -->
				<div class="tools">
					<!-- 筛选框和搜索按钮 -->
					<div class="search">
						<!-- 卡号或iccid -->
						<div class="card-iccid">
							<el-select class="select"
							           placeholder="卡号/ICCID"
							           @change="checkCardOrIccid"
							           clearable
							           v-model="tools.cardNum">
								<el-option
										v-for="item in tools.cardOptions"
										:key="item.value"
										:label="item.card"
										:value="item.value">
								</el-option>
							</el-select>
							<el-input class="input"
							          v-show="tools.inputShow"
							          :placeholder="tools.startPlaceHolder"
							          v-model="tools.startNum">
							</el-input>
							<span v-show="tools.inputShow">-</span>
							<el-input class="input"
							          v-show="tools.inputShow"
							          :placeholder="tools.endPlaceHolder"
							          v-model="tools.endNum">
							</el-input>
						</div>
						<!-- 在线状态 -->
						<div class="online-status">
							<span>在线状态: </span>
							<el-select class="select"
							           placeholder="全部"
							           clearable
							           v-model="tools.online">
								<el-option
										v-for="item in tools.onlineOptions"
										:key="item.value"
										:label="item.online"
										:value="item.value">
								</el-option>
							</el-select>
						</div>
						<!-- 激活状态 -->
						<div class="active-status">
							<span>激活状态: </span>
							<el-select class="select"
							           placeholder="全部"
							           clearable
							           v-model="tools.active">
								<el-option
										v-for="item in tools.activeOptions"
										:key="item.value"
										:label="item.active"
										:value="item.value">
								</el-option>
							</el-select>
						</div>
						<!-- 停卡状态 -->
						<div class="stop-active">
							<span>停卡状态: </span>
							<el-select class="select"
							           placeholder="全部"
							           clearable
							           v-model="tools.stop">
								<el-option
										v-for="item in tools.stopOptions"
										:key="item.value"
										:label="item.stop"
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
						<!-- 备注信息 -->
						<div class="remark">
							<span>备注信息: </span>
							<el-input class="input"
							          v-model="tools.remark">
							</el-input>
						</div>
						<!-- 搜索按钮 -->
						<div class="btn-search btn-main" @click="getDataByFilter">搜索</div>
					</div>
					<!-- 导出按钮 -->
					<div class="btn-export btn-gray" @click="btnExport">导出</div>
				</div>
				<!-- 表格 -->
				<div class="table-box">
					<el-table
							:data="tableData"
							@sort-change='sortChange'
							border
							v-loading="loading"
							element-loading-text="正在加载数据，请稍候"
							style="width: 100%">
						<el-table-column prop="cardNum" width="82" label="卡号" align="center"></el-table-column>
						<el-table-column prop="iccid" label="ICCID" align="center"></el-table-column>
						<el-table-column prop="flowUsage" sortable='custom' width="90" label="本月已使用流量"
						                 align="center"></el-table-column>
						<el-table-column prop="flowOverage" width="110" label="剩余流量" align="center"></el-table-column>
						<el-table-column prop="packageName" label="套餐名称" align="center"></el-table-column>
						<el-table-column prop="onlineStatus" label="在线状态" align="center"></el-table-column>
						<el-table-column prop="activeStatus" label="激活状态" align="center"></el-table-column>
						<el-table-column prop="stopStatus" label="停卡状态" align="center"></el-table-column>
						<el-table-column prop="netWorkType" label="制式" align="center"></el-table-column>
						<el-table-column prop="batchTime" width="120" label="批次时间" align="center"></el-table-column>
						<el-table-column prop="endTime" width="120" label="到期时间" align="center"></el-table-column>
						<el-table-column prop="remark" label="备注" align="center"></el-table-column>
						<el-table-column label="操作" width="80" align="center">
							<template slot-scope="scope">
								<span class="more" @click="goDetail(scope.row)">卡片详情</span>
								<span class="remark" @click="btnRemark(scope.row)">备注</span>
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
		<!-- 添加备注弹出框 -->
		<div class="modal-remark" v-show="modalRemark" @click.self="modalRemark = false">
			<div class="remark">
				<div class="remark-header">
					<div class="icon"></div>
					<span>备注</span>
					<div class="icon"></div>
				</div>
				<div class="remark-content">
					<el-input
							clearable
							class="input"
							type="textarea"
							placeholder="请输入备注"
							v-model="remark">
					</el-input>
					<div class="btn-group">
						<div class="btn-sure btn-main" @click="addRemark(1)">确认</div>
						<div class="btn-gray" @click="addRemark(0)">取消</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {format,translatePackages,getOnlineStatus,
		getActiveStatus,getStopStatus,translateSystem,baseUrl} from '../api/dataUtil'
	export default {
		data() {
			return {
				// 运营商切换
				tabIndex: 1,
				netWorkNav: [
					{
						netWork: '移动',
						tabIndex: 1
					},
					{
						netWork: '联通',
						tabIndex: 2
					},
					{
						netWork: '电信',
						tabIndex: 3
					}
				],
				// 卡片概况
				overview: {
					loading: '',
					totalCard: '',
					active: '',
					inactivated: '',
					online: '',
					offline: '',
					stop: ''
				},
				// 表格工具栏
				tools: {
					// 卡号或者iccid
					cardNum: '',
					cardOptions: [
						{
							value: '1',
							card: '卡号'
						},
						{
							value: '2',
							card: 'ICCID'
						}
					],
					inputShow: false,
					startNum: '',
					endNum: '',
					startPlaceHolder: '',
					endPlaceHolder: '',
					// 在线状态
					online: '',
					onlineOptions: [
						{
							value: '1',
							online: '在线'
						},
						{
							value: '0',
							online: '离线'
						}
					],
					// 激活状态
					active: '',
					activeOptions: [
						{
							value: '0',
							active: '已激活'
						},
						{
							value: '1',
							active: '未激活'
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
					// 备注信息
					remark: '',
					// 停卡状态
					stop: '',
					stopOptions: [
						{
							value: '0',
							stop: '已停卡'
						},
						{
							value: '1',
							stop: '未停卡'
						}
					],
				},
				// 表格数据
				tableData: [],
				// 表格分页
				totalCount: 0,
				pageSize: 20,
				pageNo: 1,
				// 加载
				loading: '',
				// 是否为单卡，1是单卡，2是流量池
				isSingle: 1,
				// 备注
				remark: '',
				modalRemark: false,
				deviceId: '',
				// 表格流量排序
				sortData: '',
				direct: '',
				// 下载的href
				baseUrl: `${baseUrl}/api/importCardList`,
				uploadHref: '',
			};
		},
		mounted() {
			this.getCardOverview()
			this.getTableData()
		},
		created() {

		},
		methods: {
			// 切换运营商
			toggleNetWorkNav(item) {
				this.tabIndex = item.tabIndex
				this.getCardOverview()
				this.getTableData()
			},
			// 选择卡号或者iccid
			checkCardOrIccid(i) {
				if(i == '1') {
					this.tools.startPlaceHolder = '请输入开始的卡号'
					this.tools.endPlaceHolder = '请输入结束的卡号'
					this.tools.inputShow = true
				}else if(i == '2') {
					this.tools.startPlaceHolder = '请输入开始的ICCID'
					this.tools.endPlaceHolder = '请输入结束的ICCID'
					this.tools.inputShow = true
				}else {
					this.tools.startPlaceHolder = ''
					this.tools.endPlaceHolder = ''
					this.tools.inputShow = false
				}
			},

			// 获取到卡片概况
			getCardOverview() {
				this.overview.loading = true
				this.$axios({
					url: '/ucenterDevice/cardInfos',
					method: 'post',
					params: {
						netWork: this.tabIndex,
						isSingle: this.isSingle
					}
				}).then(res => {
					if(res.data.code == 100) {
						let data = res.data.object;
//					    console.log(data)
						this.overview.loading = false

						this.overview.totalCard = data.totalCard
						this.overview.active = data.acticeCardCount
						this.overview.inactivated = data.totalCard - data.acticeCardCount
						this.overview.online = data.onlineCount
						this.overview.offline = data.totalCard - data.onlineCount
						this.overview.stop = data.stopCardCount
					}
				})
			},
			// 获取到表格数据
			getTableData() {
				this.loading = true
				this.$axios({
					url: '/api/v2/device/devicePageList',
					method: 'post',
					params: {
						isSingle: this.isSingle,
						pageSize: this.pageSize,
						pageNo: this.pageNo,
						// 卡号段
						cardNo: this.tools.startNum ? `${this.tools.startNum}-${this.tools.endNum}` : '',
						// 在线状态
						onlineStatus: this.tools.online,
						// 激活状态
						activeStatus: this.tools.active,
						// 停卡状态
						stopStatus: this.tools.stop,
						// 制式
						netWorkType: this.tools.netWorkType,
						// 批次日期
						start: this.tools.startTime,
						end: this.tools.endTime,
						// 备注
						remark: this.tools.remark,
						// 运营商
						netWork: this.tabIndex,


						// 排序
						sort: this.sortData,
						direct: this.direct
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
								cardNum: data[i].cardNumber,
								iccid: data[i].iccid,
								flowUsage: Number(data[i].usageMonth).toFixed(2) + 'M',
								flowOverage: Number(data[i].flowOverage) < 0 ? '0.00M' : Number(data[i].flowOverage).toFixed(2) + 'M',
								packageName: `${data[i].packages}/${translatePackages(data[i].packageType)}`,
								onlineStatus: getOnlineStatus(data[i].onlineStatus),
								activeStatus: getActiveStatus(data[i].cardStatus),
								stopStatus: getStopStatus(data[i].stopStatus),
								netWorkType: translateSystem(data[i].networkType),
								batchTime: data[i].serveTime.split(' ')[0],
								endTime: data[i].endTime.split(' ')[0],
								remark: data[i].remark,
								deviceId: data[i].deviceId
							})
						}
					}
				})
			},

			// 添加备注
			btnRemark(data) {
				this.deviceId = data.deviceId
				this.modalRemark = true
				this.remark = data.remark
			},
			// 是否确认添加备注
			addRemark(i) {
				if (i == 0) {
					this.modalRemark = false
				} else {
					this.$axios({
						url: '/ucenterDevice/updateRemark',
						method: 'post',
						params: {
							deviceId: this.deviceId,
							remark: this.remark
						}
					}).then(res => {
						let data = res.data
//						console.log(data)
						if (data.code == 200) {
							this.modalRemark = false
							this.$message.success(data.message)
							this.getTableData()
						} else {
							this.modalRemark = false
							this.$message.error(data.message)
						}
					})
				}
			},
			// 根据条件查询
			getDataByFilter() {
				let start = this.tools.startNum.length,
					end = this.tools.endNum.length
				if(this.tools.cardNum == 1 && start != end) {
					this.$message.info('请输入正确的卡号')
				}else if(this.tools.cardNum == 2 && start != end) {
					this.$message.info('请输入正确的ICCID')
				}else if(!this.tools.startTime && this.tools.endTime) {
					this.$message.info('批次日期的开始和结束日期都要选择')
				}else if(this.tools.startTime && !this.tools.endTime) {
					this.$message.info('批次日期的开始和结束日期都要选择')
				}else if(this.tools.startTime > this.tools.endTime) {
					this.$message.info('开始日期不能大于结束日期')
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
				this.tools.startTime = format(new Date(this.tools.startTime).getTime(), "Y-m-d")
				this.tools.endTime = format(new Date(this.tools.endTime).getTime(), "Y-m-d")
				this.pageNo = 1
			},

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
			// 跳转到卡片详情页面
			goDetail(data) {
				let deviceId = data.deviceId
				this.$router.push({
					path: '/cardDetail',
					query: {
						deviceId: deviceId
					}
				})
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
				this.pageNo = 1
				this.getTableData()
			},

			// 导出表格
			btnExport() {
				let token = sessionStorage.getItem('_token'),
					pageSize = this.pageSize,
					pageNo = this.pageNo,
					isSingle = this.isSingle,
					sort = this.sortData,
					direct = this.direct,

					// 卡号段
					cardNo = this.tools.startNum ? `${this.tools.startNum}-${this.tools.endNum}` : '',
					// 在线状态
					onlineStatus = this.tools.online,
					// 激活状态
					activeStatus = this.tools.active,
					// 停卡状态
					stopStatus = this.tools.stop,
					// 制式
					netWorkType = this.tools.netWorkType,
					// 批次日期
					start = this.tools.startTime,
					end = this.tools.endTime,
					// 备注
					remark = this.tools.remark




				this.uploadHref = `${this.baseUrl}?_token=${token}
					&pageSize=${pageSize}&pageNo=${pageNo}&isSingle=${isSingle}
					&sort=${sort}&direct=${direct}&cardNo=${cardNo}&onlineStatus=${onlineStatus}
					&activeStatus=${activeStatus}&stopStatus=${stopStatus}&netWorkType=${netWorkType}
					&start=${start}&end=${end}&remark=${remark}`


				let iframe = document.createElement('iframe');
				iframe.src = this.uploadHref
				document.body.appendChild(iframe)
				iframe.style.display = 'none'
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #1d9eed;
	mainButton = #4cb2ff;
	.notFlowCard-wrap {
		.content {
			/* 运营商切换 */
			.tab-netWork {
				display: flex;
				.tab-item {
					width: 166px;
					height: 78px;
					font-size: 24px;
					color: #545454;
					text-align: center;
					line-height: 58px;
					cursor: pointer;
				}
				.current {
					background-color: #fff;
					border-top-left-radius: 20px;
					border-top-right-radius: 20px;
					color: mainBlue;
					position: relative;
				}
				.current:before {
					content: '';
					display: block;
					width: 32px;
					height: 4px;
					background-color: mainBlue;
					position: absolute;
					bottom: 20px;
					left: 67px;
				}
			}
			/* 卡片概况 */
			.card-overview {
				background-color: #fff;
				height: 260px;
				/*border-top-right-radius: 20px;
				border-bottom-left-radius: 20px;
				border-bottom-right-radius: 20px;*/
				border-radius: 20px;
				padding: 30px;
				margin-top: -20px;
				.tip {
					display: flex;
					span {
						font-size: 24px;
						color: #585858;
					}
					.total-card {
						font-size: 24px;
						color: mainBlue;
						margin: 5px 0 0 80px;
					}
				}
				.overview {
					display: flex;
					margin-top: 40px;
					.overview-item {
						flex: 1;
						font-size: 24px;
						text-align: center;
						.item-top {
							color: mainBlue;
							margin-bottom: 40px;
						}
						.item-bottom {
							color: #545454;
						}
						.item-center {
							color: #ed1d1d;
							margin-top: 30px;
						}
					}
					.isOnline {
						border-left: 1px solid #ddd;
						border-right: 1px solid #ddd;
					}
				}
			}
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
						/* 在线状态、激活状态、制式、批次时间、停卡状态 */
						.online-status, .active-status, .netWork-type, .batch-time, .stop-active {
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
						.remark {
							display: flex;
							line-height: 40px;
							margin-right: 40px;
							span {
								margin-right: 10px;
								font-size: 18px;
								color: #545454;
							}
							.input {
								width: 200px;
							}
						}
						.btn-search {
							margin-bottom: 20px;
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
		/* 添加备注的弹出框 */
		.modal-remark {
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.2);
			position: fixed;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 999;
			.remark {
				width: 600px;
				height: 300px;
				background-color: #fff;
				transform: translate(-50%, -50%);
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				position: absolute;
				left: 50%;
				top: 50%;
				border-radius: 5px;
				padding-top 20px
				.remark-header {
					font-size 30px
					color #737374
					margin-bottom 30px
					display flex
					justify-content center
					.icon {
						width 10px
						height 10px
						border-radius 50%
						background-color mainBlue
						margin-top 17px
					}
					span {
						margin 0 20px
					}
				}
				.remark-content {
					padding: 0 20px;
					.btn-group {
						display: flex
						justify-content center
						margin-top: 50px
						.btn-sure {
							margin-right: 20px
						}
					}
				}
			}
		}
	}
</style>