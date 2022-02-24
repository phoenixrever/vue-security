<template>
  <div class="app-container">
    <!-- 当一个form元素中只有一个输入框时，在该输入框中按下回车应提交该表单。所以整个页面就刷新了 -->
    <!-- 解决1 多加几个input 2 @submit.native.prevent   -->
    <el-form :inline="true" :model="dataForm" @submit.native.prevent>
      <el-form-item>
        <el-input
          v-model="dataForm.keyword"
          placeholder="参数名"
          clearable
          @keyup.enter.native="getDataList()"
          @clear="getDataList"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <permission-tool-tip-slot
          marginLeft="15px"
          marginRight="15px"
          :disabled="$hasPermission('user:add')"
        >
          <el-button
            :disabled="!$hasPermission('user:add')"
            type="success"
            @click="addOrUpdateHandle()"
            >新增</el-button
          >
        </permission-tool-tip-slot>
        <permission-tool-tip-slot
          :disabled="
            !(dataListSelections.length <= 0 || !$hasPermission('user:delete'))
          "
        >
          <el-button
            @click="deleteHandle()"
            :disabled="
              dataListSelections.length <= 0 || !$hasPermission('user:delete')
            "
            >批量删除
          </el-button>
        </permission-tool-tip-slot>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        header-align="center"
        :selectable="selectable"
        align="center"
        width="50"
      >
      </el-table-column>
      <el-table-column
        type="index"
        width="50"
        header-align="center"
        align="center"
        label="序号"
      >
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        width="100"
        label="用户名"
      >
      </el-table-column>
      <el-table-column
        prop="nickName"
        header-align="center"
        align="center"
        width="100"
        label="昵称"
      >
      </el-table-column>
      <el-table-column
        prop="gender"
        header-align="center"
        align="center"
        width="50"
        label="性别"
      >
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="手机号码"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        width="200"
        label="邮箱"
      >
      </el-table-column>
      <!--<el-table-column
        prop="avatar"
        header-align="center"
        align="center"
        width="100"
        label="头像"
      >
      </el-table-column>
      -->
      <el-table-column
        prop="avatar"
        header-align="center"
        align="center"
        width="100"
        label="头像"
      >
        <template slot-scope="scope">
          <el-avatar :size="30" :src="scope.row.avatar" @error="return true;">
            <img
              src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            />
          </el-avatar>
        </template>
      </el-table-column>

      <el-table-column
        prop="roles"
        header-align="center"
        align="center"
        label="角色"
      >
        <template slot-scope="scope">
          <div
            slot="reference"
            class="name-wrapper"
            v-if="Object.keys(scope.row.roles).length <= 1"
          >
            <!--roles 是 map 类型 -->
            <el-tag size="medium">{{
              Object.values(scope.row.roles)[0]
            }}</el-tag>
          </div>
          <el-popover v-else trigger="hover" placement="top">
            <el-tag
              size="medium"
              v-for="(key, value) in scope.row.roles"
              :key="key"
              >{{ value }}</el-tag
            >
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">权限列表</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="dataScope"
        header-align="center"
        align="center"
        label="详细信息"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <div style="max-width: 400px">
              <p>
                <el-tag size="medium" class="detail">创建者</el-tag>
                {{ scope.row.createdBy }}
              </p>
              <p>
                <el-tag size="medium" class="detail">创建时间</el-tag>
                {{ scope.row.createdTime }}
              </p>
              <p>
                <el-tag size="medium" class="detail">更新者</el-tag>
                {{ scope.row.updatedBy }}
              </p>
              <p>
                <el-tag size="medium" class="detail">更新时间</el-tag>
                {{ scope.row.updatedTime }}
              </p>
            </div>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">详细信息</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="80"
        label="状态"
      >
        <template slot-scope="scope">
          <el-switch
            v-if="scope.row.userId === 1"
            slot="reference"
            v-model="scope.row.enabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            disabled
          >
          </el-switch>
          <el-switch
            v-else
            slot="reference"
            v-model="scope.row.enabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            :disabled="!$hasPermission('user:edit')"
            @click.native="
              $hasPermission('user:edit') &&
                changeStatus(
                  scope.row.enabled,
                  scope.row.username,
                  scope.row.userId
                )
            "
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <permission-tool-tip-slot
            marginRight="15px"
            :disabled="$hasPermission('user:edit')"
          >
            <el-button
              :disabled="!$hasPermission('user:edit')"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="addOrUpdateHandle(scope.row.userId)"
            ></el-button>
          </permission-tool-tip-slot>
          <permission-tool-tip-slot
            :disabled="
              !(!$hasPermission('user:delete') || scope.row.userId === 1)
            "
          >
            <el-button
              :disabled="
                !$hasPermission('user:delete') || scope.row.userId === 1
              "
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteHandle(scope.row.userId)"
            ></el-button>
          </permission-tool-tip-slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <!--    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>-->
    <add-or-update
      v-show="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./user-add-or-update";
import request from "@/utils/request";
import PermissionToolTipSlot from "@/components/PermissionToolTipSlot";

export default {
  data() {
    return {
      dataForm: {
        keyword: "",
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
    };
  },
  components: {
    AddOrUpdate,
    PermissionToolTipSlot,
  },
  activated() {
    this.getDataList();
  },
  methods: {
    selectable(row, index) {
      return row.userId !== 1;
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      request({
        url: "/user/list",
        method: "get",
        params: {
          page: this.pageIndex,
          limit: this.pageSize,
          keyword: this.dataForm.keyword,
        },
      }).then((response) => {
        // console.log(response);
        if (response && response.code === 0) {
          this.dataList = response.page.list;
          this.totalPage = response.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      // console.log(id);
      var ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.userId;
          });
      this.$confirm(
        `确定对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        request({
          url: "/user/delete",
          method: "post",
          data: ids, //data` 是作为请求主体被发送的数据 json requestBody
        }).then(() => {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1000,
            onClose: () => {
              this.getDataList();
            },
          });
        });
      });
    },
    changeStatus(enabled, username, userId) {
      this.$confirm(`确定${enabled ? "禁止" : "激活"}[${username}?]`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //遍历注主要找到这个user 刷新界面 根据dataList
          for (let i = 0; i < this.dataList.length; i++) {
            if (this.dataList[i].userId === userId) {
              let status = this.dataList[i].enabled === 1 ? 0 : 1;
              request({
                url: `/user/${userId}/${status}`,
                method: "post",
              }).then(() => {
                this.dataList[i].enabled = status;
              });
            }
          }
        })
        .catch(() => {
          this.$message.error("取消操作");
        });
    },
  },
};
</script>

<style>
/*此处不能加scoped 不然修改不成功  加个类限制下就不污染全局样式了*/
/*.statusSwitch.el-switch.is-disabled .el-switch__core,
.statusSwitch.el-switch.is-disabled .el-switch__label {
  cursor: pointer;
}*/

.detail {
  width: 80px;
}
</style>
