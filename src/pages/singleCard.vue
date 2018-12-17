<template>
	<div class="singleCard-wrap">
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
					<!-- 下拉框组 -->
					<div class="select-group">
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
						<el-select v-model="kindValue"
						           clearable
						           @change="toggleKind"
						           placeholder="请选择种类">
							<el-option
									v-for="item in selectData.kindOptions"
									:key="item.value"
									:label="item.kind"
									:value="item.value">
							</el-option>
						</el-select>
						<!-- 套餐类型 -->
						<el-select v-model="packagesTypeValue"
						           clearable
						           @change="togglePackagesType"
						           placeholder="请选择套餐类型">
							<el-option
									v-for="item in selectData.packagesOptions"
									:key="item.value"
									:label="item.packages"
									:value="item.value">
							</el-option>
						</el-select>
						<!-- 制式 -->
						<el-select v-model="netWorkType"
						           clearable
						           @change="toggleNetWorkType"
						           placeholder="请选择制式">
							<el-option
									v-for="item in selectData.netWorkTypeOptions"
									:key="item.value"
									:label="item.netWorkType"
									:value="item.value">
							</el-option>
						</el-select>
						<!-- 运营商 -->
						<el-select v-model="netWork"
						           clearable
						           @change="toggleNetWork"
						           placeholder="请选择运营商">
							<el-option
									v-for="item in selectData.netWorkOptions"
									:key="item.value"
									:label="item.netWork"
									:value="item.value">
							</el-option>
						</el-select>
					</div>
					<!-- 搜索框和时间过滤 -->
					<div class="search-group">
						<!-- 搜索框 -->
						<div class="search-box">
							<input type="text" placeholder="请输入ICCID或者卡号" v-model="numVal">
							<div class="btn-search" @click="getTableData"><i class="el-icon-search"></i></div>
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
							<!-- 导出 -->
							<div class="btn-export" @click='btnExport'>导出</div>
						</div>
					</div>
				</div>
				<div class="table-box">
					<el-table
							:data="tableData"
							@sort-change='sortChange'
							border
							v-loading="loading"
							style="width: 100%">
						<el-table-column prop="sortNum" label="序号" align="center"></el-table-column>
						<el-table-column prop="cardNum" label="卡号" align="center"></el-table-column>
						<el-table-column prop="iccid" label="ICCID" align="center"></el-table-column>
						<el-table-column prop="operator" label="运营商" align="center"></el-table-column>
						<el-table-column prop="flowPackage" label="流量池套餐" width='70' align="center"></el-table-column>
						<el-table-column prop="packageType" label="套餐类型" width='70' align="center"></el-table-column>
						<el-table-column prop="message" label="短信(已使用)" align="center"></el-table-column>
						<el-table-column prop="flowUsage" width="90" sortable='custom' label="本月已使用流量"
						                 align="center"></el-table-column>
						<el-table-column prop="flowOverage" sortable='custom' label="本月剩余流量"
						                 align="center"></el-table-column>
						<el-table-column prop="startTime" label="批次时间" width='100' align="center"></el-table-column>
						<el-table-column prop="endTime" label="到期时间" width='100' align="center"></el-table-column>
						<el-table-column prop="cardKind" label="卡种类" align="center"></el-table-column>
						<el-table-column prop="system" label="制式" align="center"></el-table-column>
						<el-table-column prop="cardStatus" label="卡状态" align="center"></el-table-column>
						<el-table-column prop="remark" label="备注" align="center"></el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<span class="more" @click="goDetail(scope.row)">查看详情</span>
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
						<el-button type="primary" class="btn-sure" @click="addRemark(1)">确认</el-button>
						<el-button type="info" @click="addRemark(0)">取消</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {timestampToTime, format, translatePackages, baseUrl} from '../api/dataUtil'

	export default {
		data() {
			return {
				totalCount: 0,
				pageSize: 20,
				pageNo: 1,
				// 加载
				loading: '',
				areaValue: '',
				statusValue: '',
				kindValue: '',
				packagesTypeValue: '',
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
					// 种类
					kindOptions: [
						{
							value: '1',
							kind: '大卡'
						},
						{
							value: '2',
							kind: '双切micro'
						},
						{
							value: '3',
							kind: '三切nano'
						},
						{
							value: '4',
							kind: '2*2贴片'
						},
						{
							value: '5',
							kind: '5*6贴片'
						},
						{
							value: '6',
							kind: 'eSim'
						},
						{
							value: '7',
							kind: '其他'
						}
					],
					// 套餐类型
					packagesOptions: [
						{
							value: '1',
							packages: '月'
						},
						{
							value: '2',
							packages: '半年'
						},
						{
							value: '3',
							packages: '季'
						},
						{
							value: '4',
							packages: '年'
						},
					],
					// 制式
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
					// 运营商
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
				timeValue: '',
				tableData: [],
				numVal: '',
				beginTime: '',
				endTime: '',
				netWork: '',
				status: '',
				cardType: '',
				netWorkType: '',
				defaultNetWork: '',
				defaultStatus: '',
				defaultNetWorkType: '',
				// 表格流量排序
				sortData: '',
				direct: '',
				// 下载的href
				baseUrl: `${baseUrl}/api/importCardList`,
				uploadHref: '',
				// 备注
				remark: '',
				modalRemark: false,
				deviceId: '',
				// 是否为单卡
				isSingle: 1
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
					method: 'post',
					params: {
						isSingle: this.isSingle
					}
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
				this.loading = true
				this.$axios({
					url: '/api/v2/device/devicePageList',
					method: 'post',
					params: {
						isSingle: this.isSingle,
						pageSize: this.pageSize,
						pageNo: this.pageNo,
						cardNo: this.numVal,
//                        area: this.netWork ? this.netWork : this.defaultNetWork,
						status: this.status ? this.status : this.defaultStatus,
						netWorkType: this.netWorkType ? this.netWorkType : this.defaultNetWorkType,


						startTime: this.beginTime,
						endTime: this.endTime,
						sort: this.sortData,
						direct: this.direct,
						packageType: this.packagesTypeValue,
						cardType: this.cardType,
						netWork: this.netWork
					}
				}).then(res => {
//					console.log(res.data.data)
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
							packageType: translatePackages(data[i].packageType),
							message: data[i].msgNo,
							flowUsage: data[i].usageMonth == '' ? '' : parseFloat(data[i].usageMonth).toFixed(2) + 'M',
							flowOverage: data[i].flowOverage == '' ? '' : parseFloat(data[i].flowOverage).toFixed(2) + 'M',
//							startTime: timestampToTime(data[i].chargeTime),
//							endTime: timestampToTime(data[i].endTime),
							startTime: data[i].chargeTime.split(' ')[0],
							endTime: data[i].endTime.split(' ')[0],
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
							cardStatus: data[i].cardStatus === 0 ? '在线' : '离线',
							deviceId: data[i].deviceId,
							remark: data[i].remark,
						})
					}
					this.loading = false
				})
			},
			// 导出表格
			btnExport() {
				let token = sessionStorage.getItem('_token'),
					pageSize = this.pageSize,
					pageNo = this.pageNo,
					cardNo = this.numVal,
					status = this.status ? this.status : this.defaultStatus,
					netWorkType = this.netWorkType ? this.netWorkType : this.defaultNetWorkType,
					startTime = this.beginTime,
					endTime = this.endTime,
					sort = this.sortData,
					direct = this.direct,
					packageType = this.packagesTypeValue,
					cardType = this.cardType,
					isSingle = this.isSingle
				this.uploadHref = `${this.baseUrl}?_token=${token}
					&pageSize=${pageSize}&pageNo=${pageNo}
					&cardNo=${cardNo}&status=${status}
					&netWorkType=${netWorkType}&startTime=${startTime}
					&endTime=${endTime}&sort=${sort}
					&direct=${direct}&packageType=${packageType}
					&cardType=${cardType}&isSingle=${isSingle}`
				let iframe = document.createElement('iframe');
				iframe.src = this.uploadHref
				document.body.appendChild(iframe)
				iframe.style.display = 'none'
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
					this.pageNo = 1
					this.getTableData();
					return
				}
				this.beginTime = format(new Date(this.timeValue[0]).getTime(), "Y-m-d")
				this.endTime = format(new Date(this.timeValue[1]).getTime(), "Y-m-d")
				this.pageNo = 1
				this.getTableData();
			},
			// 状态 的下拉框的值发生变化的时候触发
			toggleStatus(val) {
				this.status = val;
				this.pageNo = 1
				this.getTableData()
			},
			// 种类 的下拉框的值发生变化的时候触发
			toggleKind(val) {
				this.cardType = val;
				this.pageNo = 1
				this.getTableData()
			},
			// 套餐类型 的下拉框的值发生变化的时候触发
			togglePackagesType(val) {
				this.packagesTypeValue = val;
				this.pageNo = 1
				this.getTableData()
			},
			// 制式 的下拉框的值发生变化的时候触发
			toggleNetWorkType(val) {
				this.netWorkType = val;
				this.pageNo = 1
				this.getTableData()
			},
			// 运营商 的下拉框的值发生变化的时候触发
			toggleNetWork(val) {
				this.netWork = val;
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
				this.pageNo = 1
				this.getTableData()
			},
			// 跳转到详情页
			goDetail(data) {
				let deviceId = data.deviceId
				this.$router.push({
					path: '/cardDetail',
					query: {
						deviceId: deviceId
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
						console.log(data)
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
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	.singleCard-wrap {
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
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
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
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				border-radius: 5px;
				.table-header {
					display: flex;
					flex-wrap: wrap;
					/*justify-content space-between*/
					/* 下拉框组 */
					.select-group {
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
					/* 搜索框和时间过滤 */
					.search-group {
						display: flex;
						margin-top: 20px;
						/* 搜索框 */
						.search-box {
							width: 360px;
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
							/* 导出 */
							.btn-export {
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
				}
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
	// 添加备注的弹出框
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


