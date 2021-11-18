<template>
  <el-dialog
    :title="!dataForm.roleId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-row :gutter="20">
        <el-col :lg="12" :md="22">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="22">
          <el-form-item label="描述" prop="description">
            <el-input v-model="dataForm.description" placeholder="描述"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :lg="12" :md="22">
          <el-form-item label="数据权限" prop="dataScope">
            <el-input v-model="dataForm.dataScope" placeholder="数据权限"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="22">
          <el-form-item label="创建者" prop="createBy">
            <el-input v-model="dataForm.createBy" placeholder="创建者"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :lg="12" :md="22">
          <el-form-item label="创建日期" prop="createTime">
            <el-input v-model="dataForm.createTime" placeholder="创建日期"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="22">
          <el-form-item label="更新时间" prop="updateTime">
            <el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
<!--      <el-form-item label="权限:" prop="roles">-->
<!--        <el-select v-model="dataForm.permissions" multiple placeholder="请选择" style="width: 100%">-->
<!--          <el-option-->
<!--            v-for="permission in dataForm.allPermissions"-->
<!--            :key="permission.permissionId"-->
<!--            :label="permission.name"-->
<!--            :value="permission.permissionId">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import request from '@/utils/request'

  export default {
    data() {
      return {
        visible: false,
        dataForm: {
          roleId: 0,
          name: '',
          level: '',
          description: '',
          dataScope: '',
          createBy: '',
          updateBy: '',
          createTime: '',
          updateTime: '',
          permissions:[],
          allPermissions:[]
        },
        dataRule: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ],

          description: [
            {required: true, message: '描述不能为空', trigger: 'blur'}
          ],

        }
      }
    },
    methods: {
      init(id) {
        this.dataForm.roleId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.roleId) {
            request({
              url: `/securityuaa/role/info/${this.dataForm.roleId}`,
              method: 'get',
            }).then(resposne => {
              console.log(resposne)
              this.dataForm=resposne.role
            })
          }
        })
      },
      dataFormSubmit() {
        console.log(this.dataForm);
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            request({
              url: `/securityuaa/role/${!this.dataForm.roleId ? 'save' : 'update'}`,
              method: 'post',
              data: this.dataForm
            }).then(() => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
              })
              this.visible = false
              this.$emit('refreshDataList')
            })
          }
        })
      }
    }
  }
</script>
