<template>
  <div class="cardDetail-wrap">
    <dream-header></dream-header>
    <dream-slide></dream-slide>
    <div class="content">
      卡详情
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

      };
    },
    mounted(){

    },
    methods: {

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

    }
  }
</style>


