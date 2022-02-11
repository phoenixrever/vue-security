<template>
  <el-row type="flex" justify="center" class="row-top">
    <el-col :lg="7" :xl="6" :md="6">
      <div class="grid-content" style="text-align: center">
        <h2>vue admin</h2>
        <el-image style="margin: 25px 0" :src="require('@/assets/logo.png')" />
        <h3>spring security</h3>
      </div>
    </el-col>
    <el-col :span="1">
      <el-divider direction="vertical"></el-divider>
    </el-col>
    <el-col :lg="7" :xl="6" :md="6">
      <div class="grid-content">
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginForm"
          label-width="100px"
          class="loginForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              prefix-icon="el-icon-user"
              v-model="loginForm.username"
              class="inputWidth"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              prefix-icon="el-icon-lock"
              type="password"
              v-model="loginForm.password"
              class="inputWidth"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-row :gutter="20" type="flex" justify="space-between">
            <el-col :span="18">
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
                  class="captchaImage"
                  :src="captchaImage"
                  @click="refreshCaptcha"
                ></el-image>
              </div>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')"
              >立即创建</el-button
            >
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { isValidPassword, isValidCode } from "@/utils/validate";
import { mapGetters, mapMutations, mapState } from "vuex";
import request from "@/utils/request";

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

    var validCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (!isValidCode(value)) {
        callback(new Error("验证码不正确"));
      }
      callback();
    };

    var validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!isValidPassword(value)) {
        callback(
          new Error("以字母开头，长度在8~18之间，只能包含字母、数字和下划线")
        );
      }
      callback();
    };

    return {
      loginForm: {
        username: "admin",
        password: "a123456",
        code: "1234",
      },
      captchaKey: "",
      captchaImage: "",
      rules: {
        username: [
          // { required: true, validator: validUsername, trigger: "blur" }
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, validator: validatePassword, trigger: "blur" },
        ],
        code: [
          // {required: true, validator: validCode, trigger: 'blur'},
          { required: true, message: "请输入验证码", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCaptcha();
    // localStorage.setItem("token","456")
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          request({
            url: "/login",
            method: "post",
            //param 是url 参数 json 要写data
            data: {
              username: this.loginForm.username,
              password: this.loginForm.password,
              code: this.loginForm.code,
              captchaKey: this.captchaKey,
            },
          }).then(
            ({ data }) => {
              console.log(data);
              const token = data.token;
              this.SET_TOKEN(token);
              this.$router.push("/index");
            },
            (error) => {
              // this.$message.error("登录失败 请重新登陆" + error);
              this.loginForm.code = "";
              this.getCaptcha();
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getCaptcha() {
      request({
        url: "/captcha",
        method: "get",
      }).then(({ data }) => {
        this.captchaImage = data.captchaImage;
        this.captchaKey = data.captchaKey;
      });
    },
    ...mapMutations("user", ["SET_TOKEN"]), //vm里面(this)注册setToken方法
    refreshCaptcha() {
      this.getCaptcha();
    },
  },
};
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
  min-width: 280px;
}

.captchaImage {
  margin-top: 2px;
}
</style>
