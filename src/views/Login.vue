<template>
  <div class="login">
    <!-- <sakura id="sakura" /> -->
    <video-background id="vbg"/>
    <div class="login-box">
      <h2>Login</h2>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        class="loginForm"
      >
        <el-form-item  prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
            class="inputWidth"
          ></el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            type="password"
            v-model="loginForm.password"
            class="inputWidth"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item  prop="code">
          <el-col :span="13">
            <el-input v-model="loginForm.code"></el-input>
          </el-col>
          <!-- 解决空元素不占布局 -->
          <el-col :span="1" style="border: 1px solid transparent"></el-col>
          <el-col :span="10">
            <el-image
              class="captchaImage"
              :src="captchaImage"
              @click="refreshCaptcha"
            >
              <div slot="error" class="image-slot">加载中..</div>
            </el-image>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')"
          >登陆
          </el-button
          >
          <!--<el-button @click="resetForm('loginForm')">注册</el-button> -->
        </el-form-item>
        <el-form-item >
          <!-- 组件的所有@ 事件都会被当成自定义事件  原生事件要加native -->
          <social @click.native="socialLogin"/>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {isValidPassword, isValidCode} from "@/utils/validate";
import {mapGetters, mapMutations, mapState} from "vuex";
import request from "@/utils/request";
// import Sakura from "@/components/Sakura";
import VideoBackground from "@/components/VideoBackground";
import Social from "@/components/SocialLogin";

export default {
  name: "Login",
  components: {
    // Sakura,
    VideoBackground,
    Social,
  },
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
        username: "test",
        password: "123456",
        code: "",
        captchaKey: "",
      },
      captchaImage: "",
      rules: {
        username: [
          // { required: true, validator: validUsername, trigger: "blur" }
          {required: true, message: "请输入用户名", trigger: "blur"},
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          // { required: true, validator: validatePassword, trigger: "blur" },
          {required: true, message: "请输入密码", trigger: "blur"},
        ],
        code: [
          {required: true, validator: validCode, trigger: "blur"},
          // { required: true, message: "请输入验证码", trigger: "blur" },
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
            //params 是url 参数 json 要写data 和  method: "post" 没有关系
            data: {
              username: this.loginForm.username,
              password: this.loginForm.password,
              code: this.loginForm.code,
              captchaKey: this.loginForm.captchaKey,
            },
          }).then(
            (response) => {
              // console.log(response);
              const token = response.token;
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
          // console.log("error submit!!");
          return false;
        }
      });
    },
    socialLogin() {
      // console.log("socialLogin");
      request({
        url: "/oauth2/login",
        method: "get",
      }).then(
        (response) => {
          // console.log(response);
          const url = response.url;
          window.location.href = url;
          // this.$router.push(url);
        },
        (error) => {
          this.$message.error("社交登录失败 请重新登陆" + error);
        }
      );
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getCaptcha() {
      request({
        url: "/captcha",
        method: "get",
      }).then((response) => {
        // console.log(response);
        this.captchaImage = response.captchaImage;
        this.loginForm.captchaKey = response.captchaKey;
      });
    },
    ...mapMutations("user", ["SET_TOKEN"]), //vm里面(this)注册setToken方法
    refreshCaptcha() {
      this.getCaptcha();
    },
  },
};
</script>

<style>
.el-divider {
  height: 200px;
  width: 2px;
}

.el-form-item {
  margin-bottom: 40px;
}

.login-box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  align-items: center;
  padding: 25px;
  width: 400px;
  height: 510px;
  /*display: flex;*/
  /*justify-content: center;*/
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  box-shadow: 0 5px 35px rgba(0, 0, 0, 0.2);
}
.login-box::after {
  content: "";
  position: absolute;
  left: 5px;
  top: 5px;
  right: 5px;
  bottom: 5px;
  border-radius: 5px;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.1) 15%,
    transparent 50%,
    transparent 85%,
    rgba(255, 255, 255, 0.3) 100%
  );
}
.login-box h2 {
  margin: 0;
  font-size: 30px;
  font-weight: bold;
  color:#ffffff;
  text-align: center;
}

.loginForm {
  padding: 30px;
}

.row-top {
  /*background-color: #f5f5f5;*/
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100%;
  align-items: center;
}

/*.inputWidth {
  min-width: 280px;
}*/
.login .image-slot {
  margin-left: 50px;
}

/*center .image-slot*/

#vbg {
  object-fit: cover;
}

.login {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  color: #ffb7c5;
}

.login .el-form-item__label {
  color: #ffb7c5;
}

.login .el-input__inner {
  height: 47px;
  background-color: rgba(255, 255, 255, 0.247);
}

.login .el-input input {
  color: #fff !important;
  border-color: rgba(255, 255, 255, 0.247);
}

.login .el-input input:focus {
  border-color: rgba(255, 255, 255, 0.57);
}

.login .el-button--primary {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.247);
  border-color: rgba(255, 255, 255, 0.247);
}

.login .el-button--primary:hover {
  color: #fff;
  background-color: rgba(255, 0, 52, 0.247);
  border-color: rgba(255, 255, 255, 0.247);
}

.login img {
  border-radius: 5px;
}
</style>
