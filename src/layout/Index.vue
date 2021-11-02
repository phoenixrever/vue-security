<template>
  <el-container>
    <el-aside width="200px"> <SideBar class="sideBar"></SideBar></el-aside>
    <el-container>
      <el-header>
        <div class="navbar">
          <div class="title">very very simple admin template</div>
          <NavMenu class="navmenu"></NavMenu>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <!--      <el-footer>Footer</el-footer>-->
    </el-container>
  </el-container>
</template>

<script>
  import NavMenu from '@/components/NavMenu'
  import SideBar from '@/components/SideBar'

  export default {
    name: 'Layout',
    components: {
      NavMenu,
      SideBar
    }
  }
</script>

<style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .sideBar{
    height: 100%  ;
  }

  .title {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-size: 18px;
    color: #F56C6C;
  }

  .el-container {
    height: 100%;
  }


  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
