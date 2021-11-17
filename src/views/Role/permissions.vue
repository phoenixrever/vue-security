<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span><el-tag type="danger">{{role.name}}</el-tag> 的权限列表</span>
      <el-button style="float: right; padding: 6px 0" type="text" :loading="loading" @click="savePermissions">保存</el-button>
    </div>
    <el-tree
      :data="data.menuTreeVos"
      node-key="menuId"
      :props="defaultProps"
      show-checkbox
      :default-checked-keys="data.checkedIds"
      :default-expanded-keys="expandedKeys"
      :expand-on-click-node="false"
      ref="menuTree"
    ></el-tree>
  </el-card>
</template>

<script>
import request from '@/utils/request'

export default {
  name: "permissions",
  props:['role'],
  data() {
    return {
      data: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      loading:false,
      expandedKeys: [],
    }
  },
  methods: {
    // 获取数据列表
    init(userId) {
      this.$nextTick(() => {
        // this.data = []
        request({
          url: `/securityuaa/role/tree/${userId}`,
          method: 'get',
        }).then(resposne => {
          console.log(resposne)
          this.data = resposne.role
          this.getExpandedKeys()
        })
      })
    },

    getExpandedKeys(){
      this.expandedKeys=[]
      this.data.menuTreeVos.forEach(m=>{
        this.findChildren(m)
      })
      console.log(this.expandedKeys);
    },
    findChildren(m){
      if(m && m.children && m.children.length>0){
        m.children.forEach(child=>{
          if(this.data.checkedIds.indexOf(child.menuId)>-1){
            if(this.expandedKeys.indexOf(m.menuId)===-1){
              this.expandedKeys.push(m.menuId)
            }
          }
          this.findChildren(child)
        })
      }
    },

    savePermissions(){
      console.log(this.$refs.menuTree.getCheckedKeys());
      let rolesMenusEntities = this.$refs.menuTree.getCheckedKeys().map(item=>{
        let rolesMenusEntity={}
        rolesMenusEntity.roleId=this.role.roleId
        rolesMenusEntity.menuId=item
        return rolesMenusEntity
      })
      console.log(rolesMenusEntities);
      request({
        url: `/securityuaa/role/savePermissions`,
        method: 'post',
        data:rolesMenusEntities
      }).then(resposne => {
        console.log(resposne)
      })

    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/securityuaa/role/${!this.dataForm.roleId ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'roleId': this.dataForm.roleId || undefined,
              'name': this.dataForm.name,
              'level': this.dataForm.level,
              'description': this.dataForm.description,
              'dataScope': this.dataForm.dataScope,
              'createBy': this.dataForm.createBy,
              'updateBy': this.dataForm.updateBy,
              'createTime': this.dataForm.createTime,
              'updateTime': this.dataForm.updateTime
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}

</script>

<style scoped>

</style>
