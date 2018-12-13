<template>
	<div class="index-wrap">
		<div class="content">
			<!-- 公司名称和账户余额 -->
			<div class="name-balance">
				<div class="company-name">
					<div class="title">{{ company.name }}</div>
					<div class="card-num">
						<div class="icon" :style="cardNumIcon"></div>
						卡片总数：<span>{{ company.cardNum }}</span></div>
				</div>
				<div class="balance">
					<div class="title">
						<div class="icon" :style="balanceIcon"></div>
						<span>账户余额</span></div>
					<div class="num-button">
						<span>{{ company.balance }}</span>
						<router-link to="/recharge">
							<input type="button" value="立即充值">
						</router-link>
					</div>
				</div>
			</div>
			<!-- 系统消息 -->
			<div class="system-msg">
				<div class="msg-title">
					<div class="left">
						<i class="line"></i>
						公告
						<div class="icon" :style="msgTitleIcon"></div>
					</div>
				</div>
				<ul>
					<li v-for="(item,index) in systemMsg"
					    :key="index"
					    @click="watchMsgDetail(item)"
					    v-if="systemMsg.length != 0">
						<span>{{ item.content }}</span>
						<div class="isNew"><img src="../../static/images/is-new.png" alt=""></div>
					</li>
					<li v-if="systemMsg.length == 0">暂无公告信息！</li>
				</ul>
			</div>
			<!-- 卡片统计 -->
			<div class="card-count">
				<div class="card-title">
					<i class="line"></i>卡片统计
				</div>
				<div class="chart">
					<div class="chart-item" v-for="(item,index) in card" :key="index">
						<div class="title">{{ item.title }}：{{ item.totalCard }}</div>
						<!-- 图片提示信息 -->
						<img class="img-info" :src="item.bgImgNoData" v-show="item.totalCard == 0">
						<img class="img-info" :src="item.bgImgHaveData" v-show="item.totalCard != 0">
						<!-- 底部的提示信息 -->
						<div class="tips">
							<div class="tips-top">
								<!-- 已激活 -->
								<div class="active tips-item">
									<div class="remark"><i></i><span>已激活</span></div>
									<div class="num">{{ item.tips.active }}</div>
								</div>
								<!-- 已停卡 -->
								<div class="stop tips-item">
									<div class="remark"><i></i><span>已停卡</span></div>
									<div class="num">{{ item.tips.stop }}</div>
								</div>
								<!-- 已欠费 -->
								<div class="consumed tips-item">
									<div class="remark"><i></i><span>已欠费</span></div>
									<div class="num">{{ item.tips.consumed }}</div>
								</div>
							</div>
							<div class="tips-bottom">
								<!-- 沉默期 -->
								<div class="silent tips-item">
									<div class="remark"><i></i><span>沉默期</span></div>
									<div class="num">{{ item.tips.silent }}</div>
								</div>
								<!-- 已销卡 -->
								<div class="sold tips-item">
									<!--<div class="remark"><i></i><span>已销卡</span></div>-->
									<div class="remark"><i></i><span>状态更新中</span></div>
									<div class="num">{{ item.tips.sold }}</div>
								</div>
								<!-- 未获取 -->
								<div class="unknown tips-item">
									<div class="remark"><i></i><span>未获取</span></div>
									<div class="num">{{ item.tips.unknown }}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 流量统计 -->
			<div class="flow-count">
				<!-- 流量统计的header -->
				<div class="flow-title">
					<span>
						<i class="line"></i>流量统计
					</span>
					<div class="used">
						<div class="icon"></div>
						已使用
					</div>
					<div class="unused">
						<div class="icon"></div>
						未使用
					</div>
					<div class="exceeded">
						<div class="icon"></div>
						已超出
					</div>
					<!-- 运营商 -->
					<el-select v-model="operatorValue"
					           @change="toggleOperator"
					           placeholder="请选择运营商">
						<el-option
								v-for="item in optionsOperator"
								:key="item.value"
								:label="item.operator"
								:value="item.value">
						</el-option>
					</el-select>
					<!-- 种类 -->
					<el-select v-model="kindValue"
					           class="packagesKind"
					           @change="toggleKind"
					           placeholder="请选择套餐种类">
						<el-option
								v-for="item in optionsKind"
								:key="item.value"
								:label="item.kind"
								:value="item.value">
						</el-option>
					</el-select>
				</div>
				<!-- 柱状图 -->
				<div class="chart">
					<ve-bar :data="flowData"
					        :settings="flowSettings"
					        :colors="colors"
					        :extend="flowExtend">
					</ve-bar>
				</div>
			</div>
		</div>
		<!-- 公告的详情弹出框 -->
		<div class="modal-msg" v-show="msgDetailShow" @click.self="msgDetailShow = false">
			<div class="msg-content">
				<div class="msg-header">
					<div class="icon"></div>
					<span>{{ title }}</span>
					<div class="icon"></div>
				</div>
				<div class="msg-body">{{ content }}</div>
			</div>
		</div>
	</div>
