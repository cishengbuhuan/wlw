<template>
  <div class="flowPool-wrap">
    <dream-header></dream-header>
    <dream-slide></dream-slide>
    <div class="content">
      <!-- 基本信息 -->
      <div class="base-info">
        <div class="info-header">
          <span>{{ operator }}</span>
          <el-select v-model="packageValue"
                     placeholder="请选择套餐">
            <el-option
              v-for="item in packageOptions"
              :key="item.value"
              :label="item.flowPackage"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!-- 基本信息的饼图 -->
        <div class="info-chart">
          <!-- 饼图 -->
          <div class="chart">
            <div class="chart-item" v-for="(item,index) in baseInfo.ringData" :key="index">
              <ve-pie :data="item" :settings="baseSettings" :extend="baseExtend"></ve-pie>
            </div>
          </div>
          <!-- tips -->
          <div class="chart-tips">
            <span>总流量：{{ baseInfo.totalFlow }}M</span>
            <span>单卡流量：{{ baseInfo.singleFlow }}M</span>
            <span>使用率：{{ baseInfo.usageRate }}M</span>
            <span>已超出：{{ baseInfo.overview }}M</span>
            <span>预警数：{{ baseInfo.warnNumber }}M</span>
            <span>报警卡数：{{ baseInfo.alarmCardNumber }}M</span>
          </div>
        </div>
      </div>
      <!-- 流量池表格 -->
      <div class="flow-table">
        <div class="table-header">
          <!-- 搜索框 -->
          <div class="search-box">
            <input type="text" placeholder="请输入ICCID">
            <div class="btn-search"><i class="el-icon-search"></i></div>
          </div>
          <!-- 联动选择器 -->
          <div class="cascader">
            <!-- 地区运营商 -->
            <el-select v-model="areaValue"
                       placeholder="请选择地区">
              <el-option
                v-for="item in selectData.areaOptions"
                :key="item.value"
                :label="item.area"
                :value="item.value">
              </el-option>
            </el-select>
            <!-- 状态 -->
            <el-select v-model="statusValue"
                       placeholder="请选择状态">
              <el-option
                v-for="item in selectData.statusOptions"
                :key="item.value"
                :label="item.status"
                :value="item.value">
              </el-option>
            </el-select>
            <!-- 制式 -->
            <el-select v-model="systemValue"
                       placeholder="请选择制式">
              <el-option
                v-for="item in selectData.systemOptions"
                :key="item.value"
                :label="item.system"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <!-- 时间查询 -->
          <div class="time-inquire">
            <span>时间：</span>
            <el-date-picker
              v-model="timeValue"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="到"
              start-placeholder="计费时间"
              end-placeholder="结束时间">
            </el-date-picker>
            <div class="btn-inquire">查询</div>
          </div>
        </div>
        <!-- table内容 -->
        <div class="table-box">
          <el-table
            :data="tableData"
            id="searchTable"
            border
            style="width: 100%">
            <el-table-column prop="sortNum" label="序号" align="center"></el-table-column>
            <el-table-column prop="cardNum" label="卡号" align="center"></el-table-column>
            <el-table-column prop="operator" label="运营商" align="center"></el-table-column>
            <el-table-column prop="flowPackage" label="流量池套餐" width='70' align="center"></el-table-column>
            <el-table-column prop="flowUsage" label="本月已使用流量" align="center">
              <template slot-scope="scope">
                {{ scope.row.flowUsage.toFixed(2) }}MB
              </template>
            </el-table-column>
            <el-table-column prop="message" label="短信" align="center"></el-table-column>
            <el-table-column prop="endTime" label="到期时间" align="center"></el-table-column>
            <el-table-column prop="cardStatus" label="卡状态" align="center"></el-table-column>
            <el-table-column prop="operate" label="操作" align="center">
              <template slot-scope="scope">
                <span @click="goDetail(scope.row)">{{ scope.row.operate }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="totalCount > pagesize"
            layout="prev, pager, next"
            :page-size='pagesize'
            :current-page="pageno"
            :total="totalCount"
            @current-change="changePageNo">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import dreamHeader from '../components/dreamHeader/dreamHeader.vue'
  import dreamSlide from '../components/dreamSlide/dreamSlide.vue'
  import VePie from "v-charts/lib/pie.common";
  export default {
    components: {
      dreamHeader,
      dreamSlide,
      VePie
    },
    data() {
      this.baseSettings = {
        labelLine: 'show',
        label: {
          position: 'inside'
        },
        radius: 160,
        offsetY: 200
      }

      this.baseExtend = {
        legend: {
          orient: 'vertical',
          align: 'center',
          top: 100,
          left: 0,
          itemWidth: 11,
          itemHeight: 11,
          textStyle: {
            borderRadius: '50%',
            padding: [0, 0, 0, 70],
          }
        }
      }
      return {
        packageValue: '',
        // 筛选的套餐
        packageOptions: [
          {
            value: '1',
            flowPackage: '10M'
          },
          {
            value: '2',
            flowPackage: '20M'
          },
          {
            value: '3',
            flowPackage: '30M'
          },
          {
            value: '4',
            flowPackage: '50M'
          },
        ],
        // 饼状图数据
        baseInfo: {
          totalFlow: 100,
          singleFlow: 10,
          usageRate: '10%',
          overview: 20,
          warnNumber: 2,
          alarmCardNumber: 3,
          ringData: [
            {
              columns: ['usage', 'number'],
              rows: [
                { usage: '已激活', number: 1393 },
                { usage: '已停卡', number: 3530 },
                { usage: '已消费', number: 2923 }
              ]
            },
            {
              columns: ['usage', 'number'],
              rows: [
                { usage: '已激活', number: 1393 },
                { usage: '已停卡', number: 3530 },
                { usage: '已消费', number: 2923 }
              ]
            }
          ],
          ring: {
            columns: ['usage', 'number'],
            rows: [
              { usage: '已使用', number: 1393 },
              { usage: '未使用', number: 3530 },
              { usage: '已超出', number: 3530 }
            ]
          }
        },
        totalCount: 134,
        pagesize: 10,
        pageno: 1,
        areaValue: '',
        statusValue: '',
        systemValue: '',
        cardInfo: [
          {
            title: '总卡数',
            num: 10
          },
          {
            title: '在线数',
            num: 10
          },
          {
            title: '停机数',
            num: 10
          },
          {
            title: '欠费数',
            num: 10
          },
          {
            title: '沉默数',
            num: 10
          }
        ],
        selectData: {
          areaOptions: [
            {
              value: '1',
              area: '北京移动'
            },
            {
              value: '2',
              area: '上海移动'
            },
            {
              value: '3',
              area: '上海电信'
            },
            {
              value: '4',
              area: '广东联通'
            }
          ],
          statusOptions: [
            {
              value: '1',
              status: '在线'
            },
            {
              value: '2',
              status: '离线'
            }
          ],
          systemOptions: [
            {
              value: '1',
              system: '三切'
            },
            {
              value: '2',
              system: '双切'
            },
            {
              value: '3',
              system: '5*6'
            },
            {
              value: '4',
              system: '2*2'
            }
          ]
        },
        timeValue: '',
        tableData: [
          {
            sortNum: '1234',
            cardNum: '123456789',
            operator: '电信',
            flowPackage: '10M',
            flowUsage: 12,
            message: 0,
            endTime: '2019-07-31',
            cardStatus: '在线',
            operate: '查看详情'
          },{
            sortNum: '1234',
            cardNum: '123456789',
            operator: '电信',
            flowPackage: '10M',
            flowUsage: 12,
            message: 0,
            endTime: '2019-07-31',
            cardStatus: '在线',
            operate: '查看详情'
          },{
            sortNum: '1234',
            cardNum: '123456789',
            operator: '电信',
            flowPackage: '10M',
            flowUsage: 12,
            message: 0,
            endTime: '2019-07-31',
            cardStatus: '在线',
            operate: '查看详情'
          },{
            sortNum: '1234',
            cardNum: '123456789',
            operator: '电信',
            flowPackage: '10M',
            flowUsage: 12,
            message: 0,
            endTime: '2019-07-31',
            cardStatus: '在线',
            operate: '查看详情'
          }
        ]
      };
    },
    mounted(){
      this.getPoolList()
    },
    methods: {
      goDetail(){
        this.$router.push({ path: '/index' })
      },
      // 改变当前页数
      changePageNo(val){
        this.pageno  = val;
      },
      getPoolList(){
        this.$axios({
          url: '/api/v2/pool/poolList',
          method: 'post'
        }).then(res=>{
          console.log(res.data)
        })
      }
    },
    computed: {
      operator(){
        return this.$route.query.flowType === 1 ? '中国移动' :
               this.$route.query.flowType === 2 ? '中国联通' :
               this.$route.query.flowType === 3 ? '中国电信' : ''
      }
    }
  };
</script>

<style lang="stylus" scoped>
  mainBlue = #4cb2ff;
  .flowPool-wrap {
    padding-top: 50px;
    padding-left: 200px;
    .content {
      width: 100%;
      height: calc(100vh - 50px);
      padding: 20px;
      overflow-y: scroll;
      /* 基本信息 */
      .base-info {
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-bottom: 20px;
        padding: 30px 0 0 0;
        .info-header {
          padding-left: 40px;
        }
        .info-chart {
          width: 100%;
          padding-bottom: 70px;
          /* 饼图 */
          .chart {
            display: flex;
            .chart-item {
              flex: 1;
              text-align: center;
            }
          }
          /* tips */
          .chart-tips {
            text-align: center;
            font-size: 20px;
            display: flex;
            justify-content: space-between;
            padding: 0 70px;
            /*span {
              margin-right: 50px;
            }*/
          }
        }
      }
      /* 流量池表格 */
      .flow-table {
        width: 100%;
        padding:30px 30px 40px 30px;
        border: 1px solid #ddd;
        border-radius: 5px;
        .table-header {
          display: flex;
          flex-wrap: wrap;
          /*justify-content space-between*/
          /* 搜索框 */
          .search-box {
            width: 400px;
            height: 40px;
            border-radius: 5px
            border: 1px solid #dcdfe6;
            display: flex;
            justify-content: space-between;
            margin-right: 60px;
            margin-bottom: 30px;
            input {
              width: 100%;
              height: 100%;
              padding-left: 20px;
              font-size: 16px;
              color: #606266;
            }
            input::-webkit-input-placeholder{
                    color: #999;
                  }
            .btn-search {
              width: 56px;
              height: 100%;
              line-height: 40px;
              border-left: 1px solid #dcdfe6;
              font-size: 24px;
              color: #cbcccd;
              text-align: center;
              cursor: pointer;
            }
          }
          /* 联动选择器 */
          .cascader {
            display: flex;
            .el-select {
              margin-right: 10px;
            }
            .el-select:last-child {
              margin-right: 0;
            }
            /* 地区运营商 */
            .area, .status, .system {
              position: relative;
              margin-right: 10px;
              .default {
                width: 200px;
                height: 50px;
                border-radius: 5px
                border: 1px solid #999;
                display: flex;
                justify-content: space-between;
                input {
                  width: 100%;
                  height: 100%;
                  padding-left: 20px;
                  font-size: 16px;
                }
                input::-webkit-input-placeholder{
                        color: #999999;
                      }
                .btn-select {
                  width: 56px;
                  height: 100%;
                  line-height: 50px;
                  border-left: 1px solid #999;
                  font-size: 24px;
                  color: #656565;
                  text-align: center;
                  cursor: pointer;
                }
              }
              .options {
                width: 100%;
                background-color: #fff;
                border: 1px solid #999;
                border-radius: 5px;
                position: absolute;
                z-index: 999;
                left: 0;
                top: 55px;
                .options-item {
                  width: 100%;
                  height: 44px;
                  line-height: 44px;
                  border-bottom: 1px solid #999;
                  padding-left: 20px;
                  cursor: pointer;
                  font-size: 16px;
                  color: #666666;
                }
                .options-item:hover {
                  background-color: #eee;
                }
                .options-item:last-child {
                  border-bottom: none;
                }
              }
            }
            .system {
              margin-right: 0;
            }
          }
          /* 时间查询 */
          .time-inquire {
            line-height: 40px;
            display: flex;
            span {
              font-size: 16px;
            }
            .btn-inquire {
              width: 90px;
              height: 40px;
              line-height: 40px;
              border: 1px solid #999;
              border-radius: 5px;
              text-align: center;
              cursor: pointer;
              font-size: 16px;
              margin-left: 40px;
            }
          }
        }
        .table-box {
          margin-top: 40px;
          .el-pagination {
            text-align: center;
            margin-top: 40px;
          }
        }
      }
    }
  }
</style>


