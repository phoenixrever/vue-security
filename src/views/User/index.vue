<template>
  <div class="app-container">
    <el-form :inline="true" :model="dataForm" @keywordup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.keyword" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <permission-tool-tip-slot marginLeft="15px" marginRight="15px" :disabled="$hasPermission('user:add')">
          <el-button :disabled="!$hasPermission('user:add')" type="success" @click="addOrUpdateHandle()">新增</el-button>
        </permission-tool-tip-slot>
        <permission-tool-tip-slot :disabled="!(dataListSelections.length <= 0 || !$hasPermission('user:delete'))">
          <el-button @click="deleteHandle()"
                     :disabled="dataListSelections.length <= 0 || !$hasPermission('user:delete')">批量删除
          </el-button>
        </permission-tool-tip-slot>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
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
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="nickName"
        header-align="center"
        align="center"
        width="100"
        label="昵称">
      </el-table-column>
      <el-table-column
        prop="gender"
        header-align="center"
        align="center"
        width="50"
        label="性别">
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="手机号码">
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        width="200"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="avatarPath"
        header-align="center"
        align="center"
        width="100"
        label="头像">
      </el-table-column>
      <el-table-column
        prop="roles"
        header-align="center"
        align="center"
        label="角色">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper" v-if="scope.row.roles.length<=3">
            <el-tag size="medium" v-for="role in scope.row.roles">{{ role }}</el-tag>
          </div>
          <el-popover v-else trigger="hover" placement="top">
            <el-tag size="medium" v-for="role in scope.row.roles">{{ role }}</el-tag>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">权限列表</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="80"
        label="状态">
        <template slot-scope="scope">
          <el-switch
            v-if="scope.row.username==='admin'"
            slot="reference"
            v-model="scope.row.enabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled>
          </el-switch>
          <el-switch
            v-else
            slot="reference"
            class="statusSwitch"
            v-model="scope.row.enabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled
            @click.native="changeStatus(scope.row.enabled,scope.row.username,scope.row.userId)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建日期">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <permission-tool-tip-slot marginRight="15px" :disabled="$hasPermission('user:edit')">
            <el-button :disabled="!$hasPermission('user:edit')" type="primary" size="mini" icon="el-icon-edit"
                       @click="addOrUpdateHandle(scope.row.userId)"></el-button>
          </permission-tool-tip-slot>
          <permission-tool-tip-slot :disabled="$hasPermission('user:delete')">
            <el-button :disabled="!$hasPermission('user:delete')" type="danger" size="mini" icon="el-icon-delete"
                       @click="deleteHandle(scope.row.userId)"></el-button>
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
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
<!--    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>-->
    <add-or-update v-show="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './user-add-or-update'
import request from "@/utils/request";
import PermissionToolTipSlot from '@/components/PermissionToolTipSlot'

export default {
  data() {
    return {
      dataForm: {
        keyword: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate,
    PermissionToolTipSlot
  },
  activated() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      request({
        url: '/securityuaa/user/list',
        method: 'get',
        params: ({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'keyword': this.dataForm.keyword
        })
      }).then(response => {
        console.log(response);
        if (response && response.code === 0) {
          this.dataList = response.page.list
          this.totalPage = response.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      console.log(id)
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/securityuaa/user/delete',
          method: 'post',
          data: {userIds:this.userIds}  //data` 是作为请求主体被发送的数据 json requestBody
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    changeStatus(enabled, username, userId) {
      if (this.$hasPermission('user:edit')) {
        this.$confirm(`确定${enabled ? '禁止' : '激活'}[${username}?]`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let i = 0; i < this.dataList.length; i++) {
            if (this.dataList[i].userId === userId) {
                request({
                  url: `/securityuaa/user/${userId}/${!this.dataList[i].enabled}`,
                  method: 'post',
                }).then(() => {
                  this.dataList[i].enabled = !this.dataList[i].enabled
                })
            }
          }
        }).catch(() => {
          this.$message.error('取消操作')
        })
      } else {
        this.$alert('你无此权限', '提示', {
          confirmButtonText: '确定',
          type: 'error',
        });
      }
    }
  }
}
</script>

<style>
/*此处不能加scoped 不然修改不成功  加个类限制下就不污染全局样式了*/
.statusSwitch.el-switch.is-disabled .el-switch__core, .statusSwitch.el-switch.is-disabled .el-switch__label {
  cursor: pointer;
}
</style>
