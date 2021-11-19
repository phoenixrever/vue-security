<template>
  <el-select v-model="value" filterable
             placeholder="请选择"
             class="icon-list"
             :popper-append-to-body="false"
             style="width: 100%"
  >
    <el-option
      v-for="icon in icons"
      :key="icon+new Date()"
      class="iconOption"
      :label="icon"
      :value="icon">
      <i :class="icon" size="small"></i>
    </el-option>
  </el-select>
</template>

<script>
  import icons from './icons.js'
    export default {
        name: "index",
      props:['iconString'],
      activated(){

      },
      watch:{
        deep:true,
        handler(newValue){
          this.debounce(this.refreshDataFormIcon(newValue),500)
        }
      },
      data() {
        return {
          icons:icons,
          value: this.iconString
        }
      },
      methods:{
          refreshDataFormIcon(val){
            this.$emit('selectIcon',val)
          },
        debounce(func,delay){
          let timer=null;
          //arg 为func的args
          return function(...args){
            if(timer) timer=clearTimeout(timer);
            timer=setTimeout(()=>{
              func.apply(this,args);
            },delay)
          }
        },
      }
    }
</script>

<style>
  /*.icon-list .el-select-dropdown__list{*/
  /*  overflow: hidden;*/
  /*  list-style: none;*/
  /*  padding: 0!important;*/
  /*  border: 1px solid #eaeefb;*/
  /*  border-radius: 4px;*/
  /* }*/

  /*.icon-list .el-select-dropdown__list{*/
  /*  overflow: hidden;*/
  /*  list-style: none;*/
  /*  padding: 0!important;*/
  /*  border: 1px solid #eaeefb;*/
  /*  border-radius: 4px;*/
  /*}*/

  /*.icon-list .el-select-dropdown__list li{*/
  /*  float: left;*/
  /*  width: 16.66%;*/
  /*  text-align: center;*/
  /*  height:60px;*/
  /*  line-height:60px;*/
  /*  color: #666;*/
  /*  font-size: 13px;*/
  /*  border-right: 1px solid #eee;*/
  /*  border-bottom: 1px solid #eee;*/
  /*  margin-right: -1px;*/
  /*  margin-bottom: -1px;*/
  /*}*/
  /*.icon-list .el-select-dropdown__list li i{*/
  /*  display: block;*/
  /*  font-size: 25px;*/
  /*  !*margin-bottom: 5px;*!*/
  /*  color: #606266;*/
  /*  transition: color .15s linear;*/
  /*}*/

  .icon-list .el-select-dropdown__list {
    display: flex;
    flex-flow: row wrap;
  }

  .icon-list .el-select-dropdown__item {
    /*font-size: 14px;*/
    padding: 10px 20px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /*color: #606266;*/
    height: 50px;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }

  .iconOption i{
    font-size: 20px;
  }
</style>