</template>

<script>
	import VeBar from "v-charts/lib/bar.common";

	export default {
		components: {
			VeBar
		},
		data() {
			// 流量统计
			this.flowSettings = {
				stack: {
					'xxx': ['usage', 'unused', 'exceeded']
				},
				legendName: {
					'usage': '已使用',
					'unused': '未使用',
					'exceeded': '已超出'
				},
				labelMap: {
					'usage': '已使用',
					'unused': '未使用',
					'exceeded': '已超出'
				}
			}
			this.flowExtend = {
				tooltip: {
					formatter: function (params) {
						return `流量池: ${params[0].axisValue}</br>
								<span style='display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; background-color: ${params[0].color};'></span>${params[0].seriesName}: ${params[0].value}M</br>
								<span style='display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; background-color: ${params[1].color};'></span>${params[1].seriesName}: ${params[1].value}M</br>
								<span style='display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; background-color: ${params[2].color};'></span>${params[2].seriesName}: ${params[2].value}M`
					}
				},
				barMaxWidth: '50'
			}
			return {
				colors: ['#4cb2ff', '#bbbbbb', '#da2627'],
				// 公司基本信息
				company: {
					name: '',
					cardNum: 0,
					balance: 0
				},
				cardNumIcon: {
					width: '25px',
					height: '20px',
					background: "url(" + require('../../static/images/icon-card.png') + ") no-repeat",
					backgroundSize: '100% 100%',
					marginRight: '20px',
					marginTop: '5px'
				},
				balanceIcon: {
					width: '20px',
					height: '20px',
					background: "url(" + require('../../static/images/icon-balance.png') + ") no-repeat",
					backgroundSize: '100% 100%',
					marginRight: '15px',
					marginTop: '5px'
				},
				msgTitleIcon: {
					width: '21px',
					height: '18px',
					background: "url(" + require('../../static/images/icon-announcement.png') + ") no-repeat",
					backgroundSize: '100% 100%',
					marginLeft: '10px',
					marginTop: '5px'
				},
				// 系统信息
				systemMsg: [],
				// 卡片统计
				card: [
					{
						title: '移动',
						totalCard: 0,
						bgImgNoData: require('../../static/images/card-yd.jpg'),
						bgImgHaveData: require('../../static/images/card-yd-active.png'),
						tips: {
							active: '--',
							stop: '--',
							consumed: '--',
							silent: '--',
							sold: '--',
							unknown: '--'
						}
					},
					{
						title: '联通',
						totalCard: 0,
						bgImgNoData: require('../../static/images/card-lt.jpg'),
						bgImgHaveData: require('../../static/images/card-lt-active.png'),
						tips: {
							active: '--',
							stop: '--',
							consumed: '--',
							silent: '--',
							sold: '--',
							unknown: '--'
						}
					},
					{
						title: '电信',
						totalCard: 0,
						bgImgNoData: require('../../static/images/card-dx.jpg'),
						bgImgHaveData: require('../../static/images/card-dx-active.png'),
						tips: {
							active: '--',
							stop: '--',
							consumed: '--',
							silent: '--',
							sold: '--',
							unknown: '--'
						}
					}
				],
				// 流量统计饼状图数据
				flowData: {
					columns: ['flowSize', 'usage', 'unused', 'exceeded'],
					rows: []
				},
				// 运营商的筛选框
				operatorValue: '',
				optionsOperator: [],
				// 套餐种类
				kindValue: '',
				optionsKind: [],
				netWork: '',
				defaultNetWork: 1,
				packageType: '',
				defaultPackageType: '',
				flowShow: false,
				cardShow: false,
				// 公告详情
				msgDetailShow: false,
				// 公告弹出框的标题和内容
				title: '',
				content: ''
			};
		},
		mounted() {
			this.getCompanyInfo();
			this.getMsg();
			this.getCardTotal();
			this.getNetWork()
		},
		created() {
		},
		methods: {
			// 获取公司信息
			getCompanyInfo() {
				this.$axios({
					url: '/api/v2/base/getBasal',
					method: 'post'
				}).then(res => {
					let data = res.data.data;
					this.company.name = data.companyName
					this.company.cardNum = data.cardNo
					this.company.balance = data.amount
				})
			},
			// 获取公告信息
			getMsg() {
				this.$axios({
					url: '/announce/commeAnnouce',
					method: 'post',
					params: {
						pageSize: 10,
						pageNo: 1
					}
				}).then(res => {
					let data = res.data.data
					for (let i = 0; i < data.length; i++) {
						this.systemMsg.push({
							content: data[i].content,
							id: data[i].id,
							title: data[i].title
						})
					}
				})
			},
			// 查看公告的详情
			watchMsgDetail(item) {
				this.msgDetailShow = true
				this.title = item.title
				this.content = item.content
			},
			// 获取卡片统计信息
			getCardTotal() {
				this.$axios({
					url: '/api/v2/device/getDeviceStatus',
					method: 'post'
				}).then(res => {
					if (res.data.code === 0) {
						this.cardShow = true;
						return
					}
					this.cardShow = false;
					let data = res.data.data
					for (let i = 0; i < data.length; i++) {
						this.card[i].totalCard = data[i].totalCard
						let rows = data[i].rows;
						for (let j = 0; j < rows.length; j++) {
							this.card[i].tips.active = rows[0].number == 0 ? '--' : rows[0].number;
							this.card[i].tips.stop = rows[1].number == 0 ? '--' : rows[1].number;
							this.card[i].tips.consumed = rows[2].number == 0 ? '--' : rows[2].number;
							this.card[i].tips.silent = rows[3].number == 0 ? '--' : rows[3].number;
							this.card[i].tips.sold = rows[4].number == 0 ? '--' : rows[4].number;
							this.card[i].tips.unknown = rows[5].number == 0 ? '--' : rows[5].number;
						}
					}
				})
			},
			// 获取流量统计的运营商筛选框
			getNetWork() {
				this.$axios({
					url: '/api/getNetWorkAndPack',
					method: 'post'
				}).then(res => {
					// console.log(res.data.data)
					let data = res.data.data
					this.optionsOperator = []
					// 如果返回的数据为空的话，则不做处理直接return
					if (!data.length) {
						return
					}
					this.operatorValue = this.transformNetWork(data[0].netWork)
					this.defaultNetWork = data[0].netWork
					for (let i = 0; i < data.length; i++) {
						this.optionsOperator.push({
							value: data[i].netWork,
							operator: this.transformNetWork(data[i].netWork)
						})
					}
					this.getPackagesKind()
				})
			},
			// 获取流量统计的套餐种类的筛选框
			getPackagesKind() {
				let netWork = this.netWork ? this.netWork : this.defaultNetWork
				// 如果network为空，即代表着运营商未获取到，不做请求，直接return
				if (!netWork) {
					return
				}
				this.$axios({
					url: '/api/getNetWorkAndPack',
					method: 'post',
					params: {
						netWork: netWork
					}
				}).then(res => {
					// console.log(res.data.data)
					let data = res.data.data
					this.optionsKind = []
					// 如果返回的数据为空的话，则不做处理直接return
					if (!data.length) {
						return
					}
					this.kindValue = this.transformPackageType(data[0].packageType)
					this.defaultPackageType = data[0].packageType
					for (let i = 0; i < data.length; i++) {
						this.optionsKind.push({
							value: data[i].packageType,
							kind: this.transformPackageType(data[i].packageType)
						})
					}
					// 获取到流量统计数据
					this.getFlowTotal()
				})
			},
			// 获取流量统计数据
			getFlowTotal() {
				let netWork = this.netWork ? this.netWork : this.defaultNetWork
				let packageType = this.packageType ? this.packageType : this.defaultPackageType
//				console.log(netWork,packageType)
				// 如果运营商和套餐种类有一项为空，则不做请求直接return
				if (!netWork || !packageType) {
					return
				}
				this.$axios({
					url: '/api/v2/pool/poolnetWorkList',
					method: 'post',
					params: {
						netWork: netWork,
						packageType: packageType
					}
				}).then(res => {
					let data = res.data.object;
					console.log(data)
					this.flowData.rows = []
					for (let i = 0; i < data.length; i++) {
						this.flowData.rows.push({
							flowSize: data[i].dataSize + 'M',
							usage: data[i].poolUse,
							unused: data[i].unused,
							exceeded: this.transformExceeded(data[i].total, data[i].poolUse)
						})
					}
				})
			},
			// 运营商的下拉框的值发生变化的时候触发
			toggleOperator(val) {
				this.netWork = val;
				this.getPackagesKind()
			},
			// 套餐种类的下拉框的值发生变化的时候触发
			toggleKind(val) {
				this.packageType = val;
				this.getFlowTotal()
			},
			// 处理返回的运营商
			transformNetWork(i) {
				if (i == 1) {
					return '移动'
				} else if (i == 2) {
					return '联通'
				} else {
					return '电信'
				}
			},
			// 处理返回的套餐类型
			transformPackageType(i) {
				if (i == 1) {
					return '月'
				} else if (i == 2) {
					return '半年'
				} else if (i == 3) {
					return '季'
				} else {
					return '年'
				}
			},
			// 处理流量统计的已超出
			transformExceeded(total, usage) {
				if (total < usage) {
					return usage - total
				} else {
					return 0
				}
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	.index-wrap {
		padding-top: 50px;
		padding-left: 200px;
		.content {
			width: 100%;
			height: calc(100vh - 50px);
			padding: 20px;
			overflow-y: scroll;
			/* 公司名称和账户余额 */
			.name-balance {
				display: flex;
				justify-content: space-between;
				margin-bottom: 20px;
				.company-name, .balance {
					width: 49.5%;
					height: 170px;
					box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
					border-radius: 5px;
					padding-left: 40px;
					.title {
						font-size: 24px;
						color: #999;
						margin: 35px auto 40px;
					}
					.card-num {
						font-size: 18px;
						color: #999;
						display: flex;
						line-height: 30px;
						span {
							font-size: 22px;
							color: #000;
						}
					}
				}
				.balance {
					.title {
						display: flex;
					}
					.num-button {
						padding-left: 60px;
						span {
							font-size: 22px;
							color: #000;
						}
						input {
							width: 72px;
							height: 22px;
							border: 1px solid mainBlue;
							border-radius: 5px;
							color: mainBlue;
							font-size: 14px;
							margin-left: 60px;
							cursor: pointer;
						}
					}
				}
			}
			/* 系统消息 */
			.system-msg {
				width: 100%;
				border-radius: 5px;
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				padding-left: 40px;
				padding-top: 20px;
				padding-bottom: 20px;
				margin-bottom: 20px;
				.msg-title {
					display: flex;
					justify-content: space-between;
					margin-bottom: 10px;
					padding-right: 40px;
					.left {
						font-size: 20px;
						display: flex;
						.line {
							display: block;
							width: 6px;
							height: 28px;
							background-color: mainBlue;
							margin-right: 5px;
						}
					}
					.more {
						font-size: 16px;
						cursor: pointer;
						color: #999;
					}
				}
				ul {
					li {
						line-height: 32px;
						font-size: 16px;
						color: #666666;
						display: flex;
						cursor: pointer;
						.isNew {
							width: 31px;
							height: 12px;
							margin-left: 60px;
							img {
								width: 100%;
								height: 100%;
							}
						}
					}
				}
			}
			/* 卡片统计 */
			.card-count {
				width: 100%;
				/*height: 550px;*/
				border-radius: 5px;
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				padding-left: 40px;
				padding-top: 30px;
				padding-bottom: 30px;
				margin-bottom: 20px;
				.card-title {
					font-size: 20px;
					color: #000;
					display: flex;
					/*border-bottom: 1px solid red;*/
					.line {
						width: 6px;
						height: 28px;
						display: block;
						background-color: mainBlue;
						margin-right: 5px;
					}
				}
				.chart {
					display: flex;
					.no-info {
						font-size: 24px;
						text-align: center;
						margin: 50px 0 45px;
						color: #999;
					}
					.chart-item {
						flex: 1;
						text-align: center;
						position: relative;
						margin: 0 35px;
						/*.bg-img {
							font-size: 20px;
							transform: translate(-50%,-50%);
							position: absolute;
							left: 50%;
							top: 43%;
						}*/
						/* 图片提示信息 */
						.title {
							margin-bottom: 20px;
						}
						.img-info {
							width: 212px;
							height: 212px;
							border-radius: 50%;
						}
						/* 底下的文字提示信息 */
						.tips {
							margin-top: 30px;
							.tips-top, .tips-bottom {
								display: flex;
								justify-content: space-between;
								flex-wrap: wrap;
								.tips-item {
									flex: 1;
									.remark {
										display: flex;
										justify-content: center;
										i {
											display: block;
											width: 11px;
											height: 11px;
											border-radius: 50%;
											margin-top: 4px;
										}
										span {
											font-size: 14px;
											margin-left: 5px;
										}
									}
									.num {
										font-size: 20px;
										margin-top: 10px;
									}
								}

							}
							.tips-top {
								margin-bottom: 20px;
							}
							/* 已激活 */
							.active {
								.remark {
									i {
										background-color: #ffbf00;
									}
								}
							}
							/* 已停卡 */
							.stop {
								.remark {
									i {
										background-color: #fa5e5b;
									}
								}
							}
							/* 已欠费 */
							.consumed {
								.remark {
									i {
										background-color: #20a0ff;
									}
								}
							}
							/* 沉默期 */
							.silent {
								.remark {
									i {
										background-color: #13ce66;
									}
								}
							}
							/* 已销卡 */
							.sold {
								.remark {
									i {
										background-color: #4dd0e1;
									}
								}
							}
							/* 未获取 */
							.unknown {
								.remark {
									i {
										background-color: #bbb;
									}
								}
							}
						}
					}
				}
			}
			/* 流量统计 */
			.flow-count {
				width: 100%;
				/*height: 620px;*/
				border-radius: 5px;
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				padding-left: 40px;
				padding-right: 40px;
				padding-top: 30px;
				padding-bottom: 30px;
				.flow-title {
					color: #000;
					display: flex;
					line-height: 40px;
					margin-bottom 50px
					span {
						font-size: 20px;
						margin-right: 35px;
						display: flex;
						.line {
							width: 6px;
							height: 28px;
							display: block;
							background-color: mainBlue;
							margin-right: 5px;
							margin-top: 5px;
						}
					}
					.used, .unused, .exceeded {
						line-height: 40px;
						display: flex;
						margin-right: 40px;
						.icon {
							width: 11px;
							height: 11px;
							background-color: #4cb2ff;
							margin-top: 14px;
							margin-right: 20px;
						}
					}
					.unused {
						.icon {
							background-color: #bbbbbb;
						}
					}
					.exceeded {
						.icon {
							background-color: #da2627;
						}
					}
					.packagesKind {
						margin-left 30px
					}
				}
				.chart {
					.tips-info {
						font-size: 24px;
						text-align: center;
						margin: 50px 0 45px;
						color: #999;
					}
				}
			}
		}
	// 公告详情的弹出框
		.modal-msg {
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.2);
			position: fixed;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 999;
			.msg-content {
				width: 600px;
				height: 400px;
				background-color: #fff;
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				transform: translate(-50%, -50%);
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
				.msg-body {
					font-size 24px
					padding 0 20px
				}
			}
		}
	}
</style>