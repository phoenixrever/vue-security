<template>
  <div class="app-container">
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
          :disabled="$hasPermission('role:add')"
        >
          <el-button
            :disabled="!$hasPermission('role:add')"
            type="success"
            @click="addOrUpdateHandle()"
            >新增</el-button
          >
        </permission-tool-tip-slot>
        <permission-tool-tip-slot
          :disabled="
            !(dataListSelections.length <= 0 || !$hasPermission('role:delete'))
          "
        >
          <el-button
            @click="deleteHandle()"
            :disabled="
              dataListSelections.length <= 0 || !$hasPermission('role:delete')
            "
            >批量删除
          </el-button>
        </permission-tool-tip-slot>
      </el-form-item>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="18">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text"
              >操作按钮</el-button
            >
          </div>
          <!--  @row-click="rowClick" 和高亮highlight-current-row冲突-->

          <el-table
            ref="roleTable"
            :data="dataList"
            highlight-current-row
            tooltip-effect="dark"
            @current-change="handleCurrentChange"
            :row-class-name="rowClassName"
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
              header-align="center"
              align="center"
              label="Index"
              width="60"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              header-align="center"
              align="center"
              label="名称"
            >
            </el-table-column>
            <!--show-overflow-tooltip="true" 多余的内容会在 hover 时以 tooltip 的形式显示出来 -->
            <el-table-column
              prop="description"
              header-align="center"
              :show-overflow-tooltip="true"
              align="center"
              label="描述"
            >
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
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作"
            >
              <template slot-scope="scope">
                <permission-tool-tip-slot
                  marginRight="15px"
                  :disabled="$hasPermission('role:edit')"
                >
                  <el-button
                    :disabled="!$hasPermission('role:edit')"
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    @click="addOrUpdateHandle(scope.row.roleId)"
                  ></el-button>
                </permission-tool-tip-slot>
                <permission-tool-tip-slot
                  :disabled="
                    !(!$hasPermission('role:delete') || scope.row.roleId === 1)
                  "
                >
                  <el-button
                    :disabled="
                      !$hasPermission('role:delete') || scope.row.roleId === 1
                    "
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    @click="deleteHandle(scope.row.roleId)"
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
          <add-or-update
            v-if="addOrUpdateVisible"
            ref="addOrUpdate"
            @refreshDataList="getDataList"
          ></add-or-update>
        </el-card>
      </el-col>
      <el-col :span="6">
        <permission
          @getPermissionTree:="getPermissionTree(userId)"
          :role="role"
          ref="permissionTree"
        ></permission>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import request from "@/utils/request";
import AddOrUpdate from "./role-add-or-update";
import PermissionToolTipSlot from "@/components/PermissionToolTipSlot";
import Permission from "./permissions";

export default {
  components: {
    AddOrUpdate,
    PermissionToolTipSlot,
    Permission,
  },
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
      role: {},
    };
  },
  activated() {
    this.getDataList();
  },
  methods: {
    selectable(row, index) {
      if (row.roleId === 1) {
        return false;
      }
      return true;
    },
    //
    getPermissionTree(id) {
      this.$nextTick(() => {
        this.$refs.permissionTree.init(id);
      });
    },
    //行的 className 的回调方法
    rowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },

    handleCurrentChange(currentRow, oldCurrentRow) {
      //切换画面的时候也会运行 这个时候currentRow就等于null了
      if (currentRow) {
        this.role.name = currentRow.name;
        this.role.roleId = currentRow.roleId;
        this.getPermissionTree(currentRow.roleId);
      }
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      request({
        url: "/role/list",
        method: "get",
        params: {
          page: this.pageIndex,
          limit: this.pageSize,
          keyword: this.dataForm.keyword,
        },
      }).then((response) => {
        if (response.code === 0) {
          // console.log(response);
          this.dataList = response.page.list;
          this.totalPage = response.page.totalCount;
          this.$nextTick(() => {
            this.$refs.roleTable.setCurrentRow(response.page.list[0]);
          });
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
      console.log(val);
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(roleId) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(roleId);
      });
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.roleId;
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
          url: "/role/delete",
          method: "post",
          data: ids, //data` 是作为请求主体被发送的数据 json requestBody
        }).then(() => {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1000,
          });
          this.getDataList();
        });
      });
    },
  },
};
</script>
<style>
.permission-tag {
  margin: 5px;
}

.current-row > td {
  background: #e4cdac !important;
}
</style>
