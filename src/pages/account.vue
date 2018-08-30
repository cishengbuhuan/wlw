<template>
  <div class="message-wrap">
    <dream-header></dream-header>
    <dream-slide></dream-slide>
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
        <div class="my-assets">
          <span>我的资产</span>
          <div class="num">¥ {{ userInfo.assets }}</div>
        </div>
      </div>
      <!-- 记录 -->
      <div class="record">
        <div class="record-header">
          <span>交易记录</span>
          <div class="title" @click="toggleNav(0)" :class="[{ current: index == 0 }]">消费记录</div>
          <div class="title" @click="toggleNav(1)" :class="[{ current: index == 1 }]">充值记录</div>
        </div>
        <div class="record-content">
          <!-- 消费记录 -->
          <div class="consumption-record" v-if="index == 0">
            <el-table
              :data="consumptionData"
              style="width: 100%">
              <el-table-column prop="type" label="消费类型" align="center"></el-table-column>
              <el-table-column prop="amount" label="消费金额" align="center"></el-table-column>
              <el-table-column prop="time" label="消费时间" align="center"></el-table-column>
              <el-table-column prop="way" label="扣款方式" align="center"></el-table-column>
              <el-table-column prop="remark" label="备注" align="center"></el-table-column>
            </el-table>
          </div>
          <!-- 充值记录 -->
          <div class="recharge-record" v-if="index == 1">
            <el-table
              :data="rechargeData"
              style="width: 100%">
              <el-table-column prop="amount" label="充值金额" align="center"></el-table-column>
              <el-table-column prop="time" label="充值时间" align="center"></el-table-column>
              <el-table-column prop="way" label="充值方式" align="center"></el-table-column>
              <el-table-column prop="remark" label="备注" align="center"></el-table-column>
            </el-table>
          </div>
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
        userInfo: {
          headImg: '../../static/images/default-head.png',
          account: '17789789762',
          assets: 2.00
        },
        index: 0,
        // 消费记录
        consumptionData: [
          {
            type: '流量池套餐',
            amount: 100,
            time: '2018-08-12',
            way: '与扣款',
            remark: '备注'
          },
          {
            type: '流量池套餐',
            amount: 100,
            time: '2018-08-12',
            way: '与扣款',
            remark: '备注'
          },
          {
            type: '流量池套餐',
            amount: 100,
            time: '2018-08-12',
            way: '与扣款',
            remark: '备注'
          },
          {
            type: '流量池套餐',
            amount: 100,
            time: '2018-08-12',
            way: '与扣款',
            remark: '备注'
          }
        ],
        // 充值记录
        rechargeData: [
          {
            amount: 100,
            time: '2018-08-12',
            way: '与扣款',
            remark: '备注'
          },
          {
            amount: 100,
            time: '2018-08-12',
            way: '与扣款',
            remark: '备注'
          },
          {
            amount: 100,
            time: '2018-08-12',
            way: '与扣款',
            remark: '备注'
          },
          {
            amount: 100,
            time: '2018-08-12',
            way: '与扣款',
            remark: '备注'
          }
        ]
      };
    },
    methods: {
      toggleNav(i){
        this.index = i
      }
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
        border: 1px solid #ddd;
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
        .my-assets {
          padding-top: 60px;
          span {
            font-size: 20px;
          }
          .num {
            font-size: 30px;
            font-weight: 500;
            margin-top: 20px;
          }
        }
      }
      /* 交易记录 */
      .record {
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 5px;
        .record-header {
          height: 106px;
          line-height: 106px;
          border-bottom: 1px solid #ddd;
          padding-left: 100px;
          display: flex;
          span {
            font-size: 24px;
            margin-right: 100px;
          }
          .title {
            font-size: 18px;
            color: #666;
            margin-right: 90px;
            cursor: pointer;
            position: relative;
          }
          .current {
            color: #2483c6;
          }
          .current:after {
            content: '';
            display: block;
            width: 80px;
            height: 4px;
            background-color: #2483c6;
            position: absolute;
            left: -3px;
            bottom: 25px;
          }
        }
        .record-content {
          padding: 0 100px;
          .el-table::before {
            content: '';
            position: absolute;
            background-color: #fff;
            z-index: 1;
          }
        }
      }
    }
  }
</style>

