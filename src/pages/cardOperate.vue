<template>
	<div class="card-wrap">
		<div class="content">
			<!-- 卡片操作 -->
			<div class="card-operate">
				<div class="tips"><i class="line"></i>卡片操作</div>
				<!-- 卡片 -->
				<div class="tab">
					<!-- tab导航栏 -->
					<div class="tab-nav">
						<div v-for="(item,index) in navArr"
						     @click="toggleNav(index)"
						     :class="[{current : tabIndex === index},'nav-item']"
						     :key="index">{{ item.nav }}</div>
					</div>
					<!-- tab栏目 -->
					<div class="tab-content" v-show="tabIndex != -1">
						<!-- 套餐变更 -->
						<div class="tab-item package-change" v-show="tabIndex == 0">
							<!-- tools -->
							<div class="tools" v-if="!packageChange.noData">
								<!-- ICCID或者卡号 -->
								<!--<el-input-->
										<!--clearable-->
										<!--placeholder="请输入ICCID或者卡号"-->
										<!--class="input"-->
										<!--v-model="packageChange.cardNo">-->
								<!--</el-input>-->
								<!-- 运营商 -->
								<el-select v-model="packageChange.netWork"
								           clearable
								           @change="loadPackageFlow"
								           class="select"
								           placeholder="请选择运营商">
									<el-option
											v-for="item in packageChange.netWorkOptions"
											:key="item.value"
											:label="item.netWork"
											:value="item.value">
									</el-option>
								</el-select>
								<!-- 套餐流量 -->
								<el-select v-model="packageChange.packageFlow"
								           v-show="packageChange.packageFlowShow"
								           clearable
								           class="select"
								           placeholder="请选择套餐流量">
									<el-option
											v-for="item in packageChange.packageFlowOptions"
											:key="item.value"
											:label="item.packageFlow"
											:value="item.value">
									</el-option>
								</el-select>
								<!-- 制式 -->
								<el-select v-model="packageChange.netWorkType"
								           clearable
								           class="select"
								           placeholder="请选择制式">
									<el-option
											v-for="item in packageChange.netWorkTypeOptions"
											:key="item.value"
											:label="item.netWorkType"
											:value="item.value">
									</el-option>
								</el-select>
								<!-- 是否车联卡 -->
								<!--<el-select v-model="packageChange.isCLCard"-->
								           <!--clearable-->
								           <!--class="select"-->
								           <!--placeholder="请选择是否车联卡">-->
									<!--<el-option-->
											<!--v-for="item in packageChange.clCardOptions"-->
											<!--:key="item.value"-->
											<!--:label="item.isCLCard"-->
											<!--:value="item.value">-->
									<!--</el-option>-->
								<!--</el-select>-->
								<!-- 流量计算 -->
								<el-select v-model="packageChange.flowCalc"
								           clearable
								           class="select"
								           placeholder="请选择流量计算方式">
									<el-option
											v-for="item in packageChange.flowCalcOptions"
											:key="item.value"
											:label="item.isSingle"
											:value="item.value">
									</el-option>
								</el-select>
								<el-date-picker
										class="date"
										v-model="packageChange.batchTime"
										@change="btnChangeTime"
										type="daterange"
										align="right"
										unlink-panels
										range-separator="至"
										start-placeholder="开始时间"
										end-placeholder="结束时间">
								</el-date-picker>
								<!-- 查询按钮 -->
								<div class="btn-search" @click="getTableData">查询</div>
							</div>
							<!-- 查询不到 -->
							<div class="no-info" v-if="packageChange.noData">
								当前账户无月套餐，暂不支持套餐更改
							</div>
						</div>
						<!-- 激活 -->
						<div class="tab-item card-active" v-show="tabIndex == 1">
							<!-- ICCID或者卡号 -->
							<el-input
									clearable
									placeholder="请输入ICCID或者卡号"
									class="input"
									v-model="active.cardNo">
							</el-input>
							<!-- 运营商 -->
							<el-select v-model="active.netWork"
							           clearable
							           class="select"
							           placeholder="请选择运营商">
								<el-option
										v-for="item in active.netWorkOptions"
										:key="item.value"
										:label="item.netWork"
										:value="item.value">
								</el-option>
							</el-select>
							<!-- 查询按钮 -->
							<div class="btn-search" @click="getTableData">查询</div>
						</div>
						<!-- 停卡 -->
						<div class="tab-item card-stop" v-show="tabIndex == 2">
							<!-- ICCID或者卡号 -->
							<el-input
									clearable
									placeholder="请输入ICCID或者卡号"
									class="input"
									v-model="stopCard.cardNo">
							</el-input>
							<!-- 运营商 -->
							<el-select v-model="stopCard.netWork"
							           clearable
							           class="select"
							           placeholder="请选择运营商">
								<el-option
										v-for="item in stopCard.netWorkOptions"
										:key="item.value"
										:label="item.netWork"
										:value="item.value">
								</el-option>
							</el-select>
							<!-- 查询按钮 -->
							<div class="btn-search" @click="getTableData">查询</div>
						</div>
						<!-- 发送短信 -->
						<div class="tab-item send-message" v-show="tabIndex == 3">
							<!-- ICCID或者卡号 -->
							<el-input
									clearable
									placeholder="请输入ICCID或者卡号"
									class="input"
									v-model="sendMsg.cardNo">
							</el-input>
							<!-- 运营商 -->
							<el-select v-model="sendMsg.netWork"
							           clearable
							           class="select"
							           placeholder="请选择运营商">
								<el-option
										v-for="item in sendMsg.netWorkOptions"
										:key="item.value"
										:label="item.netWork"
										:value="item.value">
								</el-option>
							</el-select>
							<!-- 查询按钮 -->
							<div class="btn-search" @click="getTableData">查询</div>
						</div>
					</div>
					<!-- this is a demo for send msg -->
				</div>
			</div>
			<!-- 操作的表格 -->
			<div class="operate-table">
				<!-- 工具栏 -->
				<div class="tools" v-show="operateData.length">
					<div class="btn-operate" @click="btnSelect(1)">选取操作</div>
					<div class="btn-batch" @click="btnSelect(2)">批量操作</div>
				</div>
				<!-- 表格 -->
				<div class="table">
					<el-table
							:data="operateData"
							border
							@select="selectRows"
							@select-all="selectAll"
							v-loading="loading"
							style="width: 100%">
						<el-table-column type="selection" width="55" align="center"></el-table-column>
						<el-table-column prop="cardNo" label="卡号" align="center"></el-table-column>
						<el-table-column prop="iccid" label="ICCID" align="center"></el-table-column>
						<el-table-column prop="netWork" label="运营商" align="center"></el-table-column>
						<el-table-column prop="flowPackage" label="流量池套餐" align="center"></el-table-column>
						<el-table-column prop="flowUsage" label="本月已使用流量" align="center"></el-table-column>
						<el-table-column prop="flowOverage" label="本月剩余流量" align="center"></el-table-column>
						<el-table-column prop="cardStatus" label="卡状态" align="center"></el-table-column>
						<el-table-column prop="packageType" label="套餐类型" align="center"></el-table-column>
						<el-table-column prop="system" label="制式" align="center"></el-table-column>
						<el-table-column prop="batchTime" label="批次时间" width="110" align="center"></el-table-column>
						<el-table-column prop="endTime" label="到期时间" width="110" align="center"></el-table-column>
						<el-table-column prop="cardKind" label="卡种类" align="center"></el-table-column>
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
	import {timestampToTime, format, translatePackages, getNetWork, getPackageFlow} from '../api/dataUtil'

	export default {
		data() {
			return {
				// 导航的索引
				tabIndex: -1,
				// 卡片操作tab导航
				navArr: [
					{
						nav: '套餐变更',
					},
					{
						nav: '复卡',
					},
					{
						nav: '停卡',
					},
					{
						nav: '发送短信'
					}
				],
				// 操作的表格
				operateData: [],
				// 表格的相关数据
				loading: '',
				totalCount: 0,
				pageSize: 20,
				pageNo: 1,
				// 套餐变更的筛选
				packageChange: {
					// ICCID或者卡号
					cardNo: '',
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
					// 运营商
					netWork: '',
					netWorkOptions: [],
					// 套餐流量
					packageFlowShow: false,
					packageFlow: '',
					packageFlowOptions: [],
					// 流量计算
					flowCalc: '',
					flowCalcOptions: [
						{
							value: '1',
							isSingle: '单卡'
						},
						{
							value: '2',
							isSingle: '流量池'
						}
					],
					// 批次
					batchTime: '',
					startTime: '',
					endTime: '',
					// 是否车联卡
					isCLCard: '',
					clCardOptions: [
						{
							value: '1',
							isCLCard: '普通卡'
						},
						{
							value: '2',
							isCLCard: '车联卡'
						}
					],
					// 没有月套餐，就不支持更改套餐
					noData: true
				},
				// 激活的筛选
				active: {
					// ICCID或者卡号
					cardNo: '',
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
				// 停卡的筛选
				stopCard: {
					// ICCID或者卡号
					cardNo: '',
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
				// 发送短信的筛选
				sendMsg: {
					// ICCID或者卡号
					cardNo: '',
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

				// 当前选中的数组
				currentArr: [],
				// 全选操作的deviceIds
				deviceIds: '',
			};
		},
		mounted() {

		},
		methods: {
			// 切换卡片操作的导航
			toggleNav(index) {
				this.tabIndex = index
				// 清空当前选择的数组
				this.currentArr = []
				// 清空表格数据
				this.operateData = []
				this.totalCount = 0
				// 如果是套餐变更
				if(this.tabIndex === 0) {
					// 获取到运营商
					this.$axios({
						url: '/api/getNetWorkByCom',
						method: 'post'
					}).then(res => {
//						console.log(res.data.object)
						let data = res.data.object
						if(!data.length) {
							this.packageChange.noData = true
							return
						}
						this.packageChange.noData = false
						this.packageChange.netWorkOptions = []
						for(let i=0; i<data.length; i++) {
							this.packageChange.netWorkOptions.push({
								value: data[i].netWork,
								netWork: getNetWork(data[i].netWork)
							})
						}
					})
				}
			},
			// 加载套餐流量的数据
			loadPackageFlow() {
				let netWork = this.packageChange.netWork
				this.$axios({
					url: '/api/getPackagesSingle',
					method: 'post',
					params: {
						// 运营商
						netWork: netWork
					}
				}).then(res => {
//					console.log(res.data.object)
					let data = res.data.object;
					if(!data.length) {
						this.packageChange.packageFlowShow = false
						this.packageChange.packageFlow = ''
						this.packageChange.packageFlowOptions = []
						return
					}
					this.packageChange.packageFlowShow = true
					this.packageChange.packageFlow = ''
					this.packageChange.packageFlowOptions = []
					for (let i = 0; i < data.length; i++) {
						this.packageChange.packageFlowOptions.push({
							value: data[i].userLimit,
							packageFlow: getPackageFlow(data[i].userLimit),
						})
					}
				})
			},
			// 获取表格 数据
			getTableData() {
				let tabIndex = this.tabIndex,
					pageSize = this.pageSize,
					pageNo = this.pageNo,
					cardNo = this.getCardNum(this.tabIndex),
					netWorkType = this.tabIndex === 0 ? this.packageChange.netWorkType : '',
					netWork = this.getNetWorkParams(this.tabIndex),
					userLimit = this.tabIndex === 0 ? this.packageChange.packageFlow : '',
					isSingle = this.tabIndex === 0 ? this.packageChange.flowCalc : '',
					businessCard = this.tabIndex === 0 ? this.packageChange.isCLCard : '',
					packageType = this.tabIndex === 0 ? '1' : '',
					isPage = 1,
					onlineStatus = this.tabIndex === 1 ? '0' : this.tabIndex === 2 ? '1' : '',
					startTime = this.packageChange.startTime,
					endTime = this.packageChange.endTime
				// 如果是套餐变更
				if(tabIndex === 0) {
					// 如果筛选框都没有值的话，则给出提示并且不去请求表格数据
					if (!netWorkType || !netWork || !userLimit || !isSingle) {
						this.$message.info('所有的筛选条件均不能为空');
						return
					}
				}
				// 如果是激活
//				else if(tabIndex === 1) {
//					// 如果筛选框都没有值的话，则给出提示并且不去请求表格数据
//					if(!netWork) {
//						this.$message.info('运营商不能为空');
//						return
//					}
//				}
//				// 如果是停卡
//				else if(tabIndex === 2) {
//					// 如果筛选框都没有值的话，则给出提示并且不去请求表格数据
//					if(!netWork) {
//						this.$message.info('运营商不能为空');
//						return
//					}
//				}
//				// 如果是发送短信
//				else if(tabIndex === 3) {
//					// 如果筛选框都没有值的话，则给出提示并且不去请求表格数据
//					if(!netWork) {
//						this.$message.info('运营商不能为空');
//						return
//					}
//				}
				this.loading = true
				this.$axios({
					url: '/api/v2/device/devicePageList',
					method: 'post',
					params: {
						// 分页
						pageSize: pageSize,
						pageNo: pageNo,
						// 卡号或者ICCID
						cardNo: cardNo,
						// 制式
						netWorkType: netWorkType,
						// 运营商
						netWork: netWork,
						// 套餐流量
						userLimit: userLimit,
						// 流量计算
						isSingle: isSingle,
						// 是否车联卡
//						businessCard: businessCard,
						// 套餐类型
						packageType: packageType,
						// 用于区分卡操作的接口和别的页面的接口，减轻服务器的压力
						isPage: isPage,
						// onlineStatus为1，为停卡，0为复卡
						onlineStatus: onlineStatus,
						// 批次查询
						start: startTime,
						end: endTime
					}
				}).then(res => {
					console.log(res.data)
					let data = res.data.data;
					this.totalCount = res.data.totalCount
					this.operateData = []
					this.deviceIds = res.data.msg
					for (let i = 0; i < data.length; i++) {
						this.operateData.push({
							cardNo: data[i].cardNumber,
							iccid: data[i].iccid,
							netWork: data[i].netWork === 1 ? '移动' : data[i].netWork === 2 ? '联通' : '电信',
							flowPackage: data[i].packages,
							flowUsage: data[i].usageMonth === '' ? '' : parseFloat(data[i].usageMonth).toFixed(2) + 'M',
							flowOverage: data[i].flowOverage === '' ? '' : parseFloat(data[i].flowOverage).toFixed(2) + 'M',
							cardStatus: data[i].cardStatus === 0 ? '在线' : '离线',
							packageType: translatePackages(data[i].packageType),


							system: data[i].networkType === 1 ? '5G' :
								data[i].networkType === 2 ? '4G' :
									data[i].networkType === 3 ? '3G' :
										data[i].networkType === 4 ? '2G' :
											data[i].networkType === 5 ? 'NB' :
												data[i].networkType === 6 ? 'EMTC' : '',
							batchTime: data[i].serveTime.split(' ')[0],
							endTime: data[i].endTime.split(' ')[0],
							cardKind: data[i].cardType === 1 ? '大卡' :
								data[i].cardType === 2 ? '双切' :
									data[i].cardType === 3 ? '三切' :
										data[i].cardType === 4 ? '2*2' :
											data[i].cardType === 5 ? '5*6' :
												data[i].cardType === 6 ? 'eSim' : '其他',
							deviceId: data[i].deviceId
						})
					}
					this.loading = false
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
			// 选中某几行
			selectRows(selection, row) {
				this.currentArr = selection
			},
			// 全选
			selectAll(selection){
				this.currentArr = selection
			},

			// 选取操作按钮
			btnSelect(i) {
				// 变更套餐
				if(this.tabIndex == 0) {
					// 如果是选取操作
					if(i==1) {
						if(!this.currentArr.length) {
							this.$message.info('请先选择要操作的表格项')
						}else {
							let deviceIds = ''
							for(let i=0; i<this.currentArr.length; i++) {
								deviceIds += this.currentArr[i].deviceId + ','
							}
							deviceIds = deviceIds.slice(0,deviceIds.length-1)
							console.log(deviceIds)
							this.$router.push({
								name: 'packageChange',
								params: {
									deviceIds: deviceIds
								}
							})
						}
					}
					// 如果是批量操作
					else {
						if(!this.deviceIds) {
							this.$message.info('当前条件下不可批量更改')
							return
						}
						this.$router.push({
							name: 'packageChange',
							params: {
								deviceIds: this.deviceIds
							}
						})
					}
				}
				// 激活
				else if(this.tabIndex == 1 || this.tabIndex == 2) {
					// 如果是选取操作
					if(i==1) {
						if(!this.currentArr.length) {
							this.$message.info('请先选择要操作的表格项')
						}else {
							let deviceIds = ''
							for(let i=0; i<this.currentArr.length; i++) {
								deviceIds += this.currentArr[i].deviceId + ','
							}
							deviceIds = deviceIds.slice(0,deviceIds.length-1)
							console.log(deviceIds)
							this.$router.push({
								name: 'cardStopRestore',
								params: {
									deviceIds: deviceIds,
									type: this.tabIndex == 1 ? '1' : this.tabIndex == 2 ? '0' : ''
								}
							})
						}
					}
					// 如果是批量操作
					else {
						if(!this.deviceIds) {
							this.$message.info('当前条件下不可批量复卡')
							return
						}
						this.$router.push({
							name: 'cardStopRestore',
							params: {
								deviceIds: this.deviceIds,
								type: this.tabIndex == 1 ? '1' : this.tabIndex == 2 ? '0' : ''
							}
						})
					}
				}
				// 发送短信
				else {
					// 如果是选取操作
					if(i==1) {
						if(!this.currentArr.length) {
							this.$message.info('请先选择要操作的表格项')
						}else {
							let deviceIds = ''
							for(let i=0; i<this.currentArr.length; i++) {
								deviceIds += this.currentArr[i].deviceId + ','
							}
							deviceIds = deviceIds.slice(0,deviceIds.length-1)
							console.log(deviceIds)
							this.$router.push({
								name: 'sendMsg',
								params: {
									deviceIds: deviceIds
								}
							})
						}
					}
					// 如果是批量操作
					else {
						if(!this.deviceIds) {
							this.$message.info('当前条件下不可批量更改')
							return
						}
						this.$router.push({
							name: 'sendMsg',
							params: {
								deviceIds: this.deviceIds
							}
						})
					}
				}
			},

			// 返回运营商
			getNetWorkParams(i) {
				if(i==0) {
					return this.packageChange.netWork
				}else if(i==1) {
					return this.active.netWork
				}else if(i==2) {
					return this.stopCard.netWork
				}else {
					return this.sendMsg.netWork
				}
			},
			// 返回卡号或iccid
			getCardNum(i) {
				if(i==0) {
					return this.packageChange.cardNo
				}else if(i==1) {
					return this.active.cardNo
				}else if(i==2) {
					return this.stopCard.cardNo
				}else {
					return this.sendMsg.cardNo
				}
			},
			// 日期更改的时候
			btnChangeTime() {
				if (!this.packageChange.batchTime) {
					this.packageChange.startTime = ''
					this.packageChange.endTime = ''
					return
				}
				this.packageChange.startTime = format(new Date(this.packageChange.batchTime[0]).getTime(), "Y-m-d")
				this.packageChange.endTime = format(new Date(this.packageChange.batchTime[1]).getTime(), "Y-m-d")
			},
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	borderColor = #e7ebf3
	buttonColor = #878787
	.card-wrap {
		padding-top: 50px;
		padding-left: 200px;
		.content {
			width: 100%;
			height: calc(100vh - 50px);
			padding: 20px;
			overflow-y: scroll;
			/* 卡片操作 */
			.card-operate {
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
				.tab {
					margin-top: 30px;
					/* tab导航栏 */
					.tab-nav {
						border: 1px solid borderColor;
						border-top-left-radius: 10px;
						border-top-right-radius: 10px;
						width: 420px;
						display: flex;
						justify-content: space-around;
						.nav-item {
							padding: 10px 0;
							font-size: 18px;
							color: #3c3d3f;
							cursor: pointer;
						}
						.current {
							color: mainBlue;
						}
					}
					/* tab栏目 */
					.tab-content {
						border: 1px solid borderColor;
						position: relative;
						top: -1px;
						padding: 40px 30px;
						.tab-item {
							display: flex;
							flex-wrap: wrap;
							.tools {
								display: flex;
								flex-wrap: wrap;
							}
							.input {
								width: 350px;
								margin-right: 60px;
								margin-bottom: 34px;
							}
							.select {
								width: 250px;
								margin-right: 60px;
								margin-bottom: 34px;
							}
							.date {
								margin-right: 60px;
							}
							.btn-search {
								width: 100px;
								height: 42px;
								border: 1px solid buttonColor;
								font-size: 18px;
								text-align: center;
								line-height: 42px;
								cursor: pointer;
								border-radius: 5px;
							}
						}
						/* 套餐变更 */
						.package-change {

						}
					}
				}
			}
			/* 操作的表格 */
			.operate-table {
				width: 100%;
				border-radius: 5px;
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				padding: 30px 40px 40px;
				/* 工具栏 */
				.tools {
					display: flex;
					margin-bottom: 20px;
					.btn-operate, .btn-batch {
						width: 142px;
						height: 46px;
						border-radius: 5px;
						border: 1px solid buttonColor;
						font-size: 18px;
						text-align: center;
						line-height: 46px;
						cursor: pointer;
					}
					.btn-operate {
						margin-right: 20px;
					}
				}
				/* 表格 */
				.table {
					.el-pagination {
						text-align: center;
						margin-top: 40px;
					}
				}
			}
		}
	}
</style>


