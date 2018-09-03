<template>
  <div class="dream-header">
    <div class="logo-box">
      <div class="logo"><img src="../../../static/images/logo.png"></div>
    </div>
    <div class="user">
      <div class="info">
        <router-link to="/message">
          <span>消息</span>({{ user.msgNum }})
        </router-link>
      </div>
      <div class="head-name">
        <img class="head" :src="user.headImg">
        <div class="name">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              {{ user.nickname }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click="signOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        user: {
          msgNum: 0,
          headImg: '../../static/images/default-head.png',
          nickname: ''
        }
      };
    },
    mounted(){
      this.getHeaderInfo()
    },
    methods: {
      getHeaderInfo(){
        this.$axios({
          url: '/api/v2/base/getBasal',
          method: 'post'
        }).then(res=>{
          let data = res.data.data;
          this.user.msgNum = data.unReadNo;
          this.user.headImg = data.avatar ? data.avatar : '../../static/images/default-head.png';
          this.user.nickname = data.companyName;
        })
      },
      // 退出登录
      signOut(){
        console.log('退出')
        localStorage.removeItem('_token');
        this.$router.push({ path: '/' })
      }
    }
  };
</script>

<style lang="stylus" scoped>
  mainHeader = #4cb2ff;
  .dream-header {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: mainHeader;
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    padding-right: 60px;
    .logo-box {
      width: 200px;
      height: 100%;
      position: relative;
      .logo {
        transform: translate(-50%,-50%);
        position: absolute;
        left: 50%;
        top: 40%;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .user {
      display: flex;
      .info {
        a {
          color: #fff;
          font-size: 16px;
          margin-right: 25px;
          cursor: pointer;
        }
      }
      .head-name {
        display: flex;
        .head {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          margin-top: 11px;
          margin-right: 10px;
        }
        .name {
          display: flex;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          span {
            color: #fff;
            font-size: 16px;
          }
        }
      }
    }
  }
</style>

