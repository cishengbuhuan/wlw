<template>
	<div class="message-wrap">
		<div class="content">
			<!-- 个人资料 -->
			<div class="admin-data">
				<div class="head-account">
					<img :src="userInfo.headImg" class="head-img">
					<div class="account">
						<img src="../../static/images/icon-account.png" class="icon">
						<span>账号：{{ userInfo.account }}</span>
					</div>
				</div>
			</div>
			<!-- 账户信息 -->
			<div class="account-info">
				<div class="info-header">
					<div class="operate-item" @click="btnAdd"><i class="el-icon-circle-plus-outline"></i><span>添加</span>
					</div>
					<div class="operate-item" @click="deleteAllSelect"><i
							class="el-icon-remove-outline"></i><span>删除</span></div>
				</div>
				<div class="info-content">
					<table>
						<thead>
						<tr>
							<th><input type="checkbox" v-model="allChecked" @click="toggleAllChecked"></th>
							<th>姓名</th>
							<th>账号</th>
							<th>操作</th>
						</tr>
						</thead>
						<tbody>
						<tr v-if="accountData.length == 0">
							<td colspan="5">暂无数据</td>
						</tr>
						<tr v-for="(item,index) in accountData" :key="index">
							<td><input type="checkbox" v-model="item.isChecked"></td>
							<td>{{ item.name }}</td>
							<td>{{ item.account }}</td>
							<td>
								<span @click="editThisRow(index)"><i class="el-icon-edit-outline"></i>编辑</span>
								<span @click="deleteThisRow(index)"><i class="el-icon-remove-outline"></i>删除</span>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<!-- 弹框遮罩 -->
		<div class="modal-wrap" @click.self="closeModalWrap" v-show="modalIsShow">
			<div class="wrap-box">
				<div class="box-header">
					<img src="../../static/images/logo.png">
				</div>
				<div class="box-form">
					<!-- 姓名 -->
					<div class="name">
						<span>姓名：</span>
						<input type="text" v-model="user.name">
					</div>
					<!-- 账号 -->
					<div class="account">
						<span>账户：</span>
						<input type="text" :disabled="isEdit" v-model="user.account" placeholder="账户为手机号">
					</div>
					<!-- 密码 -->
					<div class="password">
						<span>密码：</span>
						<input type="text" v-model.lazy="user.password" minlength="6" maxlength="16"
						       placeholder="密码只能为6～16位的数字和英文字母">
					</div>
					<!-- 按钮 -->
					<div class="btn-add" v-show="!isEdit" @click="btnSure">确定</div>
					<div class="btn-add" v-show="isEdit" @click="saveEdit">保存</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				userInfo: {
					headImg: '../../static/images/default-head.png',
					account: '',
				},
				// 全选
				allChecked: false,
				// 账号信息
				accountData: [],
				// 弹框是否显示
				modalIsShow: false,
				user: {
					name: '',
					account: '',
					password: ''
				},
				selectArr: [],
				isEdit: false
			};
		},
		mounted() {
			this.getUserBasic()
			this.getAccountList()
		},
		watch: {
			'user.password'(val) {
				let reg = /[^\w\.\/]/ig
				this.user.password = val.replace(reg, '')
			}
		},
		methods: {
			// 全选
			toggleAllChecked() {
				for (let i = 0; i < this.accountData.length; i++) {
					if (this.allChecked === false) {
						this.accountData[i].isChecked = true;
					} else {
						this.accountData[i].isChecked = false;
					}
				}
			},
			// 删除所选中的
			deleteAllSelect() {
				let allTel = ''
				for (let i = 0; i < this.accountData.length; i++) {
					if (this.accountData[i].isChecked === true) {
						this.selectArr.push(this.accountData[i])
					}
				}
				// 循环所选中的数组，获得所有的手机号
				for (let j = 0; j < this.selectArr.length; j++) {
					allTel += ',' + this.selectArr[j].account
				}
				if(this.selectArr == 0){
					this.$message({
						type: 'info',
						message: '请至少选择一个删除的选项！'
					});
				}else{
					this.$confirm('是否删除所选账号?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {

						this.$axios({
							url: '/api/v2/user/deleteAll',
							method: 'post',
							params: {
								mobile: allTel.substring(1, allTel.length)
							}
						}).then(res => {
							this.modalIsShow = false;
							this.accountData = [];
							this.allChecked = false;
							this.getAccountList()
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
						}).catch(res => {
							this.$message({type: 'info', message: res.msg});
						})

						this.$message({type: 'success', message: '删除成功!'});
					}).catch(() => {
						this.$message({type: 'info', message: '已取消删除'});
					});
				}
			},
			// 删除一行
			deleteThisRow(index) {
				this.$confirm('是否删除此账号?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios({
						url: '/api/v2/user/delete',
						method: 'post',
						params: {
							mobile: this.accountData[index].account
						}
					}).then(res => {
						this.modalIsShow = false;
						this.accountData = [];
						this.getAccountList()
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
					}).catch(res => {
						this.$message({type: 'info', message: res.msg});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			// 点击编辑
			editThisRow(index) {
				this.isEdit = true
				this.modalIsShow = true;
				this.user.name = this.accountData[index].name;
				this.user.account = this.accountData[index].account;
			},
			saveEdit(index) {
//				if(){}
				this.$axios({
					url: '/api/v2/user/update',
					method: 'post',
					params: {
						name: this.user.name,
						mobile: this.user.account,
						password: this.user.password
					}
				}).then(res => {
					this.modalIsShow = false;
					this.accountData = [];
					this.getAccountList()
					this.$message({
						type: 'success',
						message: '保存成功!'
					});
				}).catch(res => {
					this.$message({type: 'info', message: res.msg});
				})
			},
			// 点击空白处让弹框隐藏
			closeModalWrap() {
				this.user.name = '';
				this.user.account = '';
				this.user.password = '';
				this.modalIsShow = !this.modalIsShow;
			},
			// 点击添加按钮
			btnAdd() {
				this.isEdit = false;
				this.modalIsShow = true;
			},
			// 确定按钮
			btnSure() {
				this.$axios({
					url: '/api/v2/user/addUser',
					method: 'post',
					params: {
						name: this.user.name,
						mobile: this.user.account,
						password: this.user.password
					}
				}).then(res => {
					if (res.data.code == 1) {
						this.$message({type: 'success', message: '添加成功！'});
						this.modalIsShow = false;
						this.accountData = [];
						this.user.name = ''
						this.user.account = ''
						this.user.password = ''
						this.getAccountList()
					} else {
						this.$message({type: 'error', message: res.data.msg});
					}
				}).catch(res => {
					this.$message({type: 'info', message: res.data.msg});
				})
			},
			// 获取我的账户的基本信息
			getUserBasic() {
				this.$axios({
					url: '/api/v2/base/getUser',
					method: 'post'
				}).then(res => {
					let data = res.data.data;
					this.userInfo.account = data.phone
				})
			},
			// 获取到账户列表
			getAccountList() {
				this.$axios({
					url: '/api/v2/user/userList',
					method: 'post'
				}).then(res => {
					let data = res.data.data;
					console.log(data)
					for (let i = 0; i < data.length; i++) {
						this.accountData.push({
							name: data[i].name,
							account: data[i].phone,
							password: data[i].salt,
							isChecked: false
						})
					}
				})
			},
		}
	};
