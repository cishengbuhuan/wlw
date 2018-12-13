<template>
	<div class="bill-wrap">
		<div class="content">
			<!-- 发票信息 -->
			<div class="bill-info">
				<div class="info-header">发票信息</div>
				<div class="info-content">
					<!-- 发票类型切换导航 -->
					<div class="type-nav">
						<span>发票类型</span>
						<div class="type-item" @click="toggleType(0)" :class="[{current : navIndex == 0}]">
							<div class="icon"></div>
							<span>增值税普通发票</span>
						</div>
						<div class="type-item" @click="toggleType(1)" :class="[{current : navIndex == 1}]">
							<div class="icon"></div>
							<span>增值税专用发票</span>
						</div>
					</div>
					<!-- 发票信息内容 -->
					<div class="bill-box">
						<!-- 普通发票 -->
						<div class="bill-item" v-show="navIndex == 0">
							<!-- 公司名称 -->
							<div class="item name">
								<span>公司名称:</span>
								<input type="text" v-model="ordinary.name">
							</div>
							<!-- 开票金额 -->
							<div class="item amount">
								<span>开票金额:</span>
								<input type="text" v-model="ordinary.amount">
							</div>
							<!-- 纳税人识别号 -->
							<div class="item identification-number">
								<span>纳税人识别号:</span>
								<input type="text" maxlength="20" v-model="ordinary.idNumber">
							</div>
							<!-- 申请开票 -->
							<div class="btn-apply">申请开票</div>
						</div>
						<!-- 专用发票 -->
						<div class="bill-item" v-show="navIndex == 1">
							<!-- 公司名称 -->
							<div class="item name">
								<span>公司名称:</span>
								<input type="text" v-model="special.name">
							</div>
							<!-- 地址 -->
							<div class="item address">
								<span>地址:</span>
								<input type="text" v-model="special.address">
							</div>
							<!-- 电话 -->
							<div class="item tel">
								<span>电话:</span>
								<input type="text" v-model="special.tel">
							</div>
							<!-- 纳税人识别号 -->
							<div class="item identification-number">
								<span>纳税人识别号:</span>
								<input type="text" maxlength="20" v-model="special.idNumber">
							</div>
							<!-- 公司银行 -->
							<div class="item company-bank">
								<span>公司银行:</span>
								<input type="text" v-model="special.companyBank">
							</div>
							<!-- 银行卡号 -->
							<div class="item bankCard-number">
								<span>银行卡号:</span>
								<input type="text" v-model="special.bankCardNumber">
							</div>
							<!-- 开票金额 -->
							<div class="item amount">
								<span>开票金额:</span>
								<input type="text" v-model="special.amount">
							</div>
							<!-- 申请开票 -->
							<div class="btn-apply">申请开票</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				navIndex: 0,
				// 普通发票
				ordinary: {
					name: '',
					amount: '',
					idNumber: ''
				},
				// 专用发票
				special: {
					name: '',
					address: '',
					tel: '',
					idNumber: '',
					companyBank: '',
					bankCardNumber: '',
					amount: ''
				}
			};
		},
		methods: {
			toggleType(index) {
				this.navIndex = index
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	.bill-wrap {
		padding-top: 50px;
		padding-left: 200px;
		.content {
			width: 100%;
			height: calc(100vh - 50px);
			padding: 20px;
			overflow-y: scroll;
			/* 发票信息 */
			.bill-info {
				width: 100%;
				border-radius: 5px;
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				padding: 50px 60px;
				.info-header {
					font-size: 24px;
				}
				.info-content {
					/* 发票类型切换导航 */
					.type-nav {
						display: flex;
						font-size: 18px;
						margin-top: 50px;
						span {
							color: #666;
						}
						.type-item {
							display: flex;
							margin-left: 40px;
							cursor: pointer;
							.icon {
								width: 16px;
								height: 16px;
								border: 1px solid #383838;
								border-radius: 50%;
								margin-top: 4px;
								margin-right: 10px;
								position: relative;
							}
							span {
								color: #333;
							}
						}
						.current {
							.icon:after {
								display: block;
								content: '';
								width: 10px;
								height: 10px;
								border-radius: 50%;
								background-color: mainBlue;
								transform: translate(-50%, -50%);
								position: absolute;
								left: 50%;
								top: 50%;
							}
							span {
								color: #028bdb;
							}
						}
					}
					/* 发票信息内容 */
					.bill-box {
						.bill-item {
							margin-top: 50px;
							.item {
								line-height: 36px;
								margin-bottom: 30px;
								span {
									font-size: 18px;
									color: #666666;
									margin-right: 10px;
								}
								input {
									width: 220px;
									height: 36px;
									border: 1px solid #999;
									padding-left: 15px;
									font-size: 18px;
								}
							}
							/* 申请开票 */
							.btn-apply {
								width: 170px;
								height: 40px;
								line-height: 40px;
								border-radius: 5px;
								background-color: mainBlue;
								text-align: center;
								color: #fff;
								cursor: pointer;
								font-size: 18px;
							}
						}
					}
				}
			}
		}
	}
</style>


