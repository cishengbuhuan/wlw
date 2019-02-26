<template>
	<div class="flowCard-wrap wrap">
		<div class="content wrap-content">
			<!-- 标题 -->
			<div class="page-title">
				<div class="line"></div>
				<span>套餐信息<span class="small">卡片信息</span></span>
			</div>
			<!-- 表格数据 -->
			<div class="card">
				<!-- tip信息 -->
				<div class="tip">
					<div class="package-name">套餐名称: {{ packageInfo.netWork }} {{ packageInfo.flow }}/{{ packageInfo.type }}</div>
					<div class="batch-date">批次日期: {{ batchDate }}</div>
					<div class="btn-export btn-gray" @click="btnExport">导出</div>
				</div>
				<!-- 表格 -->
				<div class="table-box">
					<el-table
							:data="tableData"
							@sort-change='sortChange'
							border
							v-loading="loading"
							style="width: 100%">
						<el-table-column label="卡号" align="center">
							<template slot-scope="scope">
								<span :class="{ over: scope.row.isOver < 0 }">{{ scope.row.cardNum }}</span>
							</template>
						</el-table-column>
						<el-table-column label="ICCID" align="center">
							<template slot-scope="scope">
								<span :class="{ over: scope.row.isOver < 0 }">{{ scope.row.iccid }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="flowUsage" sortable='custom' width="90" label="本月已使用流量"
						                 align="center">
							<template slot-scope="scope">
								<span :class="{ over: scope.row.isOver < 0 }">{{ scope.row.flowUsage }}</span>
							</template>
						</el-table-column>
						<el-table-column width="110" label="剩余流量" align="center">
							<template slot-scope="scope">
								<span :class="{ over: scope.row.isOver < 0 }">{{ scope.row.flowOverage }}</span>
							</template>
						</el-table-column>
						<el-table-column label="套餐名称" align="center">
							<template slot-scope="scope">
								<span :class="{ over: scope.row.isOver < 0 }">{{ scope.row.packageName }}</span>
							</template>
						</el-table-column>
						<el-table-column label="激活状态" align="center">
							<template slot-scope="scope">
								<span :class="{ over: scope.row.isOver < 0 }">{{ scope.row.activeStatus }}</span>
							</template>
						</el-table-column>
						<el-table-column label="设备在线状态" align="center">
							<template slot-scope="scope">
								<span :class="{ over: scope.row.isOver < 0 }">{{ scope.row.onlineStatus }}</span>
							</template>
						</el-table-column>
						<el-table-column label="GPRS使用状态" align="center">
							<template slot-scope="scope">
								<span :class="{ over: scope.row.isOver < 0 }">{{ scope.row.stopStatus }}</span>
							</template>
						</el-table-column>
						<el-table-column label="制式" align="center">
							<template slot-scope="scope">
								<span :class="{ over: scope.row.isOver < 0 }">{{ scope.row.netWorkType }}</span>
							</template>
						</el-table-column>
						<el-table-column label="卡种类" align="center">
							<template slot-scope="scope">
								<span :class="{ over: scope.row.isOver < 0 }">{{ scope.row.cardType }}</span>
							</template>
						</el-table-column>
						<el-table-column width="120" label="到期时间" align="center">
							<template slot-scope="scope">
								<span :class="{ over: scope.row.isOver < 0 }">{{ scope.row.endTime }}</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="80" align="center">
							<template slot-scope="scope">
								<span class="more" @click="goDetail(scope.row)">单卡详情</span>
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
	import {translatePackages,getOnlineStatus,getNetWork,
		getActiveStatus,getGPRS,translateSystem,translateCardKind,baseUrl} from '../api/dataUtil'
	export default {
		data() {
			return {
				// 套餐信息
				packageInfo: {
					netWork: '',
					flow: '',
					type: ''
				},
				// 批次日期
				batchDate: '',
				// 运营商
				netWork: '',
				// 表格数据
				tableData: [],
				// 表格排序
				sortData: '',
				direct: '',
				// 表格分页
				totalCount: 0,
				pageSize: 20,
				pageNo: 1,
				// 加载
				loading: '',
				// 下载的href
				baseUrl: `${baseUrl}/api/importCardList`,
				uploadHref: '',
			};
		},
		mounted() {
			this.batchDate = this.$route.query.batchTime
			this.netWork = this.$route.query.netWork
			this.netWorkType = this.$route.query.netWorkType
			this.poolId = this.$route.query.poolId
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
			// 获取到卡片信息列表
			getTableData() {
				this.loading = true
				this.$axios({
					url: '/api/v2/device/devicePageList',
					method: 'post',
					params: {
						pageSize: this.pageSize,
						pageNo: this.pageNo,
						// 批次日期
						serveTime: this.batchDate,
						// 运营商
						netWork: this.netWork,
						// 制式
						netWorkType: this.netWorkType,
						// poolId
						poolId: this.poolId,

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
						// 套餐信息
						this.packageInfo.netWork = getNetWork(data[0].netWork)
						this.packageInfo.flow = data[0].packages
						this.packageInfo.type = translatePackages(data[0].packageType)

						for(let i=0; i<data.length; i++) {
							this.tableData.push({
								cardNum: data[i].cardNumber,
								iccid: data[i].iccid,
								flowUsage: Number(data[i].usageMonth).toFixed(2) + 'M',
								flowOverage: Number(data[i].flowOverage) < 0 ? '0.00M' : Number(data[i].flowOverage).toFixed(2) + 'M',
								packageName: `${data[i].packages}/${translatePackages(data[i].packageType)}`,
								onlineStatus: getOnlineStatus(data[i].onlineStatus),
								activeStatus: getActiveStatus(data[i].cardStatus),
								stopStatus: getGPRS(data[i].stopStatus),
								netWorkType: translateSystem(data[i].networkType),
								cardType: translateCardKind(data[i].cardType),
								endTime: data[i].endTime.split(' ')[0],
								deviceId: data[i].deviceId,
								isOver: data[i].flowOverage
							})
						}
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
			// 跳转到单卡详情页面
			goDetail(data) {
				let deviceId = data.deviceId
				this.$router.push({
					path: '/cardDetail',
					query: {
						deviceId: deviceId
					}
				})
			},
			// 导出表格
			btnExport() {
				let token = sessionStorage.getItem('_token'),
					pageSize = this.pageSize,
					pageNo = this.pageNo,

					serveTime = this.batchDate,
					netWork = this.netWork,
					netWorkType = this.netWorkType,
					poolId = this.poolId,

					sort = this.sortData,
					direct = this.direct




				this.uploadHref = `${this.baseUrl}?_token=${token}
					&pageSize=${pageSize}&pageNo=${pageNo}&serveTime=${serveTime}
					&netWork=${netWork}&netWork=${netWork}&netWorkType=${netWorkType}
					&poolId=${poolId}&sort=${sort}&direct=${direct}`

//				console.log(this.uploadHref)

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
	.flowCard-wrap {
		.content {
			/* 表格数据 */
			.card {
				background-color: #fff;
				border-radius: 20px;
				margin-top: 20px;
				padding: 25px 50px;
				/* tip信息 */
				.tip {
					font-size: 24px;
					color: #545454;
					.batch-date {
						margin-top: 20px;
					}
				}
				/* 表格 */
				.table-box {
					margin-top: 40px;
					.over {
						color: #ed1d1d;
					}
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