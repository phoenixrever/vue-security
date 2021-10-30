<template>
  <el-row type="flex" justify="center" class="row-top">
    <el-col  :lg="7" :xl="6" >
      <div class="grid-content" style="text-align: center">
        <h2>vue admin</h2>
        <el-image style="margin: 25px 0" :src="require('@/assets/logo.png')"/>
        <h3>spring security</h3>
      </div>
    </el-col>
    <el-col :span="1">
      <el-divider direction="vertical"></el-divider>
    </el-col>
    <el-col :lg="7" :xl="6" >
      <div class="grid-content">
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="demo-loginForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username" class="inputWidth"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginForm.password" class="inputWidth" autocomplete="off"></el-input>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="16">
              <div class="grid-content">
                <el-form-item label="验证码" prop="code">
                  <el-input v-model="loginForm.code"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                  <el-image
                    style="width: 100px"
                    src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.it610.com%2Fimage%2Finfo8%2Fa520a420dd70482d9abd3ff8db21aa7c.jpg&refer=http%3A%2F%2Fimg.it610.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638175398&t=d7672d7c932a5f0a958749fe5d110e8a"
                  ></el-image>
              </div>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')">立即创建</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import {isvalidUsername, isvalidPassword} from "../utils/validate"

  export default {
    name: "Login",
    data() {
      // var validUsername = (rule, value, callback) => {
      //   if (value === "") {
      //     callback(new Error("请输入用户名"));
      //   } else if (!isvalidUsername(value)) {
      //     callback(
      //       new Error(
      //         "用户名要求数字、字母、下划线的组合 数字和字母必须存在 长度为4-15个字符"
      //       )
      //     );
      //   }
      // };

      var validatePassword = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (!isvalidPassword(value)) {
          callback(
            new Error("密码以字母开头 长度在8~18之间 只能包含字母、数字和下划线")
          );
        }
      };

      return {
        loginForm: {
          username: '',
          password: '',
          code: ''
        },
        rules: {
          username: [
            // { required: true, validator: validUsername, trigger: "blur" }
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, validator: validatePassword, trigger: "blur"}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
          ],
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>
  .el-divider {
    height: 200px;
    width: 2px;
  }

  .el-form-item {
    margin-bottom: 40px;
  }

  .row-top {
    background-color: #f5f5f5;
    height: 100vh;
    align-items: center;
  }

  .inputWidth {
    width: 280px;
  }

</style>
