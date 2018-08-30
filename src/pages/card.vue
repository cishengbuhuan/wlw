<template>
  <div class="card-wrap">
    <dream-header></dream-header>
    <dream-slide></dream-slide>
    <div class="content">
      <!-- 今日卡况 -->
      <div class="card-info">
        <div class="info-title">今日卡况</div>
        <div class="info-box">
          <div class="info-item" v-for="(item,index) in cardInfo" :key="index">
            <span>{{ item.title }}</span>
            <div class="num">{{ item.num }}</div>
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
        <div class="table-box">
          <el-table
            :data="tableData"
            id="searchTable"
            border
            style="width: 100%">
            <el-table-column prop="sortNum" label="序号" align="center"></el-table-column>
            <el-table-column prop="cardNum" label="卡号" align="center"></el-table-column>
            <el-table-column prop="iccid" label="ICCID" align="center"></el-table-column>
            <el-table-column prop="operator" label="运营商" align="center"></el-table-column>
            <el-table-column prop="flowPackage" label="流量池套餐" width='70' align="center"></el-table-column>
            <el-table-column prop="message" label="短信" align="center"></el-table-column>
            <el-table-column prop="flowUsage" label="本月已使用流量" align="center"></el-table-column>
            <el-table-column prop="flowOverage" label="本月剩余流量" align="center"></el-table-column>
            <el-table-column prop="startTime" label="计费时间" align="center"></el-table-column>
            <el-table-column prop="endTime" label="到期时间" align="center"></el-table-column>
            <el-table-column prop="cardKind" label="卡种类" align="center"></el-table-column>
            <el-table-column prop="system" label="制式" align="center"></el-table-column>
            <el-table-column prop="cardStatus" label="卡状态" align="center"></el-table-column>
          </el-table>
          <el-pagination
            v-if="totalCount > pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :page-size="pageSize"
            :current-page="pageNo"
            :total="totalCount"
            :page-sizes="[5, 10, 20]"
            @size-change="changeSize"
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
  export default {
    components: {
      dreamHeader,
      dreamSlide
    },
    data() {
      return {
        totalCount: 0,
        pageSize: 5,
        pageNo: 1,
        areaValue: '',
        statusValue: '',
        systemValue: '',
        cardInfo: [
          {
            title: '总卡数',
            num: 0
          },
          {
            title: '在线数',
            num: 0
          },
          {
            title: '停机数',
            num: 0
          },
          {
            title: '欠费数',
            num: 0
          },
          {
            title: '沉默数',
            num: 0
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
        tableData: []
      };
    },
    mounted(){
      this.getAllDeviceStatus()
      this.getTableData()
    },
    methods: {
      // 获取今日卡况的数据
      getAllDeviceStatus(){
        this.$axios({
          url: '/api/v2/device/getAllDeviceStatus',
          method: 'post'
        }).then(res=>{
          console.log(res.data.data)
          let data = res.data.data;
          this.cardInfo[0].num = data.totalCard
          this.cardInfo[1].num = data.activeNo
          this.cardInfo[2].num = data.stopNo
          this.cardInfo[3].num = data.debetNo
          this.cardInfo[4].num = data.unactiveNo
        })
      },
      // 获取表格数据
      getTableData(){
        this.$axios({
          url: '/api/v2/device/devicePageList',
          method: 'post',
          params: {
            pageSize: this.pageSize,
            pageNo: this.pageNo,
          }
        }).then(res=>{
          console.log(res.data)
          let data = res.data.data;
          this.totalCount = res.data.totalCount
          this.tableData = []
          for(let i=0; i<data.length; i++){
            this.tableData.push({
              sortNum: data[i].no,
              cardNum: data[i].cardNumber,
              iccid:  data[i].netWork === 1 ? data[i].cmIccid :
                      data[i].netWork === 2 ? data[i].cuIccid :
                      data[i].ctIccid,
              operator: data[i].netWork === 1 ? '移动' : data[i].netWork === 2 ? '联通' : '电信',
              flowPackage: data[i].packages,
              message: data[i].msgNo,
              flowUsage: data[i].usageMonth,
              flowOverage: data[i].flowOverage + 'M',
              startTime: this.timestampToTime(data[i].serveTime),
              endTime: this.timestampToTime(data[i].endTime),
              cardKind: data[i].cardType === 1 ? '大卡' :
                        data[i].cardType === 2 ? '双切' :
                        data[i].cardType === 3 ? '三切' :
                        data[i].cardType === 4 ? '2*2' :
                        data[i].cardType === 5 ? '5*6' :
                        data[i].cardType === 6 ? 'eSim' : '其他',
              system: data[i].cardType === 2 ? '2G' :
                      data[i].cardType === 3 ? '3G' :
                      data[i].cardType === 4 ? '4G' :
                      data[i].cardType === 5 ? '5G' :
                      data[i].cardType === 6 ? 'NB' :
                      data[i].cardType === 7 ? 'emtc' : '',
              cardStatus: data[i].onlineStatus === 1 ? '在线' :
                          data[i].onlineStatus === 0 ? '离线' : ''
            })
          }
        })
      },
      // 改变当前页数
      changePageNo(val){
        this.pageNo = val;
        this.getTableData()
      },
      // 改变每页显示的条数
      changeSize(val){
        this.pageSize = val;
        this.getTableData()
      },
      // 转化时间戳
      timestampToTime(timestamp) {
        let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000]
        let Y,M,D,h,m,s;
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = date.getDate() + ' ';
        h = date.getHours() + ':';
        m = date.getMinutes() + ':';
        s = date.getSeconds();
        return Y+M+D;
      },
    }
  };
</script>

<style lang="stylus" scoped>
  mainBlue = #4cb2ff;
  .card-wrap {
    padding-top: 50px;
    padding-left: 200px;
    .content {
      width: 100%;
      height: calc(100vh - 50px);
      padding: 20px;
      overflow-y: scroll;
      /* 今日卡况 */
      .card-info {
        width: 100%;
        height: 226px;
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 25px 52px 0;
        margin-bottom: 20px;
        .info-title {
          font-size: 24px;
          font-weight: 500;
        }
        .info-box {
          display: flex;
          justify-content: space-around;
          text-align: center;
          margin-top: 30px;
          span {
            font-size: 22px;
          }
          .num {
            font-size: 32px;
            margin-top: 20px;
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


