<template>
  <div class="app-container">
    <div class="block">
      <div class="action">
        <el-button type="primary" size="mini" @click="addOrUpdateHandle"
        >新增总分类</el-button
        >
        <el-switch
          class="switch"
          v-model="draggable"
          active-text="开启拖动"
          inactive-text="关闭拖动"
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
          @click="remove"
        >批量删除</el-button
        >
      </div>
      <!-- node-key，其值为节点数据中的一个字段名，该字段在整棵树中是唯一的 -->
      <el-tree
        :data="data"
        node-key="menuId"
        :props="defaultProps"
        show-checkbox
        :default-expanded-keys="expendedKey"
        :expand-on-click-node="false"
        :draggable="draggable"
        :allow-drop="allowDrop"
        @node-drop="handleDrop"
        ref="menuTree"
      >
        <!-- 使用 scoped slot 会传入两个参数node和data，分别表示当前节点的 Node 对象和当前节点的数据 -->
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
            <el-button type="text" size="small" @click="() => addOrUpdateHandle(data.menuId)">
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
    <add-or-update v-show="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<<script>
  import request from '@/utils/request'
  import AddOrUpdate from "./menu-add-or-update.vue";

  export default {
    components: {
      AddOrUpdate
    },
    data() {
      return {
        //==每次拖动后都要复位==
        pid: 0,
        maxDeep: 0,
        updateNodes: [],
        //=================
        draggable: false,
        addOrUpdateVisible: false,
        data: [],
        dialogType: "",
        dialogData: {},
        defaultProps: {
          children: "children",
          label: "label"
        },
        parent: {},
        subject: {},
        title: "",
        expendedKey: [],
        batchDeleteSwitch: false
      };
    },
    // created() {
    //   this.getDataList();
    // },
    activated () {
      this.getDataList()
    },
    methods: {
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // refresh(key) {
      //   this.addOrUpdateVisible = false;
      //   this.getDataList();
      //   //设置默认展开 id就行就是key=cayId
      //   this.expendedKey = this.dialogData.expendedKey;
      // },
      // 获取数据列表
      getDataList() {
        request({
          url:"/securityuaa/menu/tree",
          method: "get",
        }).then(({ data }) => {
          // this.dataList = treeDataTranslate(data.list, 'menuId', 'pid')
          console.log(data)
          this.data = data;
        });
      },
      // edit(node, data) {
      //   //其他人修改后我们能看到实时信息
      //   request({
      //     url: `/securityuaa/menu/info/${data.menuId}`,
      //     method: "get",
      //   }).then(({ data }) => {
      //     console.log("edit",data);
      //     this.title = `修改[${node.level}]级分类`;
      //     this.dialogData = data;
      //     this.dialogType = "edit";
      //     this.addOrUpdateVisible = true;
      //     this.dialogData.expendedKey = [node.key];
      //   });
      // },
      // addRoot() {
      //   this.title = "增加一级分类";
      //   this.dialogData = {
      //     menuId: "",
      //     name: "", //不加这个属性会输不进去数字 可能跟vue的watch的监听有关 一开始要有name
      //     pid: 0,
      //     icon: "tree",
      //     sort: 0,
      //     catLevel: 1,
      //     productUnit: "个",
      //     showStatus: 1
      //   };
      //   this.dialogType = "add";
      //   this.addOrUpdateVisible = true;
      // },
      // add(node, data) {
      //   this.title = `增加${node.level + 1}级分类`;
      //   //add前要把所有属性设置成默认
      //   this.dialogData = {
      //     menuId: data.menuId, //为了出发子组件watch监听事件改变data的值
      //     name: "", //不加这个属性会输不进去数字 可能跟vue的watch的监听有关 一开始要有name
      //     pid: data.menuId,
      //     icon: "tree",
      //     sort: 0,
      //     catLevel: node.level + 1,
      //     productUnit: "个",
      //     showStatus: 1
      //   };
      //   this.dialogType = "add";
      //   this.addOrUpdateVisible = true;
      //   this.dialogData.expendedKey = [node.key];
      // },
      // 删除
      deleteHandle (node, data) {
        // var ids = data.menuId ? [data.menuId ] : this.$.map(item => {
        //   return item.menuId
        // })\
        let ids=[]
        let titles=[]
       if(data.menuId){
         titles.push(data.title);
         ids=data.menuId
       }else{
         ids = this.$refs.menuTree.getCheckedNodes.map(node => {
           titles.push(node.label)
           return node.key
         })
       }
        this.$confirm(`确定对[title=${titles.join(',')}]进行[${data.menuId ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "执行中...";
              request({
                url: ('/securityuaa/menu/delete'),
                method: 'post',
                data: ids
              }).then(response => {
                console.log(response)
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1000,
                })
                this.getDataList()
                if(data.menuId){
                  this.nextText(()=>{
                    this.expendedKey = [node.parent.key];
                  })
                }
                instance.confirmButtonLoading = false;
                done();
              }).catch(error => {
                  instance.confirmButtonLoading = false;
                  console.log(error);
                  done();
                });
            } else {
              done();
            }
          }
        }).then(() => {
          request({
            url: ('/securityuaa/menu/delete'),
            method: 'post',
            data: ids
          }).then(response => {
            console.log(response)
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000,
            })
            this.getDataList()
          })
        }).catch(error => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      },

      // deleteCategory(node, data) {
      //   this.$confirm(`是否删除【${data.name}】`, "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning",
      //     beforeClose: (action, instance, done) => {
      //       if (action === "confirm") {
      //         instance.confirmButtonLoading = true;
      //         instance.confirmButtonText = "执行中...";
      //         this.$http({
      //           url: this.$http.adornUrl(`/product/category/delete`),
      //           method: "post",
      //           data: [data.menuId]
      //         })
      //           .then(({ data }) => {
      //             if (data && data.code === 0) {
      //               this.getDataList();
      //               this.expendedKey = [node.parent.key];
      //               this.$message({
      //                 message: "操作成功",
      //                 type: "success",
      //                 duration: 1500
      //               });
      //             } else {
      //               this.$message.error(data.msg);
      //             }
      //             instance.confirmButtonLoading = false;
      //             done();
      //           })
      //           .catch(error => {
      //             instance.confirmButtonLoading = false;
      //             console.log(error);
      //             done();
      //           });
      //       } else {
      //         done();
      //       }
      //     }
      //   })
      // },
      remove(node, data) {
        console.log(node,data);
        if(data.menuId){
          if (node.childNodes.length > 0) {
            this.$message({
              type: "info",
              message: "有子目录无法删除"
            });
          }
        } else {
          let nodes = this.$refs.menuTree.getCheckedNodes
          for(node in nodes){
            if (node.childNodes.length > 0) {
              this.$message({
                type: "info",
                message: "有子目录无法删除"
              });
              return
            }
          }
          this.deleteHandle();
        }
      },
      //===================批量删除================================
      // checkBox(node, checked) {
      //   console.log(checked.checkedKeys);
      //   if (checked.checkedKeys.length > 0) {
      //     this.batchDeleteSwitch = true;
      //   } else {
      //     this.batchDeleteSwitch = false;
      //   }
      //   checked.
      //   return
      // },
      // batchDelete() {
      //   let nodeToDeleteList = this.$refs.menuTree.getCheckedNodes();
      //   let deleteNoteNames = [];
      //   let deleteNotemenuIds = [];
      //   for (const node of nodeToDeleteList) {
      //     deleteNoteNames.push(node.name);
      //     deleteNotemenuIds.push(node.menuId);
      //   }
      //   this.$confirm(`是否确定删除${deleteNoteNames}`, "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning"
      //   })
      //     .then(() => {
      //       console.log(deleteNotemenuIds);
      //       this.$http({
      //         url: this.$http.adornUrl(`/product/category/delete`),
      //         method: "post",
      //         data: deleteNotemenuIds
      //       }).then(({ data }) => {
      //         if (data && data.code === 0) {
      //           this.getDataList();
      //           this.expendedKey = [
      //             nodeToDeleteList[nodeToDeleteList.length - 1].pid
      //           ];
      //           this.$message({
      //             message: "批量删除成功",
      //             type: "success"
      //           });
      //         } else {
      //           this.$message.error(data.msg);
      //         }
      //       });
      //     })
      //     .catch(error => {
      //       this.$message({
      //         type: "info",
      //         message: "已取消删除"
      //       });
      //     });
      // },
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
        let pid = 0;
        let siblings = 0;
        if (dropType === "inner") {
          pid = dropNode.data.menuId;
          siblings = dropNode.childNodes;
        } else {
          pid = dropNode.data.pid;
          siblings = dropNode.parent.childNodes;
        }
        this.pid = pid;
        //2 拖曳过后节点的最新顺序
        for (let [i, n] of siblings.entries()) {
          //遍历到被拖曳的节点
          if (n.data.menuId === draggingNode.data.menuId) {
            //如果被拖曳的节点的level值不等于拖曳后改变的兄弟们节点的level值
            //拖曳过后node dropNode  level 自动改变
            //需要改变draggingNode catlevel及其子节点level(递归)
            if (n.level !== draggingNode.level) {
              //递归修改节点及其子节点层级
              this.updateChildNodeLevel(n);
            }
            this.updateNodes.push({
              menuId: n.data.menuId,
              sort: i,
              pid: pid
            });
          } else {
            this.updateNodes.push({
              menuId: n.data.menuId,
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
            this.updateNodes.push({ menuId: n.data.menuId, catLevel: n.level });
            this.updateChildNodeLevel(n);
          }
        } else {
          this.updateNodes.push({ menuId: node.data.menuId, catLevel: node.level });
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
            this.expendedKey = [this.pid];
            //==每次拖动后都要复位==
            this.maxDeep = 0;
            this.updateNodes = [];
            // this.pid = 0; //只记录最后一个操作的节点
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
