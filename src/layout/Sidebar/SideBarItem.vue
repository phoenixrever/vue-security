<template>
  <div v-if="!item.hidden">
      <!--  hasOneShowingChild  没有或者只有1个children   -->
      <!--  第二个条件  (没有children  或者 不显示children) &&  alwaysShow 为false -->

    <!-- !item.alwaysShow  是否开启始终显示  如果填入了这个属性，哪怕是hidden 也会被展示 -->
    <!--这些条件全部命中的话就会展示template而不是submenu  结束 递归-->

    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <!--      由于循环的时候使用了data中的一个变量onlyOneChild，然后在循环中又去执行一个方法重新对onlyOneChild赋值，
      可能会造成数据更新，然后视图也去更新，新版的浏览器没有这个问题-->
      <router-link  v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <template slot="title">
            <i :class="onlyOneChild.meta.icon"></i>
            <span slot="title">{{onlyOneChild.meta.title}}</span>
          </template>
        </el-menu-item>
      </router-link>
    </template>
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
<!--        <i :class="item.meta.icon"></i>-->
        <span slot="title">{{item.meta.title}}</span>
      </template>
      <side-bar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>

</template>

<script>
  import path from 'path'

  export default {
    name: "SideBarItem",
    props: ['item','basePath'],
    data() {
      //必须写在外面(作为全局变量) 不然 刷新sidebar infinite loop
      //todo 原因を探せ！
      this.onlyOneChild = null
      return {
      }
    },
    created(){

    },
    mounted(){

    },
    methods: {
      hasOneShowingChild(children = [], parent) {
        //第一步 筛选出需要显示的children(不hidden)
        const showingChildren = children.filter(item => {
          if (item.hidden) {
            return false
          } else {
            // Temp set(will be used if only has one showing child)
            //如果不是hidden 会将当前的sidebar里面的onlyOneChild设成item

            // 如果只有一个子菜单时设置
            //重要   只是适用只有一个子元素的情况 多个不用这个onlyOneChild
            this.onlyOneChild=item
            return true
          }
        })


        // When there is only one child router, the child router is displayed by default
        // 判断showingChildren的长度 只有1个子元素的情况 直接返回true
        if (showingChildren.length === 1) {
          // console.log("showingChildren[0]",showingChildren[0])
          // this.onlyOneChild=showingChildren[0]
          return true
        }

        // Show parent if there are no child router to display
        //没有子路由就直接显父路由
        if (showingChildren.length === 0) {
          this.onlyOneChild = { ... parent, path:'', noShowingChildren: true }
          return true
        }
        //超过1个子元素的直接返回 false
        return false
      },

      resolvePath(routePath) {
        // console.log("resolvePath",routePath)
        //对这2个链接拼接形成路由路径  /test/test1
        return path.resolve(this.basePath, routePath)
      }
    }
  }
</script>

<style scoped>

</style>
