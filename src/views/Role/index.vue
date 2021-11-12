<template>
  <div class="app-container">
    <div class="block">
      <div class="action">
        <el-button type="primary" size="mini" @click="addRoot"
        >新增总分类</el-button
        >
        <el-switch
          class="switch"
          v-model="draggable"
          :active-text="draggable ? '开启拖动' : '关闭'"
          inactive-text=""
        >
        </el-switch>
        <el-button
          v-if="draggable"
          type="success"
          size="mini"
          @click="draggRequest"
        >批量保存</el-button
        >
        <el-button
          v-if="batchDeleteSwitch"
          type="danger"
          size="mini"
          @click="batchDelete"
        >批量删除</el-button
        >
      </div>
      <el-tree
        :data="data"
        node-key="catId"
        @check="checkBox"
        :props="defaultProps"
        show-checkbox
        :default-expanded-keys="expendedKey"
        :expand-on-click-node="false"
        :draggable="draggable"
        :allow-drop="allowDrop"
        @node-drop="handleDrop"
        ref="categoryTree"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              v-if="node.level <= 2"
              type="text"
              size="small"
              @click="() => add(node, data)"
            >
              <i class="el-icon-plus"></i>
            </el-button>
            <el-button type="text" size="small" @click="() => edit(node, data)">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button
              v-if="node.childNodes.length === 0 && !batchDeleteSwitch"
              type="text"
              size="small"
              @click="() => remove(node, data)"
            >
              <i class="el-icon-delete"></i>
            </el-button>
          </span>
        </span>
        ></el-tree
      >
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <addform
        @refresh="refresh"
        :dialogType="dialogType"
        :dialogData="dialogData"
        @closeDialog="dialogVisible = false"
      ></addform>
    </el-dialog>
  </div>
