<template>
  <div class="dream-slide">
    <el-col :span="24">
      <h5>默认颜色</h5>
      <el-menu
        default-active="2"
        active-text-color="green"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose">
        <template v-for="(item,index) in menus">
          <el-submenu v-if="item.menuTwo && item.menuTwo.length > 0" :index="item.index">
            <template slot="title">
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item-group v-for="child in item.menuTwo">
              <el-menu-item :index="child.index" @click="toPath(child)">
                {{ child.titleTwo }}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item v-else :index="item.index" @click="toPath(item)">
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-col>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        menus: [
          {
            title: '首页',
            index: '1',
            path: '/index'
          },
          {
            title: '卡片管理',
            index: '2',
            menuTwo: [
              {
                titleTwo: '卡片列表',
                path: '/card',
                index: '2-1'
              }
            ]
          },
          {
            title: '流量池',
            index: '3',
            menuTwo: [
              {
                titleTwo: '10M套餐',
                path: '/flowPool',
                index: '3-1'
              },
              {
                titleTwo: '20M套餐',
                path: '/flowPool',
                index: '3-2'
              },
              {
                titleTwo: '30M套餐',
                path: '/flowPool',
                index: '3-3'
              }
            ]
          },
          {
            title: '系统设置',
            index: '4',
            menuTwo: [
              {
                titleTwo: '立即充值',
                path: '/recharge',
                index: '4-1'
              },
              {
                titleTwo: '我的账户',
                path: '/account',
                index: '4-2'
              }
            ]
          }
        ]
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      toPath(path) {
        this.$router.replace(path)
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .dream-slide {
    width: 340px;
    height: 100%;
    background-color: #334766;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 990;
    padding-top: 100px;
  }
</style>
<style lang="stylus">
  .dream-slide {
    .el-col {
      ul.el-menu {
        border-right: none;
        background-color: transparent;
        li.el-menu-item {
          font-size: 36px;
          color: #bbb;
        }
        li.el-submenu {
          .el-submenu__title {
            font-size: 36px;
            color: #bbb;
          }
        }
      }
    }
  }
</style>

