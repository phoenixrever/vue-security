<template>
  <div class="app-container">
  <el-table
    v-loading="dataListLoading"
    :data="dataList"
    style="width: 100%">
    <el-table-column
      prop="ipAddress"
      label="ip地址"
      width="180">
    </el-table-column>
    <el-table-column
      prop="city"
      label="地区"
      width="180">
    </el-table-column>
    <el-table-column
      prop="postalCode"
      label="邮编">
    </el-table-column>
    <el-table-column
      prop="country"
      label="国家">
    </el-table-column>
    <el-table-column
      prop="requestUri"
      label="访问路径">
    </el-table-column>
    <el-table-column
      prop="visitedTime"
      label="访问时间">
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
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  data() {
    return {
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
    }
  },
  activated() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      request({
        url: "/ip/list",
        method: "get",
        params: {
          page: this.pageIndex,
          limit: this.pageSize,
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
  },
}
</script>
