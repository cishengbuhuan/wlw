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
					<!--<router-link to="/message">-->
						<!--<div class="more">查看系统消息>></div>-->
					<!--</router-link>-->
				</div>
				<ul>
					<li v-for="(item,index) in systemMsg"
					    :key="index"
					    @click="watchMsgDetail"
					    v-if="systemMsg.length != 0">
						<span>{{ item.msg }}</span>
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
								v-for="item in optionsArr"
								:key="item.value"
								:label="item.operator"
								:value="item.value">
						</el-option>
					</el-select>
					<!-- 种类 -->
					<el-select v-model="operatorValue"
					           @change="toggleOperator"
					           placeholder="请选择套餐种类">
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
		<!-- 公告的详情弹出框 -->
		<div class="modal-msg" v-show="msgDetailShow" @click.self="msgDetailShow = false">
			<div class="msg-content">
				<div class="msg-header"></div>
				<div class="msg-body"></div>
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
				cardShow: false,
				// 公告详情
				msgDetailShow: false
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
							msg: data[i].content
						})
					}
				})
			},
			// 查看公告的详情
			watchMsgDetail() {
				this.msgDetailShow = true
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
						console.log(this.flowData)
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