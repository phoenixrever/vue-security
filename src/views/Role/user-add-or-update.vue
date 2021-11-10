<template>
  <el-dialog
    :title="!dataForm.userId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="dataForm.username" placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item label="昵称" prop="nickName">
      <el-input v-model="dataForm.nickName" placeholder="昵称"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="gender">
      <el-input v-model="dataForm.gender" placeholder="性别"></el-input>
    </el-form-item>
    <el-form-item label="手机号码" prop="phone">
      <el-input v-model="dataForm.phone" placeholder="手机号码"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
    </el-form-item>
    <el-form-item label="头像真实路径" prop="avatarPath">
      <el-input v-model="dataForm.avatarPath" placeholder="头像真实路径"></el-input>
    </el-form-item>
    <el-form-item label="是否为admin账号" prop="isAdmin">
      <el-input v-model="dataForm.isAdmin" placeholder="是否为admin账号"></el-input>
    </el-form-item>
    <el-form-item label="状态：1启用、0禁用" prop="enabled">
        <el-switch
          v-model="dataForm.enabled"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
    </el-form-item>
    <el-form-item label="创建日期" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建日期"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
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
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          nickName: [
            { required: true, message: '昵称不能为空', trigger: 'blur' }
          ],
          gender: [
            { required: true, message: '性别不能为空', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' }
          ],
          avatarPath: [
            { required: true, message: '头像真实路径不能为空', trigger: 'blur' }
          ],
          isAdmin: [
            { required: true, message: '是否为admin账号不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.userId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.userId) {
            this.$http({
              url: this.$http.adornUrl(`/securityuaa/user/info/${this.dataForm.userId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.username = data.user.username
                this.dataForm.nickName = data.user.nickName
                this.dataForm.gender = data.user.gender
                this.dataForm.phone = data.user.phone
                this.dataForm.email = data.user.email
                this.dataForm.avatarPath = data.user.avatarPath
                this.dataForm.isAdmin = data.user.isAdmin
                this.dataForm.enabled = data.user.enabled
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/securityuaa/user/${!this.dataForm.userId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.userId || undefined,
                'username': this.dataForm.username,
                'nickName': this.dataForm.nickName,
                'gender': this.dataForm.gender,
                'phone': this.dataForm.phone,
                'email': this.dataForm.email,
                'avatarPath': this.dataForm.avatarPath,
                'enabled': this.dataForm.enabled,
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
