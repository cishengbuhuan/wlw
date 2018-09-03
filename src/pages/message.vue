<template>
  <div class="message-wrap">
    <dream-header></dream-header>
    <dream-slide></dream-slide>
    <div class="content">
      <!-- 系统消息 -->
      <div class="msg-box">
        <div class="msg-title">
          <span>系统消息</span>
          <div class="clear-all-msg" @click="deleteAll">清空</div>
        </div>
        <div class="msg-content">
          <div class="msg-item" v-for="(item,index) in msgData" :key="index">
            <div class="msg-info">
              <div class="title">
                <span>{{ item.title }}</span>
                <div class="flag"><img :src="item.flagSrc"></div>
              </div>
              <div class="info">{{ item.info }}</div>
              <div class="time">{{ item.time }}</div>
            </div>
            <div class="delete" @click="deleteMsg(index)">删除</div>
          </div>
          <div class="no-more" v-if="msgData.length == 0">暂无消息！</div>
          <el-pagination
            v-if="totalCount > pageSize"
            layout="prev, pager, next"
            :page-size='pageSize'
            :current-page="pageNo"
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
  import {timestampToTime} from '../api/dataUtil'
  export default {
    components: {
      dreamHeader,
      dreamSlide
    },
    data() {
      return {
        totalCount: 0,
        pageSize: 10,
        pageNo: 1,
        msgData: []
      };
    },
    mounted(){
      this.getAllMsgList()
    },
    methods: {
      // 删除一行
      deleteMsg(index){
        this.$confirm('是否删除这一条消息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
            url: '/api/v2/msg/delete',
            method: 'post',
            params: {
              msgId: this.msgData[index].msgId
            }
          }).then(res=>{
            this.msgData = [];
            this.getAllMsgList()
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          console.log(this)
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 删除所有的消息
      deleteAll(){
        this.$confirm('删除所有的消息嘛?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
            url: '/api/v2/msg/clearMsg',
            method: 'post'
          }).then(res=>{
            this.msgData = [];
            this.getAllMsgList()
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          console.log(this)
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 获取到所有消息列表
      getAllMsgList(){
        this.$axios({
          url: '/api/v2/msg/getMsgPage',
          method: 'post',
          params: {
            pageSize: this.pageSize,
            pageNo: this.pageNo
          }
        }).then(res=>{
          console.log(res.data.data)
          let data = res.data.data;
          for(let i=0; i<data.length; i++){
            this.msgData.push({
              title: data[i].title,
              info: data[i].content,
              time: timestampToTime(data[i].createTime),
              msgId: data[i].messageId
            })
          }
        })
      },
      // 改变当前页数
      changePageNo(val){
        this.pageNo  = val;
      }
    }
  };
</script>

<style lang="stylus" scoped>
  mainBlue = #4cb2ff;
  .message-wrap {
    padding-top: 50px;
    padding-left: 200px;
    /*background-color: yellow;*/
    .content {
      width: 100%;
      height: calc(100vh - 50px);
      padding: 20px;
      overflow-y: scroll;
      /* 系统消息 */
      .msg-box {
        width: 100%;
        height: 100%;
        border: 1px solid #ddd;
        border-radius: 5px;
        overflow-y: scroll;
        .msg-title {
          width: 100%;
          height: 160px;
          line-height: 160px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #ddd;
          padding: 0 150px 0 60px;
          span {
            font-size: 32px;
          }
          .clear-all-msg {
            width: 100px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 20px;
            cursor: pointer;
            margin-top: 75px;
          }
        }
        .msg-content {
          padding: 0 60px;
          .msg-item {
            height: 170px;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            .msg-info {
              .title {
                font-size: 24px;
                display: flex;
                margin-top: 35px;
              }
              .info {
                font-size: 18px;
                margin: 20px 0 25px;
              }
              .time {
                font-size: 16px;
                color: #666;
              }
            }
            .delete {
              width: 80px;
              height: 30px;
              line-height: 30px;
              border: 1px solid #ddd;
              border-radius: 5px;
              text-align: center;
              cursor: pointer;
              font-size: 16px;
              margin-right: 90px;
              margin-top: 75px;
            }
          }
          .msg-item:last-child {
            border-bottom: none;
          }
          .no-more {
            font-size: 20px;
            margin-top: 35px;
          }
        }
      }
    }
  }
</style>


