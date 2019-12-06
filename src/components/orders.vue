<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table
      :data="ordersList.goods"
      border
      style="width: 100%"
      class="search"
      >
      <el-table-column type="index" width="80" label="#"></el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="250">
      </el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="100">
      </el-table-column>
      <el-table-column label="是否付款" width="100">
        <template slot-scope="scope">
          <p v-if="scope.row.pay_status === '0'">
            <el-tag type="danger">未付款</el-tag>
          </p>
          <p v-if="scope.row.pay_status === '1'">
            <el-tag type="success">已付款</el-tag>
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="250">
      </el-table-column>
      <el-table-column prop="update_time" label="下单时间" width="250">
        <template slot-scope="scope">
          {{ timestampToTime(scope.row.update_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button
          type="primary"
          icon="el-icon-edit"
          circle
          plain
          @click="editorders"
        ></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @current-change="current_change"
      @size-change="size_change"
      :page-sizes="[4, 8, 10]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog title="修改订单地址" :visible.sync="ordersShow">
      <el-form ref="form" :model="orderData" label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="orderData.area"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="orderData.check" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="ordersShow = false"
            >修改订单</el-button
          >
          <el-button @click="ordersShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 0,
      num: 1,
      size: 4,
      ordersList: [],
      // 弹窗
      ordersShow: false,
      orderData: {
        check: "",
        area: ""
      }
    };
  },
  methods: {
    editorders() {
      this.ordersShow = true;
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
    current_change(num) {
      (this.num = num), this.GetOrder();
    },
    // 	pageSize 改变时会触发
    size_change(size) {
      this.size = size;
      // console.log(this.size)
      this.GetOrder();
    },
    GetOrder(s = "") {
      var urls = "";
      if ((s = "")) {
        urls = `/orders?pagenum=${this.num}&pagesize=${this.size}`;
      } else {
        urls = `/orders?pagenum=${this.num}&pagesize=${this.size} `;
      }
      this.http({
        url: urls,
        method: "get"
      }).then(back => {
        console.log(back.data.data);

        this.ordersList = back.data.data;
        this.total = this.ordersList.total;
      });
    }
  },
  mounted() {
    this.GetOrder();
  }
};
</script>

<style>

</style>
