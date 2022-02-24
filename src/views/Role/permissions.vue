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
        :disabled="role.roleId === 1 || !$hasPermission('role:edit')"
        >保存</el-button
      >
    </div>
    <el-tree
      :data="data.menuTreeVos"
      node-key="menuId"
      :props="defaultProps"
      :check-strictly="true"
      show-checkbox
      :default-checked-keys="data.checkedIds"
      :default-expanded-keys="expandedKeys"
      @check="handleCheck"
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
          // console.log(resposne);
          this.data = resposne.role;
          // const ids = this.data.checkedIds;
          // this.$refs.menuTree.setCheckedKeys(ids)
          this.getExpandedKeys();
        });
      });
    },

    //================ element ui tree 默认的节点选中 并不适用=============================
    /**
     * 1 选中父级节点 子节点全部选中
     * 2 取消父级节点 子节点全部取消
     * 3 取消子节点 不影响父节点
     * 4 选中子节点 其所有父节点都要选中
     */

    // data 该节点所对应的对象   树目前的选中状态对象 包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys
    handleCheck(data, status) {
      // console.log(data);
      // console.log(status);

      //第一步 查看当前节点的选中状态
      //js 数组包含 indexOf
      let checked = status.checkedKeys.indexOf(data.menuId);
      // console.log(checked);

      //选中
      if (checked > -1) {
        this.checkChildren(data, true);
        let selectedNode = this.$refs.menuTree.getNode(data.menuId);
        this.checkParent(selectedNode);
      } else {
        //取消选中
        //第一个参数 节点的 key
        //第二个参数 节点是否选中
        //第三个参数 是否选中子节点 ，默认为 false (还是需要递归 这个参数也只能管一层 设置成false 递归吧)
        // this.$refs.menuTree.setChecked(child.menuId, false, true);
        this.checkChildren(data, false);
      }
    },
    //当前节点的所有子节点选中
    checkChildren(data, isChecked) {
      if (data.children && data.children.length > 0) {
        data.children.forEach((item) => {
          this.$refs.menuTree.setChecked(item.menuId, isChecked);
          this.checkChildren(item, isChecked);
        });
      }
    },

    //当前节点的所有父节点选中一直到当前节点根元素 pid===0
    checkParent(node) {
      if (node.parent !== null) {
        this.$refs.menuTree.setChecked(node.parent.data.menuId, true);
        this.checkParent(node.parent);
      }
    },
    //================ 自定义 element ui tree  =============================

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
      // console.log(this.$refs.menuTree.getCheckedKeys());
      let rolesMenusEntities = this.$refs.menuTree
        .getCheckedKeys()
        .map((item) => {
          let rolesMenusEntity = {};
          rolesMenusEntity.roleId = this.role.roleId;
          rolesMenusEntity.menuId = item;
          return rolesMenusEntity;
        });
      // console.log(rolesMenusEntities);
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
