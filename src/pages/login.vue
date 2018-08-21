<template>
  <div class="login-wrap">
    <header>
      <div class="logo"></div>
      <div class="line"></div>
      <span>欢迎登录</span>
    </header>
    <!-- 登录表单 -->
    <div class="login-form">
      <div class="title">账号登录</div>
      <div class="form">
        <!-- 账号 -->
        <div class="tel">
          <input type="tel" placeholder="请输入账号">
        </div>
        <!-- 密码 -->
        <div class="psw">
          <input type="password" placeholder="请输入密码">
        </div>
        <!-- 图形验证码 -->
        <div class="img-code">
          <input type="text" placeholder="请输入图形验证码">
          <div class="img">code</div>
        </div>
        <!-- 记住密码和忘记密码 -->
        <div class="remember-forget">
          <div class="remember">
            <input type="checkbox">
            <span>记住密码</span>
          </div>
          <div class="forget">忘记密码</div>
        </div>
      </div>
    </div>
    <footer>

    </footer>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      };
    },
    methods: {

    }
  };
</script>

<style lang="stylus" scoped>
  .login-wrap {
    header {
      width: 100%;
      height: 100px;
      line-height: 100px;
      background-color: yellow;
      display: flex;
      .logo {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: green;
      }
      .line {
        width: 1px;
        height: 60px;
        background-color: #ddd;
      }
      span {
        font-size: 30px;
      }
    }
    .login-form {
      background-color: orange;
      width: 400px
      .title {
        font-size: 28px
        height: 80px
        line-height: 80px
        text-align: center
        border-bottom: 1px solid #ddd;
      }
      .form {
        /* 账号和密码 */
        .tel, .psw {
          width: 100%
          height: 60px
          border-bottom: 1px solid #ddd;
          input {
            width: 100%
            height: 100%
          }
        }
        /* 图形验证码 */
        .img-code {
          display: flex
          height: 60px
          border-bottom: 1px solid #ddd;
          input {
            width: 100%
          }
          .img {
            width: 60px
            height: 60px
            background-color: red;
          }
        }
        /* 记住密码和忘记密码 */
        .remember-forget {
          display: flex;
          justify-content: space-between;
          .forget {
            cursor: pointer;
          }
        }
      }
    }
    footer {
      height: 100px
      background-color: cadetblue;
    }
  }
</style>

