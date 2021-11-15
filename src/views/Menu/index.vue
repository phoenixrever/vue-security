<template>
  <div class="app-container">
    <el-alert
      title="注意"
      type="warning"
      description="此功能辅助开发使用,不知道自己要干什么的不要瞎点,一不小心菜单就没了"
      show-icon
      style="margin-bottom:30px"
    >
    </el-alert>
    <div class="block">
      <div class="action">
        <el-button type="primary" size="mini" @click="addOrUpdateHandle(0)"
        >新增总分类
        </el-button
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
        >批量保存
        </el-button
        >
        <el-button
          v-show="batchDeleteSwitch"
          type="danger"
          size="mini"
          @click="deleteHandle"
        >批量删除
        </el-button
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
        @check="handleCheck"
        @node-drop="handleDrop"
        @node-expand="addExpendedKey"
        @node-collapse="removeExpendedKey"
        ref="menuTree"
      >
        <!-- 使用 scoped slot 会传入两个参数node和data，分别表示当前节点的 Node 对象和当前节点的数据 -->
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <!-- addOrUpdateHandle 要写参数 不然传下去的是鼠标事件 -->
            <el-button
              v-if="!node.isLeaf"
              type="text"
              size="small"
              @click="addOrUpdateHandle(0,node)"
            >
              <i class="el-icon-plus"></i>
            </el-button>
            <el-button type="text" size="small" @click="addOrUpdateHandle(data.menuId)">
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
        >
      </el-tree
      >
    </div>
    <add-or-update v-show="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<
