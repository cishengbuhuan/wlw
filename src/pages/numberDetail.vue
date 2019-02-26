<template>
	<div class="flowCard-wrap wrap">
		<div class="content wrap-content">
			<!-- 标题 -->
			<div class="page-title">
				<div class="line"></div>
				<span>短信发送记录<span class="small">号码详情</span></span>
			</div>
			<!-- 表格数据 -->
			<div class="card">
				<!-- tip信息 -->
				<div class="tip">
					<div class="package-name">
						短信发送时间: {{ sendTime }}
					</div>
				</div>
				<!-- 表格 -->
				<div class="table-box">
					<el-table
							:data="tableData"
							border
							v-loading="loading"
							element-loading-text="正在加载数据，请稍候"
							style="width: 100%">
						<el-table-column label="运营商" prop="netWork" align="center"></el-table-column>
						<el-table-column label="卡号" prop="cardNum" align="center"></el-table-column>
						<el-table-column label="ICCID" prop="iccid" align="center"></el-table-column>
						<el-table-column label="发送内容" prop="sendContent" align="center"></el-table-column>
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
		getActiveStatus,getGPRS,translateSystem,translateCardKind} from '../api/dataUtil'
	export default {
		data() {
			return {
				// 短信发送时间
				sendTime: '',
				// 表格数据
				tableData: [],
				// 表格分页
				totalCount: 0,
				pageSize: 20,
				pageNo: 1,
				// 加载
				loading: '',
				id: ''
			};
		},
		mounted() {

		},
		created() {
			this.id = this.$route.query.id
			this.sendTime = this.$route.query.sendTime
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
				this.pageNo = 1;
				this.getTableData()
			},
			// 获取到卡片信息列表
			getTableData() {
				this.loading = true
				this.$axios({
					url: '/smsRate/smsDetail',
					method: 'post',
					params: {
						pageSize: this.pageSize,
						pageNo: this.pageNo,

						// id
						id: this.id
					}
				}).then(res => {
					this.tableData = []
					let data = res.data.object;
					console.log(data)
					if(res.data.code == 100) {
						this.loading = false
						this.totalCount = res.data.totalCount
						for(let i=0; i<data.length; i++) {
							this.tableData.push({
								netWork: getNetWork(data[i].netWork),
								cardNum: data[i].cardNumber,
								iccid: data[i].iccid,
								sendContent: data[i].content
							})
						}
					}
				})
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