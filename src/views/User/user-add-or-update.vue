<template>
  <el-dialog
    :title="!dataForm.userId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-row :gutter="20">
        <el-col :lg="12" :md="22">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="dataForm.username"
              placeholder="用户名"
              :disabled="dataForm.userId === 1"
            ></el-input>
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
            <el-radio-group
              v-model="dataForm.gender"
              fill="red"
              text-color="#aaaaaa"
            >
              <el-radio :label="0">女性</el-radio>
              <el-radio :label="1">男性</el-radio>
              <el-radio :label="2">人妖</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="22">
          <el-form-item label="手机号码" prop="phone">
            <el-input
              v-model="dataForm.phone"
              placeholder="手机号码"
            ></el-input>
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
          <el-form-item label="头像" prop="avatar">
            <el-input v-model="dataForm.avatar" placeholder="头像"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="状态:" prop="enabled">
        <el-switch
          v-model="dataForm.enabled"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
          :disabled="dataForm.userId === 1"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="角色:" prop="roles">
        <el-select
          v-model="selectedOptions"
          multiple
          placeholder="请选择"
          style="width: 100%"
          :disabled="dataForm.userId === 1"
        >
          <!--   (item,key,i)       -->
          <el-option
            v-for="(name, key) in dataForm.allRoles"
            :key="key"
            :label="name"
            :value="key"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import {
  isUniqueUsername,
  isUniqueEmail,
  isUniquePhone,
} from "@/utils/validate";

export default {
  data() {
    var checkRoles = (rule, value, callback) => {
      //判断object为空
      if (Object.keys(value).length === 0) {
        callback(new Error("必须选择一个角色"));
      } else {
        callback();
      }
    };
    //===========================检查 username email phone 唯一性==================
    const checkUniqueUsername = (rule, value, callback) => {
      if (value === "" || value === null) {
        callback(new Error("用户名不能为空"));
      } else {
        isUniqueUsername(this.dataForm.userId, this.dataForm.username).then(
          (res) => {
            if (!res) {
              callback(new Error("用户名已存在"));
            } else {
              callback();
            }
          }
        );
      }
    };

    //判断是否和数据库中email唯一值冲突 有await 必须在方法上 标注async
    const checkEmailUnique = async (rule, value, callback) => {
      console.log(value === "" || value === null);
      if (value === "" || value === null) {
        callback(new Error("email不能为空"));
      } else {
        const unique = await isUniqueEmail(
          this.dataForm.userId,
          this.dataForm.email
        );
        if (!unique) {
          callback(new Error("email已存在"));
        }
        callback();
      }
      callback();
    };

    const checkPhoneUnique = async (rule, value, callback) => {
      //!null, !undefined !"" !"0" 都为true
      if (!value) {
        callback(new Error("phone不能为空"));
      } else {
        const unique = await isUniquePhone(
          this.dataForm.userId,
          this.dataForm.phone
        );
        if (!unique) {
          callback(new Error("phone已存在"));
        }
        callback();
      }
    };

    //todo 验证select 不为null
    return {
      visible: false,
      dataForm: {
        userId: 0, //新增id默认为0
        deptId: "",
        username: "",
        nickName: "",
        gender: "",
        phone: "",
        roles: {},
        email: "",
        avatar: "",
        password: "",
        isAdmin: "",
        enabled: 1,
        createBy: "",
        updateBy: "",
        allRoles: {},
        pwdResetTime: "",
        createTime: "",
      },
      dataRule: {
        username: [{ validator: checkUniqueUsername, trigger: "blur" }],
        nickName: [
          { required: true, message: "昵称不能为空", trigger: "blur" },
        ],
        gender: [{ required: true, message: "性别不能为空", trigger: "blur" }],
        phone: [{ validator: checkPhoneUnique, trigger: "blur" }],
        email: [{ validator: checkEmailUnique, trigger: "blur" }],
        avatar: [
          { required: true, message: "头像真实路径不能为空", trigger: "blur" },
        ],
        isAdmin: [
          {
            required: true,
            message: "是否为admin账号不能为空",
            trigger: "blur",
          },
        ],
        roles: [{ validator: checkRoles, trigger: "change" }],
      },
    };
  },
  computed: {
    selectedOptions: {
      get() {
        return Object.keys(this.dataForm.roles);
      },
      //js object 直接点取值和赋值就行
      set(ids) {
        this.dataForm.roles = {};
        ids.forEach((id) => {
          this.dataForm.roles[id] = this.dataForm.allRoles[id] || {};
          // console.log(this.dataForm.roles);
        });
      },
    },
  },
  mounted() {
    this.submit = this.$debounce(this.dataFormSubmit, 500);
  },
  methods: {
    init(id) {
      //0 为添加  后台只返回全部角色 或者直接前台返回全部角色 authuser自带allRoles
      //这里还是选择再查一次 万一有人在这期间修改了角色菜单
      this.dataForm.userId = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        request({
          url: `/user/info/${this.dataForm.userId}`,
          method: "get",
        }).then((response) => {
          console.log(response);
          this.dataForm = response.userVo;
          //如果是增加用户 userId为0 设置默认选中的用户
          if (!this.dataForm.userId) {
            this.dataForm.roles = { 2: "普通用户" };
          }
        });
      });
    },
    // 表单提交
    dataFormSubmit() {
      console.log("submit");
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          request({
            url: `/user/${!this.dataForm.userId ? "save" : "update"}`,
            method: "post",
            data: this.dataForm,
          }).then(() => {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1000,
            });
            this.visible = false;
            this.$emit("refreshDataList");
          });
        }
      });
    },
  },
};
</script>

<style>
/* 选中后的字体颜色   覆盖element ui 颜色不能加scope*/
.el-radio__input.is-checked + .el-radio__label {
  color: #28d4c1 !important;
}
/* 选中后小圆点的颜色 */
.el-radio__input.is-checked .el-radio__inner {
  background: #28d4c1 !important;
  border-color: #28d4c1 !important;
}
</style>
