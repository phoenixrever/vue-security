<template>
  <el-dialog
             :title="!dataForm.userId ? '新增' : '修改'"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-row :gutter="20">
        <el-col :lg="12" :md="22">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="dataForm.username" placeholder="用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="22">
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="dataForm.nickName" placeholder="昵称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :lg="12" :md="22">
          <el-form-item label="性别" prop="gender">
            <el-input v-model="dataForm.gender" placeholder="性别"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="22">
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="dataForm.phone" placeholder="手机号码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :lg="12" :md="22">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="22">
          <el-form-item label="头像" prop="avatarPath">
            <el-input v-model="dataForm.avatarPath" placeholder="头像"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="状态:" prop="enabled">
        <template slot-scope="scope">
        <el-switch
          v-if="dataForm.userId===1"
          slot="reference"
          v-model="dataForm.enabled"
          active-color="#13ce66"
          inactive-color="#ff4949"
          disabled>
        </el-switch>
        <el-switch
          v-else
          slot="reference"
          v-model="dataForm.enabled"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
        </template>
      </el-form-item>
      <el-form-item label="角色:">
        <el-select v-model="dataForm.roles" multiple placeholder="请选择" style="width: 100%">
          <el-option
            v-for="role in dataForm.allRoles"
            :key="role"
            :label="role"
            :value="role">
          </el-option>
        </el-select>
      </el-form-item>
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
        userId: 0,
        deptId: '',
        username: '',
        nickName: '',
        gender: '',
        phone: '',
        email: '',
        avatarName: '',
        avatarPath: '',
        password: '',
        isAdmin: '',
        enabled: '',
        createBy: '',
        updateBy: '',
        pwdResetTime: '',
        createTime: '',
      },
      dataRule: {
        username: [
          {required: true, message: '用户名不能为空', trigger: 'blur'}
        ],
        nickName: [
          {required: true, message: '昵称不能为空', trigger: 'blur'}
        ],
        gender: [
          {required: true, message: '性别不能为空', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '手机号码不能为空', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '邮箱不能为空', trigger: 'blur'}
        ],
        avatarPath: [
          {required: true, message: '头像真实路径不能为空', trigger: 'blur'}
        ],
        isAdmin: [
          {required: true, message: '是否为admin账号不能为空', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.userId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
          request({
            url: `/securityuaa/user/info/${this.dataForm.userId}`,
            method: 'get',
          }).then(response => {
            console.log(response);
            this.dataForm = response.user
          })
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
         request({
            url: `/securityuaa/user/${!this.dataForm.userId ? 'save' : 'update'}`,
            method: 'post',
            data: this.dataForm
          }).then(() => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
          })
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
