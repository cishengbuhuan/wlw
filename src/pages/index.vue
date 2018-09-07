<template>
  <div class="index-wrap">
    <dream-header></dream-header>
    <dream-slide></dream-slide>
    <div class="content">
      <!-- 公司名称和账户余额 -->
      <div class="name-balance">
        <div class="company-name">
          <div class="title">{{ company.name }}</div>
          <div class="card-num"><div class="icon" :style="cardNumIcon"></div>卡片总数：<span>{{ company.cardNum }}</span></div>
        </div>
        <div class="balance">
          <div class="title"><div class="icon" :style="balanceIcon"></div><span>账户余额</span></div>
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
          <div class="left">公告<div class="icon" :style="msgTitleIcon"></div></div>
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
        <div class="card-title">卡片统计</div>
        <div class="chart">
          <div class="chart-item" v-for="(item,index) in cardData" :key="index">
            <div class="title">{{ item.title }}:{{ item.totalCard }}</div>
            <ve-ring :data="item" :colors="cardColors" :settings="cardSettings" :extend="cardExtend"></ve-ring>
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
          <div class="tips-info" v-show="flowShow">暂时没有相关数据！</div>
          <div class="chart-item-group" v-for="(item,index) in flowData" :key="index">
            <div class="chart-item" v-for="(itemSon,indexSon) in item" :key="indexSon">
              <ve-pie :data="itemSon" :colors="flowColors" :settings="flowSettings" :extend="flowExtend"></ve-pie>
              <div class="title">{{ itemSon.date }}：{{ itemSon.monthTotal }}</div>
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
        },
        series: {
          colors: ['#4cb2ff','#36dwf6','#010101','#fh357d','#ed45gt']
        }
      }
      this.cardColors = ['#ffbf00','#fa5e5b','#20a0ff','#13ce66','#4dd0e1']

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
      this.flowColors = ['#bbbbbb','#4cb2ff','#da2627']

      return {
        cardNumIcon: {
          width: '25px',
          height: '20px',
          background: "url("+require('../../static/images/icon-card.png')+") no-repeat",
          backgroundSize:'100% 100%',
          marginRight: '20px',
          marginTop: '5px'
        },
        balanceIcon: {
          width: '20px',
          height: '20px',
          background: "url("+require('../../static/images/icon-balance.png')+") no-repeat",
          backgroundSize:'100% 100%',
          marginRight: '15px',
          marginTop: '5px'
        },
        msgTitleIcon: {
          width: '21px',
          height: '18px',
          background: "url("+require('../../static/images/icon-announcement.png')+") no-repeat",
          backgroundSize:'100% 100%',
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
            columns: ['status', 'number'],
            rows: []
          },
          {
            title: '',
            totalCard: 0,
            columns: ['status', 'number'],
            rows: []
          },
          {
            title: '',
            totalCard: 0,
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
        flowShow: false
      };
    },
    mounted() {
      this.getCompanyInfo()
      this.getMsg()
      this.getCardTotal()
      this.getFlowTotal()
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
      },
      // 获取流量统计数据
      getFlowTotal(){
        this.$axios({
          url: '/api/v2/pool/poolnetWorkList',
          method: 'post',
          params: {
            netWork: this.netWork ? this.netWork : this.defaultNetWork
          }
        }).then(res=>{
          let data = res.data.data;
          var result = [];

          if(data.length === 0){
            this.flowShow = true;
            this.flowData = []
          }else {
            this.flowShow = false;
            for(let i=0; i<data.length; i++){
              var arr = [];
              for(let j=0; j<data[i].length; j++){
                var obj={
                  columns: ['usage', 'number'],
                  rows:[]
                };
                obj.monthTotal=data[i][j].monthTotal
                obj.date=data[i][j].date;

                for(let k=0; k<data[i][j].rows.length; k++){
                  // console.log(data[i][j])
                  obj.rows.push({
                    usage:data[i][j].rows[k].status,
                    number:data[i][j].rows[k].number
                  })
                }
                arr.push(obj)
              }
              result.push(arr)
            }
            this.flowData = result
            console.log(this.flowData)
          }
        })
      },
      // 运营商的下拉框的值发生变化的时候触发
      toggleOperator(val){
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
        height: 180px;
        border-radius: 5px;
        border: 1px solid #ddd;
        padding-left: 40px;
        padding-top: 20px;
        margin-bottom: 20px;
        .msg-title {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding-right: 40px;
          .left {
            font-size: 20px;
            display: flex;
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
              background-color: #4cb2ff;
              margin-top: 10px;
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

