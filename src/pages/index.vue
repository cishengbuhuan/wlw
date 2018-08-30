<template>
  <div class="index-wrap">
    <dream-header></dream-header>
    <dream-slide></dream-slide>
    <div class="content">
      <!-- 公司名称和账户余额 -->
      <div class="name-balance">
        <div class="company-name">
          <div class="title">{{ company.name }}</div>
          <div class="card-num"><div class="icon"></div>卡片总数：<span>{{ company.cardNum }}</span></div>
        </div>
        <div class="balance">
          <div class="title"><div class="icon"></div><span>账户余额</span></div>
          <div class="num-button">
            <span>{{ company.balance }}</span>
            <input type="button" value="立即充值">
          </div>
        </div>
      </div>
      <!-- 系统消息 -->
      <div class="system-msg">
        <div class="msg-title">公告<div class="icon"></div></div>
        <ul>
          <li v-for="(item,index) in systemMsg" :key="index">
            <router-link to="/message"><span>{{ item.msg }}</span></router-link>
            <div class="isNew"><img src="../../static/images/is-new.png" alt=""></div>
          </li>
        </ul>
      </div>
      <!-- 卡片统计 -->
      <div class="card-count">
        <div class="card-title">卡片统计</div>
        <div class="chart">
          <div class="chart-item" v-for="(item,index) in cardData" :key="index">
            <div class="title">{{ item.title }}:{{ item.totalCard }}</div>
            <ve-ring :data="item" :settings="cardSettings" :extend="cardExtend"></ve-ring>
          </div>
        </div>
      </div>
      <!-- 流量统计 -->
      <div class="flow-count">
        <!-- 流量统计的header -->
        <div class="flow-title">
          <span>流量统计</span>
          <div class="used"><div class="icon"></div>已使用</div>
          <div class="unused"><div class="icon"></div>未使用</div>
          <div class="exceeded"><div class="icon"></div>已超出</div>
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
          <div class="chart-item-group" v-for="(item,index) in flowData" :key="index">
            <div class="chart-item" v-for="(itemSon,indexSon) in item" :key="indexSon">
              <ve-pie :data="itemSon" :settings="flowSettings" :extend="flowExtend"></ve-pie>
              <div class="title">{{ itemSon.date }}总流量：{{ itemSon.monthTotal }}(M)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import dreamHeader from '../components/dreamHeader/dreamHeader.vue';
  import dreamSlide from '../components/dreamSlide/dreamSlide.vue';
  import VeRing from "v-charts/lib/ring.common";
  import VePie from "v-charts/lib/pie.common";
  export default {
    components: {
      dreamHeader,
      dreamSlide,
      VeRing,
      VePie
    },
    data() {
      var that = this
      this.cardSettings = {
        radius: [60, 110],
        labelLine: 'show',
        label: 'show',
        offsetY: 160
      }
      this.cardExtend = {
        legend: {
          align: 'center',
          bottom: 10,
          left: 10,
          itemWidth: 11,
          itemHeight: 11,
          textStyle: {
            borderRadius: '50%',
            padding: [0, 0, 0, 70],
          },
//          formatter: function (status) {
//            var statusArr = ['已激活', '已停卡', '已消费', '已沉默', '已销卡'];
//            var dataNum = that.cardData
//            console.log(dataNum)
//          }
        }
      }

      // 流量统计
      this.flowSettings = {
        labelLine: 'show',
        label: {
          position: 'inside'
        },
        radius: 160,
        offsetY: 200
      }
      this.flowExtend = {
        legend: {
          show: false
        }
      }
      return {
        company: {
          name: '',
          cardNum: 0,
          balance: 0
        },
        systemMsg: [],
        // 卡片统计饼状图数据
        cardData: [
          {
            title: '',
            totalCard: 100,
            columns: ['status', 'number'],
            rows: [
//              { status: '已激活', number: 1393 },
//              { status: '已停卡', number: 3530 },
//              { status: '已消费', number: 2923 },
//              { status: '已沉默', number: 1723 },
//              { status: '已销卡', number: 3792 }
            ]
          },
          {
            title: '',
            totalCard: 100,
            columns: ['status', 'number'],
            rows: [
//              { status: '已激活', number: 1393 },
//              { status: '已停卡', number: 3530 },
//              { status: '已消费', number: 2923 },
//              { status: '已沉默', number: 1723 },
//              { status: '已销卡', number: 3792 }
            ]
          },
          {
            title: '',
            totalCard: 100,
            columns: ['status', 'number'],
            rows: [
//              { status: '已激活', number: 1393 },
//              { status: '已停卡', number: 3530 },
//              { status: '已消费', number: 2923 },
//              { status: '已沉默', number: 1723 }
            ]
          }
        ],
        // 流量统计饼状图数据
        flowData: [
          [
            {
              monthTotal: 100,
              date: '本月',
              columns: ['usage', 'number'],
              rows: [
                { usage: '已使用', number: 1393 },
                { usage: '未使用', number: 3530 }
              ]
            },
            {
              monthTotal: 100,
              date: '上月',
              columns: ['usage', 'number'],
              rows: [
                { usage: '已使用', number: 1393 },
                { usage: '已超出', number: 4567 }
              ]
            }
          ],
          [
            {
              monthTotal: 100,
              date: '本月',
              columns: ['usage', 'number'],
              rows: [
                { usage: '已使用', number: 1393 },
                { usage: '未使用', number: 3530 }
              ]
            },
            {
              monthTotal: 100,
              date: '上月',
              columns: ['usage', 'number'],
              rows: [
                { usage: '已使用', number: 1393 },
                { usage: '已超出', number: 4567 }
              ]
            }
          ],
          [
            {
              monthTotal: 100,
              date: '本月',
              columns: ['usage', 'number'],
              rows: [
                { usage: '已使用', number: 1393 },
                { usage: '未使用', number: 3530 }
              ]
            },
            {
              monthTotal: 100,
              date: '上月',
              columns: ['usage', 'number'],
              rows: [
                { usage: '已使用', number: 1393 },
                { usage: '已超出', number: 4567 }
              ]
            }
          ],
          [
            {
              monthTotal: 100,
              date: '本月',
              columns: ['usage', 'number'],
              rows: [
                { usage: '已使用', number: 1393 },
                { usage: '未使用', number: 3530 }
              ]
            },
            {
              monthTotal: 100,
              date: '上月',
              columns: ['usage', 'number'],
              rows: [
                { usage: '已使用', number: 1393 },
                { usage: '已超出', number: 4567 }
              ]
            }
          ]
        ],
        // 运营商的筛选框
        operatorValue: '',
        optionsArr: [
          {
            value: '1',
            operator: '移动',
            isChecked: false
          },
          {
            value: '2',
            operator: '电信',
            isChecked: false
          },
          {
            value: '3',
            operator: '联通',
            isChecked: false
          }
        ]
      };
    },
    mounted() {
      this.getCompanyInfo()
      this.getMsg()
      this.getCardTotal()
    },
    methods: {
      // 切换运营商下拉框的显示隐藏状态
      toggleOperator(){
        console.log('11111')
      },
      // 获取公司信息
      getCompanyInfo(){
        this.$axios({
          url: '/api/v2/base/getBasal',
          method: 'post'
        }).then(res=>{
//          console.log(res.data)
          let data = res.data.data;
          this.company.name = data.companyName
          this.company.cardNum = data.cardNo
          this.company.balance = data.amount
        })
      },
      // 获取公告信息
      getMsg(){
        this.$axios({
          url: '/api/v2/msg/getTopMsgList',
          method: 'post'
        }).then(res=>{
//          console.log(res.data.data)
          let data = res.data.data
          for(let i=0; i<data.length; i++){
            this.systemMsg.push({
              msg: data[i].title
            })
          }
        })
      },
      // 获取卡片统计信息
      getCardTotal(){
        this.$axios({
          url: '/api/v2/device/getDeviceStatus',
          method: 'post'
        }).then(res=>{
//          console.log(res.data.data)
          let data = res.data.data
          for(let i=0; i<data.length; i++){
            this.cardData[i].title = data[i].title
            this.cardData[i].totalCard = data[i].totalCard
            let rows = data[i].rows;
            for(let j=0; j<rows.length; j++){
              this.cardData[i].rows.push({
                status: rows[j].status,
                number: rows[j].number
              })
            }
          }
        })
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
            .icon {
              width: 25px;
              height: 20px;
              background: url("../../static/images/icon-card.png");
              -webkit-background-size: 100% 100%;
              background-size: 100% 100%;
              margin-right: 20px;
              margin-top: 5px;
            }
            span {
              font-size: 22px;
              color: #000;
            }
          }
        }
        .balance {
          .title {
            display: flex;
            .icon {
              width: 20px;
              height: 20px;
              background: url("../../static/images/icon-balance.png");
              -webkit-background-size: 100% 100%;
              background-size: 100% 100%;
              margin-right: 15px;
              margin-top: 5px;
            }
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
            }
          }
        }
      }
      /* 系统消息 */
      .system-msg {
        width: 100%;
        height: 180px;
        border-radius: 5px;
        border: 1px solid #ddd;
        padding-left: 40px;
        padding-top: 20px;
        margin-bottom: 20px;
        .msg-title {
          display: flex;
          font-size: 20px;
          margin-bottom: 10px;
          .icon {
            width: 21px;
            height: 18px;
            background: url("../../static/images/icon-announcement.png");
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
            margin-left: 10px;
            margin-top: 5px;
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
          /*border-bottom: 1px solid red;*/
        }
        .chart {
          display: flex;
          .chart-item {
            flex: 1;
            text-align: center;
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
        padding-top: 30px;
        padding-bottom: 30px;
        .flow-title {
          color: #000;
          display: flex;
          line-height: 40px;
          span {
            font-size: 20px;
            margin-right: 35px;
          }
          .used, .unused, .exceeded {
            line-height: 30px;
            display: flex;
            margin-right: 40px;
            .icon {
              width: 11px;
              height: 11px;
              background-color: red;
              margin-top: 10px;
              margin-right: 20px;
            }
          }
        }
        .chart {
          .chart-item-group {
            display: flex;
            .chart-item {
              flex: 1;
              text-align: center;
            }
          }
        }
      }
    }
  }
</style>

