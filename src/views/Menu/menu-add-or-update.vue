<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="菜单标题" prop="title">
            <el-input v-model="dataForm.title" placeholder="菜单标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组件名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="组件名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="基础组件" prop="component">
            <el-input v-model="dataForm.component" placeholder="基础组件"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="需要权限" prop="permission">
            <el-input v-model="dataForm.permission" placeholder="需要权限"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="排序" prop="menuSort">
            <el-input-number v-model.number="dataForm.menuSort" controls-position="right" :min="0"
                             :max="1000"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="隐藏" prop="hidden">
            <el-switch
              v-model="dataForm.hidden"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="dataForm.icon" placeholder="图标"></el-input>
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
  import {getInfo} from '@/api/user'
  import routerFormat from '@/utils/routerFormater'

  export default {
    data() {
      return {
        visible: false,
        title: '',
        dataForm: {
          menuId: 0,
          pid: '',
          subCount: '',
          type: '',
          title: '',
          name: '',
          component: null,//数据库会存储空字符串
          menuSort: '',
          icon: '',
          path: '',
          iFrame: '',
          cache: '',
          hidden: '',
          permission: '',
          createBy: '',
          updateBy: '',
          createTime: '',
          updateTime: ''
        },
        dataRule: {
          title: [
            {required: true, message: '菜单标题不能为空', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '组件名称不能为空', trigger: 'blur'}
          ],
          component: [
            // { required: true, message: '组件不能为空', trigger: 'blur' }
          ],
          menuSort: [
            {required: true, message: '排序不能为空', trigger: 'blur'}
          ],
          icon: [
            {required: true, message: '图标不能为空', trigger: 'blur'}
          ],
          hidden: [
            {required: true, message: '隐藏不能为空', trigger: 'blur'}
          ],
          permission: [
            // { required: true, message: '权限不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      init(id, node) {
        console.log("id", id)
        if (node) {
          this.title = '添加' + node.label + '的字菜单'
          this.dataForm.pid = node.key
        }
        this.dataForm.menuId = id
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          //0 表示非叶子节点 即还有子菜单 属于新增子菜单
          if (this.dataForm.menuId) {
            request({
              url: `/securityuaa/menu/info/${this.dataForm.menuId}`,
              method: 'get',
            }).then(response => {
              console.log(response)
              this.dataForm = response.data
              this.title = '修改'+this.dataForm.title
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log(this.dataForm)
            request({
              url: `/securityuaa/menu/${!this.dataForm.menuId ? 'save' : 'update'}`,
              method: 'post',
              data: this.dataForm
            }).then(() => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1100,
              })
              this.visible = false
              this.refreshRouter()
              this.$emit('refreshDataList')
            })
          }
        })
      },
      refreshRouter() {
        getInfo().then(response => {
          this.$store.commit('user/SET_ROUTERS', routerFormat(response.data.routers))
        })
      }
    }
  }
</script>
