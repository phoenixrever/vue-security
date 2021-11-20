<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :unique-opened="false"
      background-color="#304156"
      class="el-menu-vertical"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse-transition="false"
      mode="vertical">
      <side-bar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"></side-bar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SideBarItem from './SideBarItem'

  export default {
    name: "SideBar",
    components: {
      SideBarItem
    },
    computed: {
      //computed 当依赖的数据发生改变时会被再次调用。
      routes() {
        return this.$store.getters.routers
      },
      activeMenu() {
        const route = this.$route
        console.log(route)
        const {meta, path} = route

        //如果设置了高亮 activeMenu 就是这个 没有路径是什么就高亮哪个路由
        //activeMenu muenu的index 唯一标识
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        //system/user/list
        console.log(path)
        return path
      },
      variables() {
        return variables
      },
      isCollapse() {
        return false
      },
      // urlOpen(){
      //   let array=[]
      //   let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      //   const father = matched[0]
      //   console.log(father)
      //   array.push(father.path)
      //   return array
      // }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
    }
  }
</script>

<style scoped>
  .el-aside {
    color: #333;
    line-height: 200px;
  }
  .el-menu-vertical{
    height: 100%;
  }
</style>
