<template>
  <el-select v-model="value" filterable
             placeholder="请选择"
             ref="iconInput"
             class="icon-list"
             suffix-icon="el-icon-date"
             :popper-append-to-body="false"
             @focus="setOptionWidth"
             style="width: 100%"
  >
    <el-option
      v-for="icon in icons"
      :key="icon"
      :label="icon"
      :value="icon">
      <i :class="icon"></i>
    </el-option>
  </el-select>
</template>

<script>
  import icons from './icons.js'

  export default {
    name: "index",
    props: {
      iconString:String,
    },
    created() {
      console.log('iconString',this.iconString);
    },
    data() {
      return {
        icons: icons,
        value: this.iconString,
      }
    },
    watch: {
      iconString(newValue){
        this.value=newValue
      },
      value(newValue){
        this.refreshDataFormIcon(newValue)
      }
    },

    methods: {
      setOptionWidth(event){
        //watch  是监视不了el 元素的宽度等的变化的 只能在事件里面触发
        this.$nextTick(() => {
          let width = this.$refs.iconInput.$el.clientWidth+'px';
          this.$refs.iconInput.$el.getElementsByClassName("el-select-dropdown el-popper")[0].style.width=width
        });
      },
      refreshDataFormIcon(val) {
        this.$emit('selectIcon', val)
      },

      //这边select 不需要防抖函数
      debounce(func, delay) {
        let timer = null;
        //arg 为func的args
        return function (...args) {
          if (timer) timer = clearTimeout(timer);
          timer = setTimeout(() => {
            func.apply(this, args);
          }, delay)
        }
      },
    }
  }
</script>

<style>
.icon-list .el-select-dropdown__list{
  overflow: hidden;
  list-style: none;
  padding: 0!important;
  border: 1px solid #eaeefb;
  border-radius: 4px;
}

.icon-list .el-select-dropdown__list li{
  float: left;
  width: 16.76%;
  text-align: center;
  vertical-align: middle;
  height:60px;
  line-height:60px;
  font-size: 13px;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-right: -1px;
  margin-bottom: -1px;
}

.icon-list .el-select-dropdown__list li i{
  /*display: block;*/
  font-size: 20px;
  /*margin-bottom: 5px;*/
  /*color: #606266;*/
  transition: color .15s linear;
}

/*flex  最后一行不好调*/

</style>
