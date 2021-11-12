<template>
  <el-form :model="form" ref="form" label-width="100px">
    <el-row :gutter="0">
      <el-col>
        <el-form-item
          label="name"
          :rules="[
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ]"
        >
          <el-input v-model.lazy="form.name"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col>
        <el-form-item prop="icon" label="icon">
          <el-input v-model.lazy="form.icon"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="0">
      <el-col>
        <el-form-item prop="productUnit" label="单位">
          <el-input v-model.lazy="form.productUnit"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col>
        <el-form-item
          label="排序"
          :rules="[{ required: true, message: '请输入sort', trigger: 'blur' }]"
        >
          <el-input-number
            :min="0"
            v-model.lazy="form.sort"
            controls-position="right"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row> </el-row>
    <el-form-item>
      <el-button type="primary" @click="submitForm('form')">{{
        showType
        }}</el-button>
      <!-- <el-button @click="resetForm('form')">取消</el-button> -->
      <el-button @click="$emit('closeDialog')">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    name:'addform',
    props: {
      dialogData: Object,
      dialogType: String,
    },
    data() {
      return {
        form: {
          // catId: '',
          // name: '', //不加这个属性会输不进去数字 可能跟vue的watch的监听有关 一开始要有name
          // parentCid: '',
          // icon: 'tree',
          // sort: 0,
          // productUnit: '个',
          // showStatus: 1,
        },
      }
    },
    watch: {
      'dialogData.catId'() {
        this.init()
      },
      showType() {
        this.init()
      },
    },
    //不用直接用props属性
    computed: {
      showType: {
        set: function () {},
        get: function () {
          return this.dialogType
        },
      },
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.form = this.dialogData
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.showType === 'add') {
              this.$http({
                url: this.$http.adornUrl('/product/category/save'),
                method: 'post',
                data: this.form,
              }).then(({ data }) => {
                // console.log(data)
                this.$emit('refresh')
              })
            } else {
              this.$http({
                url: this.$http.adornUrl('/product/category/update'),
                method: 'put',
                data: this.form,
              }).then(({ data }) => {
                console.log(data)
                this.$emit('refresh', this.dialogData.expendedKey)
              })
            }
          } else {
            console.log('error submit!!')
            this.$emit('refresh', this.dialogData.expendedKey)
            return false
          }
        })
      },
      // resetForm(formName) {
      //   this.$refs[formName].resetFields()
      // },
      clearForm() {
        this.$emit('refresh')
      },
    },
  }
</script>
<style>
  .demo-dynamic .el-input {
    margin-right: 10px;
    max-width: 450px;
    vertical-align: top;
  }
</style>
