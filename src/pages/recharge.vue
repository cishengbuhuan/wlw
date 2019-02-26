<template>
	<div class="recharge-wrap wrap">
		<div class="content wrap-content">
			<div class="recharge-box">
				<div class="title">账户充值</div>
				<div class="account">当前账号：<span>{{ account }}</span></div>
				<div class="balance">账户余额 <span>¥ <span>{{ balance }}</span></span></div>
				<!-- 支付方式 -->
				<div class="pay-way">
					<span>支付方式</span>
					<div class="way">
						<div class="way-item"
						     v-for="(item,index) in payWay"
						     :class="[{current : wayIndex == index}]"
						     @click="togglePayWay(index)"
						     :key="index">
							<img :src="item.wayImgSrc">
						</div>
					</div>
				</div>
				<!-- 充值方式 -->
				<div class="recharge">
					<!-- 支付宝充值 -->
					<div class="alipay" v-show="wayIndex == 0">
						<div class="recharge-title">充值金额</div>
						<ul>
							<li v-for="(item,index) in rechargeData"
							    :class="[{current: item.isChecked}]"
							    @click="toggleRechargeAmount(index)"
							    :key="index">
								{{ item.number }}
							</li>
							<li :class="[{current: customAmount != '自定义金额'}]">
								<input type="tel"
								       @blur="toggleHolder(1)"
								       @focus="toggleHolder(0)"
								       v-model="customAmount">
							</li>
						</ul>
						<div class="button-recharge" @click="btnRecharge">立即充值</div>
					</div>
					<!-- 银行转帐 -->
					<div class="bank" v-show="wayIndex == 1">
						<!--<div>正在积极开发中，敬请期待～</div>-->
						<el-form ref="form" :model="form" label-width="90px">
							<el-form-item label="转账银行：">
								<el-input v-model="form.bank"></el-input>
							</el-form-item>
							<el-form-item label="转账账号：">
								<el-input v-model="form.transferAccount"></el-input>
							</el-form-item>
							<el-form-item label="入款账号：">
								<el-input v-model="form.depositAccount"></el-input>
							</el-form-item>
							<el-form-item label="充值金额：">
								<el-input v-model="form.amount"></el-input>
							</el-form-item>
							<el-form-item label="充值时间：">
								<el-date-picker
										v-model="form.rechargeTime"
										type="datetime"
										placeholder="选择时间">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="凭证上传：">
								<el-upload
										action="http://www.91dream.net:8090/orderPay/certiUrlUpload"
										:file-list="form.upFile"
										list-type="picture"
										:limit="form.numberLimit"
										:on-change="changeUpload"
										:on-success="successUpload"
										name="upfile"
										ref="upload">
									<div class="btn-upload">选择文件</div>
								</el-upload>
							</el-form-item>
							<el-button @click="transferByBank(0)">重置</el-button>
							<el-button @click="transferByBank(1)">提交</el-button>
						</el-form>
					</div>
				</div>

				<div class="user-protocol">
					我已同意
					<span @click="alertProtocol">《用户协议》</span>
					<input type="checkbox" v-model="checked">
				</div>
			</div>
		</div>
		<!-- 协议弹出层 -->
		<div class="protocol-wrap" v-show="modalShow">
			<div class="protocol-box">
				<div class="box-header">
					<img src="../../static/images/protocol-logo.png">
					<div class="line"></div>
					<span>用户协议</span>
				</div>
				<div class="box-content">
					<div class="title">
						<span>甲方：{{ account }}</span>
						<span>乙方：上海梦初想通信公司</span>
					</div>
					<p>
						一、甲方郑重承诺遵守用户协议的有关条款，如有违反本用户协议有关条款的行为，由甲方承担由此带来的一切民事、行政和刑事责任。
					</p>
					<h5>
						二、甲方承诺遵守《中华人民共和国计算机信息系统安全保护条例》和《计算机信息网络国际联网安全保护管理办法》等国家有关法律、法规和行政规章制度。
					</h5>
					<h5>
						三、甲方保证不利用国际互联网危害国家安全、泄露国家秘密，不侵犯国家的、社会的、集体的利益和公民的合法权益，不从事违法犯罪活动。
					</h5>
					<h5>
						四、甲方承诺严格按照国家相关的法律法规做好甲方应用软件的网络信息安全管理工作，不得使用乙方提供的任何产品进行违反国家法律法规的犯罪活动，
						若违反本用户协议有关条款和国家相关法律法规的，甲方直接承担相应法律责任，造成第三方财产损失的，由甲方直接赔偿，乙方不承担任何责任。
					</h5>
					<h5>
						五、甲方承诺建立健全各项互联网安全管理制度和落实各项安全保护技术措施。
					</h5>
					<h5>
						六、甲方承诺不制作、复制、查阅和传播下列信息：
					</h5>
					<p>
						（1）反对宪法所确定的基本原则的；
					</p>
					<p>
						（2）危害国家安全，泄露国家机密，颠覆国家政权，破坏国家统一的；
					</p>
					<p>
						（3）损害国家荣誉和利益的；
					</p>
					<p>
						（4）煽动民族仇恨、民族歧视，破坏民族团结的；
					</p>
					<p>
						（5）破坏国家宗教政策，宣扬邪教和封建迷信的；
					</p>
					<p>
						（6）散布谣言，扰乱社会秩序，破坏社会稳定的；
					</p>
					<p>
						（7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；
					</p>
					<p>
						（8）侮辱或者诽谤他人，侵害他人合法权益的；
					</p>
					<p>
						（9）煽动非法集会、结社、游行、示威、聚众扰乱社会秩序；
					</p>
					<p>
						（10）以非法民间组织名义活动；
					</p>
					<p>
						（11）含有法律、行政法规禁止的其他内容；
					</p>
					<p>
						（12）表现或隐晦表现性行为、令人产生性联想、具有挑逗性或者侮辱性的内容；
					</p>
					<p>
						（13）对人体性部位的直接暴露和描写；
					</p>
					<p>
						（14）对性行为、性过程、性方式的描述或者带有性暗示、性挑逗的语言；
					</p>
					<p>
						（15）对性部位描述、暴露，或者只用很小遮盖物的内容；
					</p>
					<p>
						（16）全身或者隐私部位未着衣物，仅用肢体掩盖隐私部位的内容；
					</p>
					<p>
						（17）带有侵犯个人隐私性质的走光、偷拍、漏点等内容；
					</p>
					<p>
						（18）以挑逗性标题吸引点击的；
					</p>
					<p>
						（19）相关部门禁止传播的色情、低俗小说、音视频内容，包括一些电影的删节片断；
					</p>
					<p>
						（20）一夜情、换妻、SM等不正当交友信息；
					</p>
					<p>
						（21）情色动漫；
					</p>
					<p>
						（22）宣扬血腥暴力、恶意谩骂、侮辱他人等内容；
					</p>
					<p>
						（23）非法的性用品广告和性病治疗广告；
					</p>
					<p>
						（24）未经他人允许或利用“人肉搜索”恶意传播他人隐私。
					</p>
					<h5>
						七、甲方承诺不从事下列危害计算机信息网络安全的活动：
					</h5>
					<p>
						（1）未经允许，进入计算机信息网络或者使用计算机信息网络资源的；
					</p>
					<p>
						（2）未经允许，对计算机信息网络功能进行删除、修改或者增加的；
					</p>
					<p>
						（3）未经允许，对计算机信息网络中存储或者传输的数据和应用程序进行删除、修改或者增加的；
					</p>
					<p>
						（4）故意制作、传播计算机病毒等破坏性程序的；
					</p>
					<p>
						（5）其他危害计算机信息网络安全的。
					</p>
					<h5>
						八、甲方承诺当计算机信息系统发生重大安全事故时，立即采取应急措施，保留有关原始记录，并在24小时内向市公安局网监分局报告。
					</h5>
					<h5>
						九、本用户协议自签署之日起施行。
					</h5>
				</div>
				<div class="box-footer">
					<div class="btn-sure" @click="sure">确认</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {format, translatePackages} from '../api/dataUtil'
	export default {
		data() {
			return {
				account: '',
				balance: 0,
				payWay: [
					{
						wayImgSrc: '../../static/images/alipay.png'
					},
//					{
//						wayImgSrc: '../../static/images/underline.png'
//					}
				],
				wayIndex: 0,
				rechargeData: [],
				modalShow: false,
				checked: true,
				// 自定义金额
				customAmount: '自定义金额',
				// 选中的金额
				selectedAmount: '',
				form: {
					bank: '',
					transferAccount: '',
					depositAccount: '',
					amount: '',
					rechargeTime: '',
					upFile: [],
					imgUrl: '',
					numberLimit: 1
				}
			};
		},
		mounted() {
			this.getUserInfo()
			this.getRechargeList()
		},
		methods: {
			togglePayWay(index) {
				this.wayIndex = index
			},
			alertProtocol() {
				this.modalShow = true;
			},
			sure() {
				this.modalShow = false;
				this.checked = true;
			},
			// 获取到用户信息
			getUserInfo() {
				this.$axios({
					url: '/api/v2/base/getBasal',
					method: 'post'
				}).then(res => {
					let data = res.data.data;
					this.account = data.companyName
					this.balance = data.amount
				})
			},
			// 获取到充值金额到选项
			getRechargeList() {
				this.$axios({
					url: '/api/v2/account/getAmount',
					method: 'post'
				}).then(res => {
					let data = res.data.data;
					for (let i = 0; i < data.length; i++) {
						this.rechargeData.push({
							number: data[i].amount,
							isChecked: false
						})
					}
				})
			},

			toggleRechargeAmount(index){
				let amount = this.rechargeData
				for (let i = 0; i < amount.length; i++) {
					amount[i].isChecked = false;
				}
				amount[index].isChecked = true;
				this.customAmount = '自定义金额'
				this.selectedAmount = Number(amount[index].number);
			},

			toggleHolder(state) {
				if (!state) {
					this.customAmount = ''
					for (let i = 0; i < this.rechargeData.length; i++) {
						this.rechargeData[i].isChecked = false;
					}
				} else {
					if (this.customAmount == '') {
						this.customAmount = '自定义金额'
					}
				}
			},
			// 点击立即充值按钮
			btnRecharge() {
				if(this.selectedAmount == ''){
					this.$message.error('请先选择充值金额！');
					return
				}
				if(!this.checked){
					this.$message.error('请先勾选用户协议！');
					return
				}

				this.$axios({
					url: '/api/v2/account/top/alipay/account',
					method: 'post',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
					},
					params: {
						orderNo: '12345',
						totalAmount: this.selectedAmount,
						orderName: '物联网卡系统充值',
						shopDescription: '系统充值'
					}
				}).then(res => {
					const div = document.createElement('div')
//					console.log(document.forms[0])
//					console.log(res.data)
					div.innerHTML = res.data
					document.body.appendChild(div)
					document.forms.punchout_form.submit()
				})
			},

			// 图片文件状态改变
			changeUpload(file, fileList){
				this.form.upFile = fileList
			},
			// 图片上传成功的钩子
			successUpload(response, file, fileList){
				this.form.imgUrl = response.object.tempFile
			},
			// 银行转账
			transferByBank(i){
				if(i===0){
					this.form.bank = ''
					this.form.transferAccount = ''
					this.form.depositAccount = ''
					this.form.amount = ''
					this.form.rechargeTime = ''
					this.form.upFile = []
				}else {
					let userId = sessionStorage.getItem('userId')
					let companyId = sessionStorage.getItem('companyId')

					let amount = this.form.amount,
						transferBank = this.form.bank,
						transferAccount = this.form.transferAccount,
						incomeAccount = this.form.depositAccount,
						createTime = format(new Date(this.form.rechargeTime).getTime(), "Y-m-d H:i:s"),
						upFile = this.form.upFile,
						imgUrl = this.form.imgUrl;
//					console.log(upFile)
//					console.log(imgUrl)
//					console.log(createTime)
					if(!amount || !transferBank || !transferAccount || !incomeAccount || !createTime || upFile.length === 0) {
						this.$message.info('请先将表格填写完整！')
					}else {
						this.$axios({
							url: '/orderPay/bankTrans',
							method: 'post',
							params: {
								amount: amount,
								transferBank: transferBank,
								transferAccount: transferAccount,
								incomeAccount: incomeAccount,
								companyId: companyId,
								payType: '3',
								createTime: createTime,
								userId: userId,
								certiUrl: imgUrl
							}
						}).then(res => {
							console.log(res.data)
							if(res.data.code == 100){
								this.$message.success(res.data.info)
//								this.$refs.upload.submit();
							}
						})
					}
				}
			}
		},
		watch: {
			'customAmount'(val) {
				if (val != '自定义金额') {
					this.selectedAmount = val
				}
			}
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	.recharge-wrap {
		.content {
			.recharge-box {
				background-color: #fff;
				border-radius: 20px;
				padding: 30px;
				margin-top: 20px;
				.title {
					font-size: 22px;
					margin-bottom: 50px;
				}
				.account {
					font-size: 18px;
					margin-bottom: 40px;
					span {
						font-size: 20px;
					}
				}
				.balance {
					font-size: 18px;
					margin-bottom: 30px;
					span {
						font-size: 24px;
						margin-left: 20px;
						span {
							margin-left: 0;
						}
					}
				}
				/* 支付方式 */
				.pay-way {
					display: flex;
					font-size: 22px;
					line-height: 50px;
					margin-bottom: 50px;
					.way {
						display: flex;
						margin-left: 40px;
						.way-item {
							width: 137px;
							height: 50px;
							border: 1px solid #bbb;
							position: relative;
							margin-right: 50px;
							cursor: pointer;
							border-radius: 5px;
							img {
								transform: translate(-50%, -50%);
								position: absolute;
								left: 50%;
								top: 50%;
							}
						}
						.current {
							border-color: #4cb2ff;
						}
					}
				}
				/* 充值方式 */
				.recharge {
					/* 支付宝充值 */
					.alipay {
						.recharge-title {
							font-size: 22px;
							color: #999;
							margin-bottom: 30px;
						}
						ul {
							width: 470px;
							display: flex;
							justify-content: space-between;
							flex-wrap: wrap;
							li {
								width: 120px;
								height: 40px;
								line-height: 40px;
								border: 1px solid #999;
								border-radius: 5px;
								font-size: 20px;
								text-align: center;
								cursor: pointer;
								margin-bottom: 40px;
								input {
									width: 100%;
									height: 100%;
									font-size: 20px;
									text-align: center;
									color: #333;
								}
							}
							.current {
								color: mainBlue;
								border-color: mainBlue;
							}
						}
						.button-recharge {
							width: 160px;
							height: 40px;
							line-height: 40px;
							border-radius: 5px;
							background-color: mainBlue;
							color: #fff;
							font-size: 18px;
							text-align: center;
							cursor: pointer;
						}
					}
					/* 银行转帐 */
					.bank {
						width: 500px;
						padding: 30px 30px 40px 30px;
						box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
						border-radius: 5px;
						.el-input {
							width: 300px;
						}
					}
				}
				.user-protocol {
					span {
						cursor: pointer;
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
							font-size: 18px;
							font-weight: 500;
						}
					}
					h5 {
						font-size: 16px;
						margin-top: 10px;
						font-weight: 400;
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