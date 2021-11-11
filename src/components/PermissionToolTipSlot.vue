<template>
  <!-- tootip disabled 的情况下 需要 设置 disabled=false  并且里面的内容需要包上一层div 或者span -->
  <el-tooltip content="你无权限进行此操作!"
              :disabled="disabled"
              :placement="placement?placement:'top'"
              :effect="effect?effect:'light'">
    <span :style="{'margin-right': marginRight,'margin-left':marginLeft}">
      <slot></slot>
    </span>
  </el-tooltip>
</template>

<script>
  export default {
    name: "PermissionToolTip",
    props: ['placement', 'effect', 'marginRight','marginLeft',"disabled"]
  }
</script>

<style scoped>

</style>