<script>
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
        totalLevels: 0,
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
        batchDeleteSwitch: false,
        parent: {},
        subject: {},
        title: "",
        expendedKey: [],
      };
    },
    created() {
      // this.getDataList();
    },
    activated() {
      this.getDataList()
    },
    methods: {
      handleCheck() {
        this.batchDeleteSwitch = this.$refs.menuTree.getCheckedNodes().length > 1
      },
      /**
       *  新增 / 修改
       * @param id  修改的话就传一个id
       * @param node 新增的话 传一个node 得到title 与pid
       */
      addOrUpdateHandle(id, node) {
        //id 为0 表示新增
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, node)
        })
      },

      // 获取数据列表
      getDataList() {
        request({
          url: "/securityuaa/menu/tree",
          method: "get",
        }).then(({data}) => {
          this.data = data;
        });
      },

      addExpendedKey(data, node, vueComponent) {
        if (this.expendedKey.indexOf(node.key) === -1) {
          this.expendedKey.push(node.key)
          console.log(this.expendedKey)
        }
      },

      removeExpendedKey(data, node, vueComponent) {
        this.deleteChildExpendedKey(node)
        // console.log(this.expendedKey)
      },

      deleteChildExpendedKey(node) {
        let index = this.expendedKey.indexOf(node.key);
        if (index !== -1) {
          this.expendedKey.splice(index, 1)
          //递归判断有子节点 有的话 删除
          if (node.childNodes && node.childNodes.length > 0) {
            node.childNodes.forEach(n => this.deleteChildExpendedKey(n))
          }
        }
      },

      //===================批量删除================================
      remove(node, data) {
        console.log(node, data);
        if (data.menuId) {
          if (node.childNodes.length > 0) {
            this.$message({
              type: "info",
              message: "有子目录无法删除"
            });
          }
          this.deleteHandle(data);
          this.expendedKey.push(node.parent.key);
        } else {
          let nodes = this.$refs.menuTree.getCheckedNodes
          for (node in nodes) {
            if (node.childNodes.length > 0) {
              this.$message({
                type: "info",
                message: "有子目录无法删除"
              });
              return
            }
            this.expendedKey.push(node.parent.key)
          }
          this.deleteHandle();
        }
      },

      // 删除
      deleteHandle(node) {
        // var ids = data.menuId ? [data.menuId ] : this.$.map(item => {
        //   return item.menuId
        // })\
        console.log(node.menuId)
        let ids = []
        let titles = []
        if (node.menuId) {
          titles.push(node.label);
          ids.push(node.menuId)
        } else {
          ids = this.$refs.menuTree.getCheckedNodes().map(n => {
            console.log(n)
            titles.push(n.label)
            return n.menuId
          })
        }
        this.$confirm(`确定对[title=${titles.join(',')}]进行[${node.menuId ? '删除' : '批量删除'}]操作?`, '提示', {
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
                data: JSON.stringify(ids) // 这里是数组不是json 后端@responseBody 接收的话需要  JSON.stringify(ids)
              }).then(response => {
                console.log(response)
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1000,
                })
                this.getDataList()
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
        }).catch(error => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      },

      //===========================树形节点拖动====================================
      //判断允许拖动
      // allowDrop(draggingNode, dropNode, type) {
      //   //目标(正在被拖曳的节点总层数+(目标节点当前层数=当前深度)) <总层数3
      //   //正在被拖曳的节点总层数totalLevel=正在被拖曳的节点的总深度level-正在被拖曳的节点的当前深度+1
      //   //分清  总层数和深度
      //   // console.log(draggingNode, dropNode, type);
      //   this.maxDeep = 0;
      //   let draggingLevel =
      //     this.countNodeDeep(draggingNode) - draggingNode.level + 1;
      //   if (type === "inner") {
      //     //正在被拖曳的节点总层数+(目标当前层数=当前深度)
      //     console.log(draggingLevel + "------------" + dropNode.level);
      //     return draggingLevel + dropNode.level <= 3;
      //   } else {
      //     // console.log(dropNode.parent.data.catLevel);
      //     return draggingLevel + dropNode.parent.level <= 3;
      //   }
      // },
      // countNodeDeep(node) {
      //   if (node.childNodes && node.childNodes.length !== 0) {
      //     for (let n of node.childNodes) {
      //       if (n.level > this.maxDeep) {
      //         this.maxDeep = n.level;
      //       }
      //       this.countNodeDeep(n);
      //     }
      //   } else {
      //     //没有子节点或最后一个结点最大深度都是当前level
      //     if (node.level > this.maxDeep) {
      //       this.maxDeep = node.level;
      //     }
      //   }
      //   return this.maxDeep;
      // },

      //当前正在拖动进行时...
      allowDrop(draggingNode, dropNode, type) {
        // console.log("tree drop: ", draggingNode, dropNode, type);
        //系统菜单单独拖动策略
        //判断当前拖动节点和drop节点的的根节点 是否是系统菜单
        // console.log(draggingNode.level + "------------" + dropNode.level);
        let ids1=[]
        let ids2=[]
        this.findParentMenuId(draggingNode,ids1)
        this.findParentMenuId(dropNode,ids2)
        if(ids1[0]===1 && ids1[0]===1){
          // 是系统管理菜单 1级根菜单可以同级拖动  2级及以后的level只能在同一根节点下拖动  不允许跨级
          console.log(draggingNode.level + "------------" + dropNode.level);
          if(draggingNode.level===1 && dropNode.level===1) return  true
          if(draggingNode.level>1 && draggingNode.level === dropNode.level) return true
        }else if(this.findParentMenuId(draggingNode)!==1 && this.findParentMenuId(dropNode)!==1){

        }
        return false;
      },

      //找出当前节点的根节点ID
      findParentMenuId(node,ids) {
        if (node.level > 1 && node.parent !== null) {
          this.findParentMenuId(node.parent,ids)
        }
        if(node.level===1){
          // console.log(node)
          ids.push(node.id)
        }
      },
      //===========================拖动成功后节点level数据处理====================================
      handleDrop(draggingNode, dropNode, dropType) {
        // console.log("tree drop: ", draggingNode, dropNode, dropType);
        // //1 拖曳过后节点的父节点id
        // let pid = 0;
        // let siblings = 0;
        // if (dropType === "inner") {
        //   pid = dropNode.data.menuId;
        //   siblings = dropNode.childNodes;
        // } else {
        //   pid = dropNode.data.pid;
        //   siblings = dropNode.parent.childNodes;
        // }
        // this.pid = pid;
        // //2 拖曳过后节点的最新顺序
        // for (let [i, n] of siblings.entries()) {
        //   //遍历到被拖曳的节点
        //   if (n.data.menuId === draggingNode.data.menuId) {
        //     //如果被拖曳的节点的level值不等于拖曳后改变的兄弟们节点的level值
        //     //拖曳过后node dropNode  level 自动改变
        //     //需要改变draggingNode catlevel及其子节点level(递归)
        //     if (n.level !== draggingNode.level) {
        //       //递归修改节点及其子节点层级
        //       this.updateChildNodeLevel(n);
        //     }
        //     this.updateNodes.push({
        //       menuId: n.data.menuId,
        //       sort: i,
        //       pid: pid
        //     });
        //   } else {
        //     this.updateNodes.push({
        //       menuId: n.data.menuId,
        //       sort: i
        //     });
        //   }
        // }
        // console.log(this.updateNodes);
      },
      //递归修改子节点的level
      updateChildNodeLevel(node) {
        if (node.childNodes && node.childNodes.length > 0) {
          for (let n of node.childNodes) {
            this.updateNodes.push({menuId: n.data.menuId, catLevel: n.level});
            this.updateChildNodeLevel(n);
          }
        } else {
          this.updateNodes.push({menuId: node.data.menuId, catLevel: node.level});
        }
      },
      draggRequest() {
        if (this.updateNodes.length <= 0) {
          return;
        }
        // this.$http({
        //   url: this.$http.adornUrl(`/product/category/updateCategories`),
        //   method: "put",
        //   data: this.updateNodes
        // }).then(({ data }) => {
        //   if (data && data.code === 0) {
        //     console.log(data);
        //     this.getDataList();
        //     this.expendedKey = [this.pid];
        //     //==每次拖动后都要复位==
        //     this.maxDeep = 0;
        //     this.updateNodes = [];
        //     // this.pid = 0; //只记录最后一个操作的节点
        //     //=====================
        //     this.$message({
        //       message: "操作成功",
        //       type: "success"
        //     });
        //   } else {
        //     this.$message.error(data.msg);
        //   }
        // });
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