</script>

<style lang="stylus" scoped>
	mainBlue = #4cb2ff;
	.message-wrap {
		padding-top: 50px;
		padding-left: 200px;
		.content {
			width: 100%;
			height: calc(100vh - 50px);
			padding: 20px;
			overflow-y: scroll;
			/* 个人资料 */
			.admin-data {
				width: 100%;
				height: 200px;
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				border-radius: 5px;
				display: flex;
				padding-left: 100px;
				margin-bottom: 20px;
				.head-account {
					display: flex;
					line-height: 200px;
					margin-right: 100px;
					.head-img {
						width: 70px;
						height: 70px;
						margin-top: 65px;
						border-radius: 50%;
						margin-right: 20px;
					}
					.account {
						.icon {
							width: 16px;
							height: 22px;
							margin-top: -5px;
						}
						span {
							font-size: 18px;
						}
					}
				}
			}
			/* 账户信息 */
			.account-info {
				width: 100%;
				box-shadow: 0 0 5px rgba(187, 187, 187, 0.8);
				border-radius: 5px;
				.info-header {
					height: 110px;
					line-height: 110px;
					border-bottom: 1px solid #bbb;
					padding-left: 100px;
					display: flex;
					.operate-item {
						font-size: 22px;
						margin-right: 70px;
						cursor: pointer;
						i {
							font-size: 26px;
							color: #2583c6;
							margin-right: 10px;
						}
						.el-icon-remove-outline {
							color: #ed5e5e;
						}
					}
				}
				.info-content {
					padding: 0 100px;
					table {
						width: 100%;
						text-align: center;
						thead {
							tr {
								th {
									height: 85px;
									border-bottom: 1px solid #bbb;
									font-size: 20px;
									font-weight: 400;
									input {
										width: 20px;
										height: 20px;
									}
								}
							}
						}
						tbody {
							tr {
								text-align: center;
								td {
									height: 75px;
									border-bottom: 1px solid #bbb;
									font-size: 18px;
									color: #666;
									input {
										width: 20px;
										height: 20px;
									}
									span {
										color: #999999;
										font-size: 18px;
										cursor: pointer;
										i {
											color: #9a9a9a;
											margin-right: 5px;
										}
									}
									.edit {
										margin-right: 40px;
									}
								}
							}
							tr:last-child {
								td {
									border-bottom: none;
								}
							}
						}
					}
				}
			}
		}
		/* 遮罩弹框 */
		.modal-wrap {
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.2);
			position: fixed;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 999;
			.wrap-box {
				width: 600px;
				height: 400px;
				background-color: #fff;
				transform: translate(-50%, -50%);
				position: absolute;
				left: 50%;
				top: 50%;
				border-radius: 5px;
				.box-header {
					width: 100%;
					height: 50px;
					background-color: mainBlue;
					position: relative;
					border-top-right-radius: 5px;
					border-top-left-radius: 5px;
					img {
						width: 95px;
						height: 23px;
						transform: translateY(-65%);
						position: absolute;
						top: 50%;
						left: 30px;
					}
				}
				.box-form {
					padding-top: 40px;
					.name, .account, .password {
						display: flex;
						justify-content: center;
						line-height: 40px;
						margin-bottom: 30px;
						span {
							font-size: 20px;
							color: #666;
						}
						input {
							width: 280px;
							height: 40px;
							border-radius: 5px;
							border: 1px solid #666;
							padding-left: 15px;
							font-size: 20px;
						}
						input:
						:-webkit-input-placeholder {
							font-size: 14px;
							color: #999;
						}
					}
					.btn-add {
						width: 200px;
						height: 44px;
						line-height: 44px;
						border-radius: 5px;
						background-color: #2483c6;
						text-align: center;
						color: #fff;
						font-size: 20px;
						margin: 0 auto;
						cursor: pointer;
					}
				}
			}
		}
	}
</style>
