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
							<!-- ICCID或者卡号 -->
							<el-input
									clearable
									placeholder="请输入ICCID或者卡号"
									class="input"
									v-model="packageChange.cardNo">
							</el-input>
							<!-- 制式 -->
							<el-select v-model="packageChange.system"
							           clearable
							           class="select"
							           placeholder="请选择制式">
								<el-option
										v-for="item in packageChange.systemOptions"
										:key="item.value"
										:label="item.system"
										:value="item.value">
								</el-option>
							</el-select>
							<!-- 运营商 -->
							<el-select v-model="packageChange.netWork"
							           clearable
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
							<el-select v-model="packageChange.packageType"
							           clearable
							           class="select"
							           placeholder="请选择套餐流量">
								<el-option
										v-for="item in packageChange.packageTypeOptions"
										:key="item.value"
										:label="item.packageType"
										:value="item.value">
								</el-option>
							</el-select>
							<!-- 查询按钮 -->
							<div class="btn-search">查询</div>
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
							<div class="btn-search">查询</div>
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
							<div class="btn-search">查询</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 操作的表格 -->
			<div class="operate-table">
				<!-- 工具栏 -->
				<div class="tools" v-show="operateData.length">
					<div class="btn-operate" @click="btnSelect">选取操作</div>
					<div class="btn-batch">批量操作</div>
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
						<el-table-column prop="startTime" label="计费时间" align="center"></el-table-column>
						<el-table-column prop="endTime" label="到期时间" align="center"></el-table-column>
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
	import {timestampToTime, format, translatePackages, baseUrl} from '../api/dataUtil'

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
						nav: '激活',
					},
					{
						nav: '停卡',
					}
				],
				// 操作的表格
				operateData: [
					{
						cardNo: '1',
						iccid: '1234567',
						netWork: '移动',
						flowPackage: '10M',
						flowUsage: '100M',
						flowOverage: '20M',
						cardStatus: '离线',
						packageType: '年',
						system: '4G',
						startTime: '2018-02-01',
						endTime: '2019-01-31',
						cardKind: '三切'
					}
				],
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
					system: '',
					systemOptions: [
						{
							value: '1',
							system: '4G'
						},
						{
							value: '2',
							system: '2G'
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
						}
					],
					// 套餐类型
					packageType: '',
					packageTypeOptions: [
						{
							value: '1',
							packageType: '年'
						},
						{
							value: '2',
							packageType: '月'
						}
					]
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

				// 当前选中的数组
				currentArr: []
			};
		},
		mounted() {
		},
		methods: {
			// 切换卡片操作的导航
			toggleNav(index) {
				this.tabIndex = index
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
					url: '',
					method: 'post',
					params: {

					}
				}).then(res => {
//					console.log(res.data.data)
					let data = res.data.data;
					this.totalCount = res.data.totalCount
					this.tableData = []
					for (let i = 0; i < data.length; i++) {
						this.tableData.push({
							cardNo: data[i].cardNumber,
							iccid: data[i].iccid,
							netWork: data[i].netWork === 1 ? '移动' : data[i].netWork === 2 ? '联通' : '电信',
							flowPackage: data[i].packages,
							flowUsage: data[i].usageMonth == '' ? '' : parseFloat(data[i].usageMonth).toFixed(2) + 'M',
							flowOverage: data[i].flowOverage == '' ? '' : parseFloat(data[i].flowOverage).toFixed(2) + 'M',
							cardStatus: data[i].cardStatus === 0 ? '在线' : '离线',
							packageType: translatePackages(data[i].packageType),


							system: data[i].networkType === 1 ? '5G' :
								data[i].networkType === 2 ? '4G' :
									data[i].networkType === 3 ? '3G' :
										data[i].networkType === 4 ? '2G' :
											data[i].networkType === 5 ? 'NB' :
												data[i].networkType === 6 ? 'EMTC' : '',
							startTime: data[i].startTime.split(' ')[0],
							endTime: data[i].endTime.split(' ')[0],
							cardKind: data[i].cardType === 1 ? '大卡' :
								data[i].cardType === 2 ? '双切' :
									data[i].cardType === 3 ? '三切' :
										data[i].cardType === 4 ? '2*2' :
											data[i].cardType === 5 ? '5*6' :
												data[i].cardType === 6 ? 'eSim' : '其他',
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
			btnSelect() {
				// 变更套餐
				if(this.tabIndex == 0) {
					if(!this.currentArr.length) {
						this.$message.info('请先选择要操作的表格项')
					}else {
						this.$router.push({path: '/packageChange'})
					}
				}
				// 激活
				else if(this.tabIndex == 1) {
					if(!this.currentArr.length) {
						this.$message.info('请先选择要操作的表格项')
					}else {
						this.$router.push({path: '/cardActive'})
					}
				}
				// 停卡
				else if(this.tabIndex == 2) {
					if(!this.currentArr.length) {
						this.$message.info('请先选择要操作的表格项')
					}else {
						this.$router.push({path: '/cardStop'})
					}
				}
			}
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
						width: 370px;
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
							.input {
								width: 350px;
								margin-right: 60px;
								margin-bottom: 34px;
							}
							.select {
								width: 250px;
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


