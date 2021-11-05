<template>
  <el-container>
    <el-aside width="210px">
      <div class="sidebar-container">
      <SideBar ></SideBar>
      </div>
    </el-aside>
    <el-container>
      <el-header>
        <NavMenu class="navmenu"></NavMenu>
      </el-header>
      <el-main>
        <transition name="fade-transform" mode="out-in">
          <!-- 创建和编辑的页面使用的是同一个 component，默认情况下这两个页面切换时并不会触发 vue 的 created 或者 mounted 钩子 -->
          <router-view :key="key"></router-view>
        </transition>
      </el-main>
      <!--      <el-footer>Footer</el-footer>-->
    </el-container>
  </el-container>
</template>

<script>
  import NavMenu from './NavMenu'
  // import SideBar from '../components/Sidebar'
  import SideBar from './Sidebar/index'
  import variables from '@/styles/variables.scss'


  export default {
    name: 'Layout',
    data() {
      return {
        foo: "123"
      }
    },
    components: {
      NavMenu,
      SideBar
    },
    computed: {
      cachedViews() {
        return this.$store.state.tagsView.cachedViews
      },
      key() {
        // 只要保证 key 唯一性就可以了，保证不同页面的 key 不相同
        return this.$route.fullPath
      }
    }
  }
</script>

<style  scoped>
  .el-header {
    padding: 0;
  }

  .el-main {
    padding: 20px;
    overflow-x: hidden;
  }

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-size: 18px;
    color: #F56C6C;
  }

  .el-container {
    height: 100%;
  }

</style>
