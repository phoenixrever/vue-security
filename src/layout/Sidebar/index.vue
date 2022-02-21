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
      mode="vertical"
    >
      <side-bar-item
        v-for="route in routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      ></side-bar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import SideBarItem from "./SideBarItem";

export default {
  name: "SideBar",
  components: {
    SideBarItem,
  },
  computed: {
    //computed 当依赖的数据发生改变时会被再次调用。
    routes() {
      return this.$store.getters.routers;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;

      //如果设置了高亮 activeMenu 就是这个 没有的话  路径是什么就高亮哪个路由
      //activeMenu muenu的index 唯一标识
      // console.log("route name",route);
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      //system/user/list
      return route.path;
    },
    // variables() {
    //   return variables;
    // },
    isCollapse() {
      return false;
    },
  },
  methods: {},
};
</script>

<style scoped>
.el-aside {
  color: #333;
  line-height: 200px;
}
.el-menu-vertical {
  height: 100%;
}
</style>
