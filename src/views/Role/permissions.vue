<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span
        ><el-tag type="danger">{{ role.name }}</el-tag> 的权限列表</span
      >
      <el-button
        style="float: right; padding: 6px 0"
        type="text"
        :loading="loading"
        @click="save()"
        :disabled="role.roleId === 1"
        >保存</el-button
      >
    </div>
    <el-tree
      :data="data.menuTreeVos"
      node-key="menuId"
      :props="defaultProps"
      show-checkbox
      :default-checked-keys="data.checkedIds"
      :default-expanded-keys="expandedKeys"
      ref="menuTree"
    ></el-tree>
  </el-card>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "permissions",
  props: ["role"],
  data() {
    return {
      data: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      loading: false,
      expandedKeys: [],
    };
  },
  mounted() {
    this.save = this.$debounce(this.savePermissions, 500);
  },
  methods: {
    // 获取数据列表
    init(roleId) {
      this.$nextTick(() => {
        // this.data = []
        request({
          url: `/role/tree/${roleId}`,
          method: "get",
        }).then((resposne) => {
          console.log(resposne);
          this.data = resposne.role;
          // const ids = this.data.checkedIds;
          // this.$refs.menuTree.setCheckedKeys(ids)
          this.getExpandedKeys();
        });
      });
    },

    getExpandedKeys() {
      this.expandedKeys = [];
      this.data.menuTreeVos.forEach((m) => {
        this.findChildren(m);
      });
      // console.log(this.expandedKeys);
    },
    findChildren(m) {
      if (m && m.children && m.children.length > 0) {
        m.children.forEach((child) => {
          if (this.data.checkedIds.indexOf(child.menuId) > -1) {
            if (this.expandedKeys.indexOf(m.menuId) === -1) {
              this.expandedKeys.push(m.menuId);
            }
          }
          this.findChildren(child);
        });
      }
    },

    savePermissions() {
      this.loading = true;
      console.log(this.$refs.menuTree.getCheckedKeys());
      let rolesMenusEntities = this.$refs.menuTree
        .getCheckedKeys()
        .map((item) => {
          let rolesMenusEntity = {};
          rolesMenusEntity.roleId = this.role.roleId;
          rolesMenusEntity.menuId = item;
          return rolesMenusEntity;
        });
      console.log(rolesMenusEntities);
      request({
        url: `/role/savePermissions`,
        method: "post",
        data: rolesMenusEntities,
      }).then((resposne) => {
        // console.log(resposne);
        this.loading = false;
        //todo 修改某个用户权限后要强制下线 重新获取权限列表
        this.$notify({
          title: "成功",
          message: "保存用户权限成功",
          type: "success",
        });
      });
    },
  },
};
</script>

<style scoped></style>
