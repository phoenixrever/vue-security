<template>
<!--  <el-scrollbar wrap-class="scrollbar-wrapper">-->
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :unique-opened="false"
      background-color="#545c64"
      class="el-menu-vertical"
      text-color="#fff"
      active-text-color="#ffd04b"
      mode="vertical">
      <side-bar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"></side-bar-item>
    </el-menu>
<!--  </el-scrollbar>-->
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
      ...mapGetters([
        'sidebar'
      ]),
      routes() {
        return this.$store.getters.routers
      },
      activeMenu() {
        const route = this.$route
        const {meta, path} = route

        // if set path, the sidebar will highlight the path you set
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return path
      },
      variables() {
        return variables
      },
      isCollapse() {
        return !this.sidebar.opened
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      },
    }
  }
</script>

<style scoped>
  .el-aside {
    color: #333;
    line-height: 200px;
  }
  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }
  .el-menu-vertical{
    height: 100%;
  }
</style>
