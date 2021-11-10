<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <div class="title">
      <hamburger class="hamburger-container" />
      <breadcrumb class="breadcrumb-container" />
    </div>
    <el-menu-item index="1">处理中心</el-menu-item>
    <el-menu-item index="2">消息中心</el-menu-item>
    <el-submenu index="3">
      <template slot="title">我的工作台</template>
      <el-menu-item index="3-1">选项1</el-menu-item>
      <el-menu-item index="3-2">选项2</el-menu-item>
      <el-menu-item index="3-3">选项3</el-menu-item>
    </el-submenu>
    <el-dropdown>
    <span class="el-dropdown-link">
       <el-avatar class="user"  :src="avatar"></el-avatar>
    </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>个人中心</el-dropdown-item>
        <el-dropdown-item>设置</el-dropdown-item>
        <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
  import { mapGetters,mapActions } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  export default {
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    computed: {
      ...mapGetters([
        'avatar'
      ]),
    },
    components: {
      Breadcrumb,
      Hamburger
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      ...mapActions('user',['logOut']),
      logout(){
        console.log(this)
        console.log("logout")
        this.logOut().then(()=>{
          this.$message.success('退出成功')
          this.$router.push({path: '/login'})
        })
      }

    }
  }
</script>

<style scoped>
  .title{
    flex: 1;
    display: flex;
    color: slateblue;
    align-items: center;
  }

  .el-menu-demo{
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 20px 0 0;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
</style>
