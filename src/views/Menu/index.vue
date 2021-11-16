<template>
  <div class="app-container">
    <template v-if="$hasRoleIds(1)">
      <el-alert
        title="注意"
        type="warning"
        description="此功能辅助开发使用,不知道自己要干什么的不要瞎点,一不小心菜单就没了"
        show-icon
        style="margin-bottom:30px"
      >
      </el-alert>
    </template>

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
          @click="dragSave"
        >保存拖动
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
        <span class="custom-tree-node" slot-scope="{ node, data }"  v-if="$hasRoleIds(1)">
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
        updateDataList: [],
        //=================
        draggable: false,
        addOrUpdateVisible: false,
        data: [],
        defaultProps: {
          children: "children",
          label: "label"
        },
        batchDeleteSwitch: false,
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
          //in 遍历下标key of 遍历值
          for (let node of nodes) {
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
      //当前正在拖动进行时...
      //拖拽时判定目标节点能否被放置。type
      // 参数有三种情况：'prev'、'inner' 和 'next'，
      // 分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
      allowDrop(draggingNode, dropNode, type) {
        // console.log("tree drop: ", draggingNode, dropNode, type);
        //系统菜单单独拖动策略
        //判断当前拖动节点和drop节点的的根节点 是否是系统菜单
        // console.log(draggingNode,dropNode);
        // console.log(this.data);
        let ids1 = []
        let ids2 = []
        this.findParentMenuId(draggingNode, ids1)
        this.findParentMenuId(dropNode, ids2)
        // console.log(draggingNode)
        // 1 系统菜单根节点MenuId
        if (ids1[0] === 1 && ids1[0] === 1) {
          // 是系统管理菜单 1级根菜单可以同级拖动  2级及以后的level只能在同一根节点下拖动(level相同)  不允许跨级
          //说白了就是只能同level排序
          if ((draggingNode.level === dropNode.level) && (draggingNode.parent.id === dropNode.parent.id) && type !== 'inner') return true
        } else if (ids1[0] !== 1 && ids2[0] !== 1) {
          return true
        }
        if (!this.message) {
          this.message = this.$message({
            message: '系统菜单只能在同级拖动 而且不能合并',
            type: 'warning',
            onClose: () => this.message = null
          })
        }
        return false;
      },

      //找出当前节点的根节点ID
      //todo 这递归怎么写着感觉这么搓 有时间来改进下
      findParentMenuId(node, ids) {
        if (node.level > 1 && node.parent !== null) {
          this.findParentMenuId(node.parent, ids)
        }
        if (node.level === 1) {
          // console.log(node)
          ids.push(node.id)
        }
      },


      //===========================拖动成功后节点数据处理====================================
      handleDrop(draggingNode, dropNode, dropType) {
        // console.log("tree drop: ", draggingNode, dropNode, dropType);
        let siblings = []
        if (dropType === "inner") {
          siblings = dropNode.childNodes;

        } else {
          siblings = dropNode.parent.childNodes;
        }
        //2 拖曳过后被拖曳节点所在位置节点的最新顺序  i 作为menuSort
        for (let [i, n] of siblings.entries()) {
          let menu = {}
          menu.menuId = n.data.menuId;
          //不管拖动到哪里 pid 都重新计算
          menu.pid = n.parent.data.menuId
          menu.menuSort = i
          //过滤数据 防止无限拖曳 相同menuId的操作记录最后一步
          if (this.updateDataList.length === 0) {
            this.updateDataList.push(menu)
          } else {
            let flag = true;
            for (let j = 0; j < this.updateDataList.length; j++) {
              if (this.updateDataList[j].menuId === menu.menuId) {
                this.updateDataList[j] = menu
                flag = false
              }
            }
            if (flag) {
              this.updateDataList.push(menu)
            }
          }
        }
        // console.log(this.updateDataList);
      },
      //递归修改子节点的level

      dragSave() {
        if (this.updateDataList.length > 0) {
          console.log("更新tree")
          request({
            url: `/securityuaa/menu/updateDrag`,
            method: "post",
            data: this.updateDataList
          }).then(() => {
            //暂时不需要刷新tree 拖动好的就是原来的样子
            this.updateDataList=[]
            this.$message.success({
              message: "保存拖动成功"
            });
          })
        }
      }
      //====================================================================
    }
  };
</script>
<style >
  .block {
    padding-left: 50px;
  }

  .action {
    margin-bottom: 10px;
  }

  .switch {
    margin: 0 10px;
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
