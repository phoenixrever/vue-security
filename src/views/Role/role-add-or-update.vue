<template>
  <el-dialog
    :title="!dataForm.roleId ? '新增' : '修改'"
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
          <el-form-item label="名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="22">
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="dataForm.description"
              placeholder="描述"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--v-show是不支持template语法 -->
      <template v-if="dataForm.roleId">
        <el-row :gutter="20">
          <el-col :lg="12" :md="22">
            <el-form-item label="创建者" prop="createdBy">
              <el-input
                v-model="dataForm.createdBy"
                placeholder="创建者"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="22">
            <el-form-item label="创建时间" prop="createdTime">
              <el-input v-model="dataForm.createdTime" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :lg="12" :md="22">
            <el-form-item label="修改者" prop="updatedBy">
              <el-input v-model="dataForm.createdBy" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="22">
            <el-form-item label="修改时间" prop="updatedTime">
              <el-input v-model="dataForm.updatedTime" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import { isUniqueRoleName } from "@/utils/validate";
export default {
  data() {
    //===========================检查 username email phone 唯一性==================
    const checkUniqueRoleName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("角色名不能为空"));
      } else {
        isUniqueRoleName(this.dataForm.roleId, this.dataForm.name).then(
          (res) => {
            if (!res) {
              callback(new Error("角色已存在"));
            } else {
              callback();
            }
          }
        );
      }
    };

    return {
      visible: false,
      dataForm: {
        roleId: 0,
        name: "",
        description: "",
        createBy: "",
        updateBy: "",
        createdTime: "",
        updatedTime: "",
      },
      dataRule: {
        name: [
          { required: true, validator: checkUniqueRoleName, trigger: "blur" },
        ],

        description: [
          { required: true, message: "描述不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    init(id) {
      this.dataForm.roleId = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.roleId) {
          request({
            url: `/role/info/${this.dataForm.roleId}`,
            method: "get",
          }).then((resposne) => {
            // console.log(resposne);
            this.dataForm = resposne.role;
          });
        }
      });
    },
    dataFormSubmit() {
      // console.log(this.dataForm);
      //todo 如果是新增要要跳转到page最后一页 选中新增项
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          request({
            url: `/role/${!this.dataForm.roleId ? "save" : "update"}`,
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