</template>
<<script>
  import request from '@utils/request'
  import addform from "./addform.vue";
  export default {
    components: {
      addform
    },
    data() {
      return {
        //==每次拖动后都要复位==
        pCid: 0,
        maxDeep: 0,
        updateNodes: [],
        //=================
        draggable: false,
        dialogVisible: false,
        data: [],
        dialogType: "",
        dialogData: {
          catId: "",
          name: "", //不加这个属性会输不进去数字 可能跟vue的watch的监听有关 一开始要有name
          parentCid: "",
          icon: "tree",
          sort: 0,
          productUnit: "个",
          showStatus: 1
        },
        defaultProps: {
          children: "children",
          label: "name"
        },
        parent: {},
        subject: {},
        title: "",
        expendedKey: [],
        batchDeleteSwitch: false
      };
    },
    created() {
      this.getDataList();
    },
    methods: {
      refresh(key) {
        this.dialogVisible = false;
        this.getDataList();
        //设置默认展开 id就行就是key=cayId
        this.expendedKey = this.dialogData.expendedKey;
      },
      // 获取数据列表
      getDataList() {
        request({
          url:"/securityuaa/menu/tree",
          method: "get",
        }).then(({ data }) => {
          // this.dataList = treeDataTranslate(data.list, 'catId', 'parentCid')
          this.data = data.list;
        });
      },
      edit(node, data) {
        //其他人修改后我们能看到实时信息
        this.$http({
          url: this.$http.adornUrl(`/product/category/info/${data.catId}`),
          method: "get",
          params: this.$http.adornParams()
        }).then(({ data }) => {
          console.log(data.category);
          this.title = `修改${node.level}级分类`;
          let { catId, name, icon, productUnit, sort } = data.category;
          this.dialogData = { catId, name, icon, productUnit, sort };
          this.dialogType = "edit";
          this.dialogVisible = true;
          this.dialogData.expendedKey = [node.key];
        });
      },
      addRoot() {
        this.title = "增加一级分类";
        this.dialogData = {
          catId: "",
          name: "", //不加这个属性会输不进去数字 可能跟vue的watch的监听有关 一开始要有name
          parentCid: 0,
          icon: "tree",
          sort: 0,
          catLevel: 1,
          productUnit: "个",
          showStatus: 1
        };
        this.dialogType = "add";
        this.dialogVisible = true;
      },
      add(node, data) {
        this.title = `增加${node.level + 1}级分类`;
        //add前要把所有属性设置成默认
        this.dialogData = {
          catId: data.catId, //为了出发子组件watch监听事件改变data的值
          name: "", //不加这个属性会输不进去数字 可能跟vue的watch的监听有关 一开始要有name
          parentCid: data.catId,
          icon: "tree",
          sort: 0,
          catLevel: node.level + 1,
          productUnit: "个",
          showStatus: 1
        };
        this.dialogType = "add";
        this.dialogVisible = true;
        this.dialogData.expendedKey = [node.key];
      },
      deleteCategory(node, data) {
        this.$confirm(`是否删除【${data.name}】`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "执行中...";
              this.$http({
                url: this.$http.adornUrl(`/product/category/delete`),
                method: "post",
                data: [data.catId]
              })
                .then(({ data }) => {
                  if (data && data.code === 0) {
                    this.getDataList();
                    this.expendedKey = [node.parent.key];
                    this.$message({
                      message: "操作成功",
                      type: "success",
                      duration: 1500
                    });
                  } else {
                    this.$message.error(data.msg);
                  }
                  instance.confirmButtonLoading = false;
                  done();
                })
                .catch(error => {
                  instance.confirmButtonLoading = false;
                  console.log(error);
                  done();
                });
            } else {
              done();
            }
          }
        }).catch(error => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      },
      remove(node, data) {
        console.log(node,data);
        if (node.childNodes.length > 0) {
          this.$message({
            type: "info",
            message: "有子目录无法删除"
          });
        } else {
          this.deleteCategory(node, data);
        }
      },
      //===================批量删除================================
      checkBox(node, checked) {
        console.log(checked.checkedKeys);
        if (checked.checkedKeys.length > 0) {
          this.batchDeleteSwitch = true;
        } else {
          this.batchDeleteSwitch = false;
        }
        console.log(this.batchDeleteSwitch);
      },
      batchDelete() {
        let nodeToDeleteList = this.$refs.categoryTree.getCheckedNodes();
        let deleteNoteNames = [];
        let deleteNoteCatIds = [];
        for (const node of nodeToDeleteList) {
          deleteNoteNames.push(node.name);
          deleteNoteCatIds.push(node.catId);
        }
        this.$confirm(`是否确定删除${deleteNoteNames}`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            console.log(deleteNoteCatIds);
            this.$http({
              url: this.$http.adornUrl(`/product/category/delete`),
              method: "post",
              data: deleteNoteCatIds
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.getDataList();
                this.expendedKey = [
                  nodeToDeleteList[nodeToDeleteList.length - 1].parentCid
                ];
                this.$message({
                  message: "批量删除成功",
                  type: "success"
                });
              } else {
                this.$message.error(data.msg);
              }
            });
          })
          .catch(error => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      //===========================树形节点拖动====================================
      //允许拖动
      allowDrop(draggingNode, dropNode, type) {
        //目标(正在被拖曳的节点总层数+(目标节点当前层数=当前深度)) <总层数3
        //正在被拖曳的节点总层数totalLevel=正在被拖曳的节点的总深度catLevel-正在被拖曳的节点的当前深度+1
        //分清  总层数和深度
        // console.log(draggingNode, dropNode, type);
        this.maxDeep = 0;
        let draggingLevel =
          this.countNodeDeep(draggingNode) - draggingNode.level + 1;
        if (type === "inner") {
          //正在被拖曳的节点总层数+(目标当前层数=当前深度)
          console.log(draggingLevel + "------------" + dropNode.level);
          return draggingLevel + dropNode.level <= 3;
        } else {
          // console.log(dropNode.parent.data.catLevel);
          return draggingLevel + dropNode.parent.level <= 3;
        }
      },
      countNodeDeep(node) {
        if (node.childNodes && node.childNodes.length !== 0) {
          for (let n of node.childNodes) {
            if (n.level > this.maxDeep) {
              this.maxDeep = n.level;
            }
            this.countNodeDeep(n);
          }
        } else {
          //没有子节点或最后一个结点最大深度都是当前level
          if (node.level > this.maxDeep) {
            this.maxDeep = node.level;
          }
        }
        return this.maxDeep;
      },
      //===========================拖动成功后节点level数据处理====================================
      handleDrop(draggingNode, dropNode, dropType, ev) {
        console.log("tree drop: ", draggingNode, dropNode, dropType);
        //1 拖曳过后节点的父节点id
        let pCid = 0;
        let siblings = 0;
        if (dropType === "inner") {
          pCid = dropNode.data.catId;
          siblings = dropNode.childNodes;
        } else {
          pCid = dropNode.data.parentCid;
          siblings = dropNode.parent.childNodes;
        }
        this.pCid = pCid;
        //2 拖曳过后节点的最新顺序
        for (let [i, n] of siblings.entries()) {
          //遍历到被拖曳的节点
          if (n.data.catId === draggingNode.data.catId) {
            //如果被拖曳的节点的level值不等于拖曳后改变的兄弟们节点的level值
            //拖曳过后node dropNode  level 自动改变
            //需要改变draggingNode catlevel及其子节点level(递归)
            if (n.level !== draggingNode.level) {
              //递归修改节点及其子节点层级
              this.updateChildNodeLevel(n);
            }
            this.updateNodes.push({
              catId: n.data.catId,
              sort: i,
              parentCid: pCid
            });
          } else {
            this.updateNodes.push({
              catId: n.data.catId,
              sort: i
            });
          }
        }
        console.log(this.updateNodes);
      },
      //递归修改子节点的level
      updateChildNodeLevel(node) {
        if (node.childNodes && node.childNodes.length > 0) {
          for (let n of node.childNodes) {
            this.updateNodes.push({ catId: n.data.catId, catLevel: n.level });
            this.updateChildNodeLevel(n);
          }
        } else {
          this.updateNodes.push({ catId: node.data.catId, catLevel: node.level });
        }
      },
      draggRequest() {
        if (this.updateNodes.length <= 0) {
          return;
        }
        this.$http({
          url: this.$http.adornUrl(`/product/category/updateCategories`),
          method: "put",
          data: this.updateNodes
        }).then(({ data }) => {
          if (data && data.code === 0) {
            console.log(data);
            this.getDataList();
            this.expendedKey = [this.pCid];
            //==每次拖动后都要复位==
            this.maxDeep = 0;
            this.updateNodes = [];
            // this.pCid = 0; //只记录最后一个操作的节点
            //=====================
            this.$message({
              message: "操作成功",
              type: "success"
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      }
      //====================================================================
    }
  };
</script>
<style scoed>
  .block {
    padding-left: 50px;
  }
  .action {
    margin-bottom: 10px;
  }
  .switch {
    margin: 0 10px;
  }
  .switch-text {
    margin-left: 10px;
  }
  .custom-tree-node {
    display: flex;
    align-items: center;
    justify-content: left;
    font-size: 18px;
    /* border: 1px solid red; */
    padding-right: 8px;
  }
  .custom-tree-node .el-icon-delete {
    color: red;
    font-size: 15px;
  }
  .custom-tree-node button {
    margin-left: 20px;
    padding: 15px 0;
  }
  .el-icon-plus {
    color: green;
    font-size: 15px;
  }
  .el-icon-edit {
    font-size: 15px;
  }
  .el-tree-node {
    padding: 5px 0;
    /* 不能用margin 会导致tree 拖曳上下节点直接的蓝线乱走 */
  }
</style>
