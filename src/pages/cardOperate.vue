<template>
	<div class="cardOperate-wrap wrap">
		<div class="content wrap-content">
			<!-- 标题 -->
			<div class="page-title">
				<div class="line"></div>
				<span>{{ title }}</span>
			</div>
			<!-- 停复卡 -->
			<div class="stop-restore">
				<!-- 卡号 -->
				<div class="card-number">
					<span>卡号/ICCID</span>
					<div class="card-box"
					     v-loading="cardBoxLoading"
					     element-loading-text="正在加载数据，请稍侯">
						<p>{{ cardNum }}</p>
					</div>
					<!-- 添加流量卡按钮 -->
					<div class="btn-add btn-main" @click="addFlow">添加流量卡</div>
				</div>
				<!-- 协议 -->
				<div class="protocol">
					<div class="tip">确认是否{{ operateName }}所选流量卡？</div>
					<div class="agreement">
						<input type="checkbox" v-model="checked">
						我已同意<span @click="alertProtocol">《用户协议》</span>
					</div>
				</div>
				<!-- 按钮组 -->
				<div class="btn-group">
					<div class="btn-item btn-back btn-gray" @click="btnSure(0)">返回</div>
					<div class="btn-item btn-sure btn-main" @click="btnSure(1)">确认</div>
				</div>
			</div>
		</div>
		<!-- 添加流量卡 -->
		<div class="addFlow-modal" v-show="addModal" @click.self="addModal = false">
			<div class="add-flow">
				<div class="add-header">添加流量卡</div>
				<div class="add-box">
					<!-- 工具栏 -->
					<div class="tools">
						<!-- 运营商 -->
						<div class="net-work">
							<span>运营商: </span>
							<el-select class="select"
							           placeholder="请选择"
							           v-model="tools.netWork">
								<el-option
										v-for="item in tools.netWorkOptions"
										:key="item.value"
										:label="item.netWork"
										:value="item.value">
								</el-option>
							</el-select>
						</div>
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
						<!-- 搜索按钮 -->
						<div class="btn-search btn-main" @click="btnSearch">搜索</div>
					</div>
					<!-- table -->
					<div class="table-box">
						<el-table
								:data="tableData"
								@sort-change='sortChange'
								@select="selectRows"
								@select-all="selectAll"
								border
								v-loading="loading"
								max-height="250"
								style="width: 100%">
							<el-table-column type="selection" width="55" align="center"></el-table-column>
							<el-table-column prop="cardNum" label="卡号" align="center"></el-table-column>
							<el-table-column prop="iccid" label="ICCID" align="center"></el-table-column>
							<el-table-column prop="netWork" label="运营商" width="90" align="center"></el-table-column>
							<el-table-column prop="flowUsage" label="本月已使用流量" sortable='custom'
							                 width="160"  align="center"></el-table-column>
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
						<div class="btn-group" v-show="tableData.length">
							<div class="btn-select btn-green" @click="btnSelect(1)">选取操作</div>
							<div class="btn-all btn-main" @click="btnSelect(2)">全量操作</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 协议弹出层 -->
		<div class="protocol-wrap" v-show="modalProtocol">
			<div class="protocol-box">
				<div class="box-header">
					<img src="../../static/images/protocol-logo.png">
					<div class="line"></div>
					<span>物联网卡免责协议</span>
				</div>
				<div class="box-content">
					<p>
						访问者在接受上海梦初想通信技术有限公司物联网卡服务前请务必仔细阅读本条款并同意本声明。平台指上海梦初想通信技术有限公司，以下简称平台。
					</p>
					<p>鉴于：</p>
					<p>
						用户愿意使用平台的物联网业务服务，用于从事通信业务，平台愿意为用户提供物联网业务服务。为此，双方经友好协商，达成如下协议：
					</p>
					<h5>
						第一条  定义
					</h5>
					<p>
						本协议中没有明确规定的其他相关词语，按照中国法律法规、政府部门的规定、或有权部门的政策性规定解释，没有以上文件明确解释的，参考行业惯例解释。
					</p>
					<h5>
						第二条  合同内容
					</h5>
					<p>
						平台提供的物联网业务服务包括平台服务与通信服务。
					</p>
					<p>
						1.平台服务：是指提供物联网平台的访问权限、标准文档、在线和电话支持， 以及创建和管理账户的访问权限等，帮助用户进行物联网连接管理。
					</p>
					<p>
						2.通信服务：是在现有技术条件下的网络与设施覆盖范围内的电信服务，包括数据、短信、语音。
					</p>
					<h5>
						第三条  用户权利义务 
					</h5>
					<p>
						1.用户有权享受本协议约定的通信服务并在平台提供的通信服务项目中选择和变更自己所需要的服务，有权对平台的通信业务服务质量进行监督和申诉。用户作为平台的大客户，有权享受平台提供的相应的大客户服务。
					</p>
					<p>
						2.用户不得利用平台提供的服务从事违法犯罪、妨碍社会治安的活动。并且，用户不得以任何名义及方式将其使用的平台业务以任何名义及方式（包括赠与、转租、转借、转售等）提供给第三方。
					</p>
					<p>
						3.用户自行负责其运行设备和应用程序的维护和管理，并遵守平台安全、注册、访问和使用规则，对于任何非因平台服务问题引起的故障，用户应自行负责处理和解决。
					</p>
					<p>
						4.用户应尽力避免未经授权的访问或使用服务。如发现任何未经授权使用用户账户登录平台或其他可能导致平台账户遭窃、遗失的情况，用户应及时通知平台。
					</p>
					<p>
						5.如平台有合理理由怀疑客户存在异常设备使用，平台有权停止对客户的服务。异常的设备使用是指设备无法正常运行，频繁重试、重新连接或重新启动。这种行为会致使平台的电信系统超载，平台会根据实际情况，采取必要预防措施防止异常的设备使用。
					</p>
					<p>
						6.用户应履行工信部、公安部及工商总局关于实名登记义务，配合平台对物联网SIM卡实际使用人的身份证件进行验证并登记身份信息，做到物联网SIM卡与实际使用人一一对应；用户办理涉及行业应用的物联网SIM卡业务时，应配合平台登记责任单位及责任人信息。用户作为统一办理物联网SIM卡的责任单位，明确对应责任人：姓名：身份证件号码：用户确保其向平台提供资料真实、准确、有效，并保证在发生变更后3个工作日内以书面形式通知平台。
					</p>
					<p>
						7.用户使用平台提供服务对外发布的信息所产生的纠纷，完全由用户负责解释并承担责任。如给平台造成损失，由用户负责赔偿。
					</p>
					<p>
						8.以上内容的最终解释权归上海梦初想通信技术有想公司所有。
					</p>
				</div>
				<div class="box-footer">
					<div class="btn-sure" @click="sure">确认</div>
				</div>
			</div>
		</div>
		<!-- 验证码弹出框 -->
		<div class="modal-verify" v-show="modalVerify" @click.self="modalVerify = false">
			<div class="verify">
				<div class="verify-header">
					<div class="icon"></div>
					<span>验证</span>
					<div class="icon"></div>
				</div>
				<div class="verify-content">
					<!-- 验证码 -->
					<div class="code">
						<span>请输入获取到的验证码: </span>
						<el-input
								clearable
								class="input"
								v-model="code">
						</el-input>
					</div>
					<!-- 确认按钮 -->
					<div class="btn-sure" @click="verifySure">确认</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {translateSystem,translatePackages,getPackageFlow,timestampToTime,getNetWork} from '../api/dataUtil'

	export default {
		data() {
			return {
				// 标题
				title: '',
				operateName: '',

				// 验证码弹出框
				modalVerify: false,
				code: '',

				// 用户协议
				modalProtocol: false,
				checked: false,

				// 卡号或iccid
				cardNum: '',
				cardBoxLoading: '',

				modalSure: false,

				// 表格工具栏
				tools: {
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
					],
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
					endPlaceHolder: ''
				},
				tableData: [],
				deviceIds: '',
				ids: '',
				// 用来存放返回的deviceIds
				returnIds: '',
				// 表格分页
				totalCount: 0,
				pageSize: 20,
				pageNo: 1,
				// 加载
				loading: '',
				addModal: false,
				// 表格流量排序
				sortData: '',
				direct: '',

				// isAll=1为全量操作
				isAll: '',
				// 当前选取的数组
				currentArr: []
			};
		},
		mounted() {
			this.operateType = this.$route.query.operateType
			if(this.operateType == 0) {
				this.title = '停卡'
				this.operateName = '停用'
			}else if(this.operateType == 1) {
				this.title = '复卡'
				this.operateName = '恢复'
			}
//			this.getBaseInfo()
		},
		methods: {
			// 添加流量卡按钮
			addFlow() {
				this.addModal = true
				// 清空筛选条件
				this.tools.cardNum = ''
				this.tools.startNum = ''
				this.tools.endNum = ''
				this.tools.inputShow = false
				this.tools.netWork = ''
				this.tableData = []
				this.totalCount = 0
//				this.getTableData()
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
			// 选中某几行
			selectRows(selection, row) {
				this.currentArr = selection
			},
			// 全选
			selectAll(selection){
				this.currentArr = selection
			},
			// 选择卡号或者iccid
			checkCardOrIccid(i) {
				if(i == '1') {
					this.tools.startPlaceHolder = '请输入开始的卡号'
					this.tools.endPlaceHolder = '请输入结束的卡号'
					this.tools.startNum = ''
					this.tools.endNum = ''
					this.tools.inputShow = true
				}else if(i == '2') {
					this.tools.startPlaceHolder = '请输入开始的ICCID'
					this.tools.endPlaceHolder = '请输入结束的ICCID'
					this.tools.startNum = ''
					this.tools.endNum = ''
					this.tools.inputShow = true
				}else {
					this.tools.startPlaceHolder = ''
					this.tools.endPlaceHolder = ''
					this.tools.startNum = ''
					this.tools.endNum = ''
					this.tools.inputShow = false
				}
			},
			// 获取添加流量卡的列表
			getTableData() {
				this.loading = true
				this.$axios({
					url: '/api/v2/device/devicePageList',
					method: 'post',
					params: {
						pageSize: this.pageSize,
						pageNo: this.pageNo,
						// 用于区分卡操作的接口和别的页面的接口，减轻服务器的压力
						isPage: 1,
						// 卡号段
						cardNo: this.tools.startNum ? `${this.tools.startNum}-${this.tools.endNum}` : '',
						// 运营商
						netWork: this.tools.netWork,
						// 停卡操作为1，复卡操作为0
//						activeStatus: this.operateType == 1 ? 1 : 0,
//						stopStatus: this.operateType == 1 ? 0 : 1,

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
						this.returnIds = res.data.msg
						for(let i=0; i<data.length; i++) {
							this.tableData.push({
								cardNum: data[i].cardNumber,
								iccid: data[i].iccid,
								netWork: getNetWork(data[i].netWork),
								flowUsage: Number(data[i].usageMonth).toFixed(2) + 'M',
								deviceId: data[i].deviceId
							})
						}
					}
				})
			},
			// 根据条件查询
			btnSearch() {
				let start = this.tools.startNum.length,
					end = this.tools.endNum.length
				if(!this.tools.netWork) {
					this.$message.info('请先选择运营商')
				}else if(this.tools.cardNum == 1 && start != end) {
					this.$message.info('请输入正确的卡号')
				}else if(this.tools.cardNum == 2 && start != end) {
					this.$message.info('请输入正确的ICCID')
				}else {
					this.getTableData()
				}
			},
			// 选取操作的类型
			btnSelect(i) {
				// 如果是选取操作
				if(i==1) {
					if(!this.currentArr.length) {
						this.$message.info('请先选择要操作的表格项')
					}else {
						for(let i=0; i<this.currentArr.length; i++) {
							this.ids += this.currentArr[i].deviceId + ','
						}
//						debugger
						this.ids = this.ids.slice(0,this.ids.length-1)
//						console.log(this.ids)

						this.addModal = false


						// 如果上一步操作为全量，下一步为选取的话，则此次把上一次的deviceIds清空
						if(this.isAll === 1) {
							this.deviceIds = ''
						}
						this.getCardIccid(0)
					}
				}
				// 如果是全量操作
				else {
					this.ids = this.returnIds
					this.addModal = false


					this.getCardIccid(1)
				}
			},
			// 获取到卡号和iccid
			getCardIccid(i) {
				this.cardBoxLoading = true
				// 如果是选取
				if(i===0) {
					this.isAll = 0
//					debugger
					let concatStr = this.deviceIds ? this.deviceIds.split(',').concat(this.ids.split(',')).join(',') : this.ids
//					console.log(concatStr)
					let resIds = concatStr.split(',')
					let result = []
					for(let i=0; i<resIds.length; i++) {
						if(result.indexOf(resIds[i]) === -1) {
							result.push(resIds[i])
						}
					}
					this.deviceIds = result.join(',')
					this.ids = ''
//					console.log(this.deviceIds)
				}
				// 如果是全量
				else if(i===1) {
					this.ids = ''
					this.isAll = 1
					this.deviceIds = this.returnIds
				}
				this.$axios({
					url: '/ucenterDevice/getCardNuAndIcc',
					method: 'post',
					params: {
						deviceIds: this.isAll === 1 ? '' : this.deviceIds,
						isAll: this.isAll,
						// 停卡操作为1，复卡操作为0
						stopStatus: this.operateType == 1 ? 0 : 1,

						// 卡号段
						cardNo: this.tools.startNum ? `${this.tools.startNum}-${this.tools.endNum}` : '',
						// 运营商
						netWork: this.tools.netWork
					}
				}).then(res => {
					this.cardBoxLoading = false
					let data = res.data.object;
//					console.log(data)
//					debugger
					let card = data.cardNumbers.split(',').concat(data.cardNumbers.split(','))

					let result = []
					for(let i=0; i<card.length; i++) {
						if(result.indexOf(card[i]) === -1) {
							result.push(card[i])
						}
					}
//					console.log(result)
					this.cardNum = result.join('、')
				})
			},
			// 确认按钮
			btnSure(i) {
				if(i===0) {
					this.$router.push({path: '/stopRestoreManage'})
				}else {
					if(!this.cardNum) {
						this.$message.info('请先添加流量卡')
						return
					}else if(!this.checked) {
						this.$message.info('请先阅读并同意用户协议')
						return
					}
					this.code = ''
					this.$axios({
						url: '/ucenterDevice/getCode',
						method: 'post'
					}).then(res => {
//						console.log(res.data)
						let data = res.data
						if(data.code == '100') {
							this.$message.success('验证码已发送至您的手机，请注意查收！')

							setTimeout(() => {
								this.modalVerify = true
							}, 2000);
						}else {
							this.$message.error(data.info)
						}
					})
					this.modalVerify = true
				}
			},
			// 验证码的确认按钮
			verifySure() {
				this.modalVerify = false
				this.$axios({
					url: '/pauseActiveCard/actCardAndStopCard',
					method: 'post',
					params: {
						type: this.operateType,
						code: this.code,
						deviceIds: this.deviceIds
					}
				}).then(res => {
//					console.log(res.data)
					let data = res.data
					if(data.code == '100') {
						this.$message.success(data.object)
						this.modalVerify = false
						this.$router.push({path: '/stopRestoreManage'})
					}else {
						this.$message.error(data.object)
					}
				})

			},


			// 点击协议，弹出协议内容的弹出框
			alertProtocol() {
				this.modalProtocol = true;
			},
			// 用户协议弹出框的确认按钮
			sure() {
				this.modalProtocol = false;
				this.checked = true;
			},
			// 流量的排序
			sortChange(column, prop, order) {
				// 为选择运营商和表格数据小于2条的时候，不给排序
				if(!this.tools.netWork || this.tableData.length < 2) {
					return
				}
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
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	borderColor = #e7ebf3
	buttonColor = #878787
	mainButton = #4cb2ff;
	.cardOperate-wrap {
		.content {
			/* 停复卡 */
			.stop-restore {
				background-color: #fff;
				height: 580px;
				border-radius: 20px;
				padding: 30px;
				margin-top: 20px;
				/* 卡号 */
				.card-number {
					display: flex;
					span {
						font-size: 28px;
						color: #85888f;
						margin-right: 76px;
					}
					.card-box {
						width: 350px;
						height: 200px;
						border: 1px solid borderColor;
						overflow-x: hidden;
						overflow-y: scroll;
						font-size: 17px;
						color: #393d42;
						padding: 10px;
						p {
							line-height: 30px;
						}
					}
					.btn-add {
						height: 40px;
						line-height: 40px;
						font-size: 18px;
						border-radius: 5px;
						background-color: mainBlue;
						padding: 0 20px;
						cursor: pointer;
						color: #fff;
						box-shadow: 0 8px 16px 0px rgba(105, 190, 255, 0.6);
						margin-left: 50px;
					}
				}
				/* 协议 */
				.protocol {
					margin-top: 50px;
					color: #585858;
					.tip {
						font-size: 24px;
					}
					.agreement {
						font-size: 18px;
						margin-top: 10px;
						span {
							color: mainBlue;
							cursor: pointer;
						}
					}
				}
				/* 按钮组 */
				.btn-group {
					display: flex;
					margin-top: 50px;
					.btn-sure {
						margin-left: 110px;
					}
				}
			}
		}
		/* 添加流量卡 */
		.addFlow-modal {
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.2);
			position: fixed;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 999;
			.add-flow {
				width: 780px;
				max-height: 700px;
				overflow-y: scroll;
				background-color: #fff;
				transform: translate(-50%, -50%);
				position: absolute;
				left: 50%;
				top: 50%;
				border-radius: 5px;
				.add-header {
					font-size: 30px;
					color: #737374;
					text-align: center;
					margin: 30px 0;
				}
				.add-box {
					padding: 0 30px 40px;
					/* 工具栏 */
					.tools {
						display: flex;
						flex-wrap: wrap;
						/* 卡号或iccid */
						.card-iccid {
							display: flex;
							margin-right: 40px;
							margin-bottom: 20px;
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
						.net-work, .online-status {
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
						}
					}
					/* 表格 */
					.table-box {
						margin-top: 40px;
						.el-pagination {
							text-align: center;
							margin-top: 10px;
						}
						.btn-group {
							text-align: center;
							margin-top: 20px;
							.btn-all {
								margin-left: 70px;
							}
						}
					}
				}
			}
		}
		/* 验证码弹出框 */
		.modal-verify {
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.2);
			position: fixed;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 999;
			.verify {
				width: 550px;
				height: 300px;
				background-color: #fff;
				transform: translate(-50%, -50%);
				position: absolute;
				left: 50%;
				top: 50%;
				border-radius: 5px;
				padding-top 20px
				.verify-header {
					font-size 30px
					color #737374
					margin-bottom 50px
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
				.verify-content {
					padding: 0 20px;
					/* 验证码 */
					.code {
						display: flex;
						justify-content: center;
						span {
							font-size: 24px;
							line-height: 40px;
						}
						.input {
							width: 200px;
							left: 20px;
						}
					}
					/* 确认按钮 */
					.btn-sure {
						width: 100px;
						height: 44px;
						border-radius: 10px;
						background-color: mainBlue;
						font-size: 18px;
						color: #fff;
						text-align: center;
						line-height: 44px;
						cursor: pointer;
						margin: 40px auto 0;
					}
				}
			}
		}
		/* 用户协议 */
		.protocol-wrap {
			width: 100%;
			height: 100%;
			position: fixed;
			z-index: 999;
			left: 0;
			top: 0;
			background-color: rgba(0, 0, 0, 0.2);
			.protocol-box {
				width: 60%;
				height: 600px;
				transform: translate(-50%, -50%);
				position: absolute;
				left: 50%;
				top: 50%;
				padding: 0 30px;
				background-color: #fff;
				.box-header {
					width: 100%;
					height: 68px;
					line-height: 68px;
					display: flex;
					justify-content: center;
					img {
						width: 173px;
						height: 33px;
						margin-top: 19px;
					}
					.line {
						width: 2px;
						height: 26px;
						background-color: #bbbbbb;
						margin: 22px 20px 0 15px;
					}
					span {
						font-size: 20px;
						color: #666;
					}
				}
				.box-content {
					width: 100%;
					height: 420px;
					background-color: #f3f3f3;
					border-radius: 5px;
					overflow: scroll;
					padding: 5px;
					.title {
						display: flex;
						justify-content: space-between;
						span {
							font-size: 14px;
							font-weight: 500;
						}
					}
					h5 {
						font-size: 14px;
						margin-top: 10px;
						font-weight: 900;
					}
					p {
						text-indent: 2em;
						font-size: 14px;
					}
				}
				.box-footer {
					.btn-sure {
						width: 180px;
						height: 40px;
						line-height: 40px;
						border-radius: 5px;
						background-color: #4cb2ff;
						margin: 30px auto 0;
						font-size: 22px;
						color: #fff;
						text-align: center;
						cursor: pointer;
					}
				}
			}
		}
	}
</style>


