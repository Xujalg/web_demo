<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <div class="search">
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-input
              placeholder="请输入内容"
              v-model="searchData"
              class="input-with-select"
            >
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input></div
        ></el-col>
        <el-col :span="18"
          ><div
            class="grid-content bg-purple"
            style="float:left ;margin-left:15px"
          >
            <el-button type="success" plain @click="addGoods">添加商品</el-button>
          </div></el-col
        >
      </el-row>
    </div>

    <!-- 表格 -->
    <el-table :data="goodsList" border style="width: 100% ">
      <el-table-column type="index" width="80" label="#"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="500">
      </el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="100">
      </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="100">
      </el-table-column>
      <el-table-column  label="下单时间" width="180">
        <template slot-scope="scope">
          {{ timestampToTime(scope.row.upd_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle  plain @click="editGoods(scope.row.goods_id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle   plain @click="delGoods(scope.row.goods_id)"></el-button>
            </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @current-change="current_change"
      @size-change="size_change"
      :page-sizes="[10, 20, 40]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchData: "",
     
      goodsList: [],
       // 分页
      total: 0,
      num: 1,
      size: 10
    };
  },
  methods: {
    // 添加
    addGoods(){
      this.$router.push({path: '/goods/add'})
    },
    editGoods(id){
      this.$router.push({path: '/goods/edit/'+id})
    },
    // 删除
    delGoods(id){
       this.$confirm("此操作将删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
      this.http({
        url:'/goods/' +id,
        method:'delete'
      }).then(back =>{
        // console.log(back)
        var {meta} =back.data
        if(meta.status ===200){
          this.$message({message: meta.msg,type:'success'})
          this.GetGoods()
        }else{
          this.$message({message: meta.msg,type:'error'})
        }
      })
        })
       .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 时间戳
    timestampToTime(row, column) {
      var date = new Date(row);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
    },
    // 页数
    current_change(num) {
      (this.num = num), this.GetGoods();
    },
    // 	pageSize 改变时会触发
    size_change(size) {
      this.size = size;
      // console.log(this.size)
      this.GetGoods();
    },
    GetGoods(s = "") {
      var urls = "";
      if ((s = "")) {
        urls = `/goods?pagenum=${this.num}&pagesize=${this.size}`;
      } else {
        urls = `/goods?pagenum=${this.num}&pagesize=${this.size}&query=${this.searchData}`;
      }
      this.http({
        url: urls,
        method: "get"
      }).then(back => {
        console.log(back.data.data);
        this.total = back.data.data.total;
        this.goodsList = back.data.data.goods;
      });
    },
    search(){
      this.GetGoods(this.searchData)
    }
  },
  mounted() {
    this.GetGoods()
  }
};
</script>

<style>
.search {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
