<template>
  <div class="recharge-wrap">
    <dream-header></dream-header>
    <dream-slide></dream-slide>
    <div class="content">
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
        <!-- 充值 -->
        <div class="recharge">
          <div class="recharge-title">充值金额</div>
          <ul>
            <li v-for="(item,index) in rechargeData"
                :class="{ current : item.isSelected }"
                @click="chooseThis(index)"
                :key="index">
              <input type="tel" v-model="item.number" disabled>
            </li>
            <li><input type="tel" v-model="customAmount" placeholder="自定义金额"></li>
          </ul>
          <div class="button-recharge" @click="btnRecharge">立即充值</div>
          <div class="user-protocol">我已同意<span @click="alertProtocol">《用户协议》</span><input type="checkbox" v-model="checked"></div>
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

        </div>
        <div class="box-footer">
          <div class="btn-sure" @click="sure">确认</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import dreamHeader from '../components/dreamHeader/dreamHeader.vue'
  import dreamSlide from '../components/dreamSlide/dreamSlide.vue'
  export default {
    components: {
      dreamHeader,
      dreamSlide
    },
    data() {
      return {
        account: '成都快船有限公司',
        balance: 0,
        payWay: [
          {
            wayImgSrc: '../../static/images/alipay.png'
          },
          {
            wayImgSrc: '../../static/images/underline.png'
          }
        ],
        wayIndex: 0,
        rechargeData: [],
        modalShow: false,
        checked: true,
        // 自定义金额
        customAmount: null
      };
    },
    mounted(){
      this.getUserInfo()
      this.getRechargeList()
    },
    methods: {
      togglePayWay(index){
        this.wayIndex = index
      },
      alertProtocol(){
        this.modalShow = false;
      },
      sure(){
        this.modalShow = false;
      },
      // 获取到用户信息
      getUserInfo(){
        this.$axios({
          url: '/api/v2/base/getBasal',
          method: 'post'
        }).then(res=>{
          let data = res.data.data;
          this.account = data.companyName
          this.balance = data.amount
        })
      },
      // 获取到充值金额到选项
      getRechargeList(){
        this.$axios({
          url: '/api/v2/account/getAmount',
          method: 'post'
        }).then(res=>{
          let data = res.data.data;
          for(let i=0; i<data.length; i++){
            this.rechargeData.push({
              number: data[i].amount,
              isSelected: data[i].check
            })
          }
        })
      },
      // 切换所选金额
      chooseThis(index){
        for(let i=0; i<this.rechargeData.length; i++){
          this.rechargeData[i].isSelected = false;
        }
        this.rechargeData[index].isSelected = true;
      },
      // 点击立即充值按钮
      btnRecharge(){
        this.$message({type: 'info',message: '系统更新中...'});
      }
    }
  };
</script>

<style lang="stylus" scoped>
  mainBlue = #4cb2ff;
  .recharge-wrap {
    padding-top: 50px;
    padding-left: 200px;
    .content {
      width: 100%;
      height: calc(100vh - 50px);
      padding: 20px;
      overflow-y: scroll;
      .recharge-box {
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 5px;
        padding-left: 100px;
        padding-top: 50px;
        padding-bottom: 20px;
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
                transform: translate(-50%,-50%);
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
        /* 充值 */
        .recharge {
          .recharge-title {
            font-size: 22px;
            color: #999;
            margin-bottom: 30px;
          }
          ul {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            li {
              width: 120px;
              height: 40px;
              line-height: 40px;
              border-radius: 5px;
              border: 1px solid #666;
              margin-bottom: 40px;
              input {
                width: 100%;
                height: 100%;
                font-size: 20px;
                text-align: center;
                cursor: pointer;
              }
            }
            .current {
              background-color: mainBlue;
              border: none;
            }
          }
          .button-recharge {
            width: 160px;
            height: 40px;
            line-height: 40px;
            border-radius: 5px;
            text-align: center;
            border: 1px solid #666;
            font-size: 20px;
            cursor: pointer;
            margin-bottom: 30px;
          }
          .user-protocol {
            span {
              cursor: pointer;
            }
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
      background-color: rgba(0,0,0,0.2);
      .protocol-box {
        width: 60%;
        height: 600px;
        transform: translate(-50%,-50%);
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


