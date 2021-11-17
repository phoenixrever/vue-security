<template>
  <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>权限列表</span>
    <el-button style="float: right; padding: 3px 0" type="text">保存</el-button>
  </div>
  <el-tree
    :data="data.menuTreeVos"
    node-key="menuId"
    :props="defaultProps"
    show-checkbox
    :default-checked-keys="data.checkedIds"
    :expand-on-click-node="false"
    @check="handleCheck"
    ref="menuTree"
  ></el-tree>
</el-card>
</template>

<script>
  import request from '@/utils/request'

  export default {
    name: "permissions",
    data() {
      return {
        data: [],
        defaultProps: {
          children: "children",
          label: "label"
        },
        expendedKey: [],
      }
    },
    methods: {
      // 获取数据列表
      init(userId) {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.roleId) {
            request({
              url: `/securityuaa/role/tree/${userId}`,
              method: 'get',
            }).then(resposne => {
              console.log(resposne)
              this.data=resposne.role
            })
          }
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
