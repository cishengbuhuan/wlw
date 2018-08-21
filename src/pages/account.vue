<template>
  <div class="card-wrap">
    <dream-header></dream-header>
    <dream-slide></dream-slide>
    <div class="content">
      账户
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
    methods: {

    }
  };
</script>

<style lang="stylus" scoped>
  .card-wrap {
    margin-top: 100px;
    margin-left: 200px;
    background-color: yellow;
  }
</style>

