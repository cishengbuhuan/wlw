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
					<router-link to="/message">
						<div class="more">查看系统消息>></div>
					</router-link>
				</div>
				<ul>
					<li v-for="(item,index) in systemMsg" :key="index" v-if="systemMsg.length != 0">
						<router-link to="/message"><span>{{ item.msg }}</span></router-link>
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
					<!--<div class="no-info" v-show="cardShow">暂时没有数据</div>-->
					<!--<div class="chart-item" v-show="!cardShow" v-for="(item,index) in cardData" :key="index">-->
						<!--<div class="title">{{ item.title }}:{{ item.totalCard }}</div>-->
						<!--<ve-ring :data="item" :colors="cardColors" :settings="cardSettings"-->
						         <!--:extend="cardExtend"></ve-ring>-->
						<!--<img class="bg-img" :src="item.bgImg">-->
						<!--&lt;!&ndash; 没有卡的时候 &ndash;&gt;-->
					<!--</div>-->
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
									<div class="remark"><i></i><span>已销卡</span></div>
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
					<!-- 筛选框 -->
					<el-select v-model="operatorValue"
					           @change="toggleOperator"
					           placeholder="请选择运营商">
						<el-option
								v-for="item in optionsArr"
								:key="item.value"
								:label="item.operator"
								:value="item.value">
						</el-option>
					</el-select>
				</div>
				<!-- 饼状图 -->
				<div class="chart">
					<div class="tips-info" v-show="flowShow">暂时没有相关数据！</div>
					<!--<div class="chart-item-group" v-for="(item,index) in flowData" :key="index">-->
						<!--&lt;!&ndash;<div class="flow-name">单卡限量:{{ item.poolSize }}</div>&ndash;&gt;-->
						<!--<div class="chart-item" v-for="(itemSon,indexSon) in item" :key="indexSon">-->
							<!--<ve-pie :data="itemSon" :settings="flowSettings"-->
							        <!--:extend="flowExtend"></ve-pie>-->
							<!--<div class="title">{{ itemSon.date }}：{{ itemSon.monthTotal }}</div>-->
						<!--</div>-->
					<!--</div>-->
					<div class="chart-item-group" v-for="(item,index) in flowData" :key="index">
						<div class="flow-name">单卡限量:{{ item.flowSize.toFixed(0) }}M</div>
						<div class="chart-item" v-for="(itemSon,indexSon) in item.rowsData" :key="indexSon">
							<ve-pie :data="itemSon" :settings="flowSettings"
							        :colors="itemSon.colors"
							        :extend="flowExtend"></ve-pie>
							<div class="title">{{ itemSon.date }}：{{ itemSon.monthTotal }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import VeRing from "v-charts/lib/ring.common";
	import VePie from "v-charts/lib/pie.common";

	export default {
		components: {
			VeRing,
			VePie
		},
		data() {
			var that = this

			// 流量统计
			this.flowSettings = {
				labelLine: 'show',
				label: {
//					position: 'inside',
					show: false
				},
				radius: 120,
				offsetY: 200,
			}
			this.flowExtend = {
				legend: {
					show: false
				},
				tooltip : {
					trigger: 'item',
					formatter: "{b}:{c}M ({d}%)"
				}
			}

			return {
				colors: [],
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
				// 公司基本信息
				company: {
					name: '',
					cardNum: 0,
					balance: 0
				},
				// 系统信息
				systemMsg: [],
				// 卡片统计饼状图数据
				cardData: [
					{
						title: '',
						totalCard: 0,
						bgImg: '../../static/images/bg-yd.png',
						columns: ['status', 'number'],
						rows: []
					},
					{
						title: '',
						totalCard: 0,
						bgImg: '../../static/images/bg-lt.png',
						columns: ['status', 'number'],
						rows: []
					},
					{
						title: '',
						totalCard: 0,
						bgImg: '../../static/images/bg-dx.png',
						columns: ['status', 'number'],
						rows: []
					}
				],
				// 流量统计饼状图数据
				flowData: [],
				// 运营商的筛选框
				operatorValue: '移动',
				optionsArr: [
					{
						value: '1',
						operator: '移动',
						isChecked: false
					},
					{
						value: '2',
						operator: '联通',
						isChecked: false
					},
					{
						value: '3',
						operator: '电信',
						isChecked: false
					}
				],
				netWork: '',
				defaultNetWork: 1,
				flowShow: false,
				cardShow: false
			};
		},
		mounted() {
			this.getCompanyInfo();
			this.getMsg();
			this.getCardTotal();
			this.getFlowTotal()
		},
		methods: {
			// 获取公司信息
			getCompanyInfo() {
				this.$axios({
					url: '/api/v2/base/getBasal',
					method: 'post'
				}).then(res => {
//                  console.log(res.data)
					let data = res.data.data;
					this.company.name = data.companyName
					this.company.cardNum = data.cardNo
					this.company.balance = data.amount
				})
			},
			// 获取公告信息
			getMsg() {
				this.$axios({
					url: '/api/v2/msg/getTopMsgList',
					method: 'post'
				}).then(res => {
//                  console.log(res.data.data)
					let data = res.data.data
					for (let i = 0; i < data.length; i++) {
						this.systemMsg.push({
							msg: data[i].title
						})
					}
				})
			},
			// 获取卡片统计信息
			getCardTotal() {
				this.$axios({
					url: '/api/v2/device/getDeviceStatus',
					method: 'post'
				}).then(res => {
					if(res.data.code === 0 ) {
						this.cardShow = true;
						return
					}
					this.cardShow = false;
//                  console.log(res.data.data)
					let data = res.data.data
					for (let i = 0; i < data.length; i++) {
//						this.cardData[i].title = data[i].title
						this.card[i].totalCard = data[i].totalCard
						let rows = data[i].rows;
						for (let j = 0; j < rows.length; j++) {
//							this.cardData[i].rows.push({
//								status: rows[j].status,
//								number: rows[j].number
//							})
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
			// 获取流量统计数据
			getFlowTotal() {
				this.$axios({
					url: '/api/v2/pool/poolnetWorkList',
					method: 'post',
					params: {
						netWork: this.netWork ? this.netWork : this.defaultNetWork
					}
				}).then(res => {
					let data = res.data.data;
					var result = [];

					if (data.length === 0) {
						this.flowShow = true;
						this.flowData = []
					} else {
						this.flowShow = false;

						for(let i=0; i<data.length; i++){
							let parentObj = {
								rowsData: []
							};
							parentObj.flowSize = Number(data[i].flowSize);
							for(let j=0; j<data[i].flowData.length; j++){
								let obj = {
									columns: ['status','number'],
									rows: [],
									colors: []
								}
								obj.monthTotal = data[i].flowData[j].monthTotal;
								obj.date = data[i].flowData[j].date;

								for (let k=0; k<data[i].flowData[j].rows.length; k++){
									obj.rows.push({
										status: data[i].flowData[j].rows[k].status,
										number: data[i].flowData[j].rows[k].number,
										color: data[i].flowData[j].rows[k].color
									})
								}
								for (let k=0; k<data[i].flowData[j].rows.length; k++){
									obj.colors = data[i].flowData[j].rows.map(({color}) => color)
								}
								parentObj.rowsData.push(obj)
							}
							result.push(parentObj)
						}
						this.flowData = result
//						console.log(this.flowData)
					}
				})
			},
			// 运营商的下拉框的值发生变化的时候触发
			toggleOperator(val) {
				this.netWork = val;
				this.getFlowTotal()
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
					border: 1px solid #ddd;
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
				border: 1px solid #ddd;
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
				border: 1px solid #ddd;
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
				border: 1px solid #ddd;
				padding-left: 40px;
				padding-right: 40px;
				padding-top: 30px;
				padding-bottom: 30px;
				.flow-title {
					color: #000;
					display: flex;
					line-height: 40px;
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
				}
				.chart {
					.tips-info {
						font-size: 24px;
						text-align: center;
						margin: 50px 0 45px;
						color: #999;
					}
					.chart-item-group {
						display: flex;
						border-bottom: 1px solid #ddd;
						padding-bottom: 20px;
						.flow-name {
							width: 180px;
							font-size: 22px;
							text-align: center;
							padding-top: 180px;
						}
						.chart-item {
							flex: 1;
							text-align: center;
						}
					}
					.chart-item-group:last-child {
						border-bottom: none;
					}
				}
			}
		}
	}
</style>