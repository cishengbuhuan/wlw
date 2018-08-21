<template>
  <div class="dream-header">
    <div class="logo-name">
      <div class="logo"></div>
      <div class="name">dream world</div>
    </div>
    <div class="user">
      用户信息
    </div>
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
  .dream-header {
    width: 100%;
    height: 100px;
    line-height: 100px;
    background-color: pink;
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    .logo-name {
      display: flex;
      .logo {
        width: 60px;
        height: 60px;
        background-color: green;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
      }
      .name {
        font-size: 30px;
      }
    }
  }
</style>

