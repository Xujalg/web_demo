<template>
  <el-container class="height100">
    <el-header
      >电商后台
      <div style="float:right ">
        <el-button type="danger" plain @click="out">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu default-active="2" class="el-menu-vertical-demo" router unique-opened>
          <el-submenu :index="v1.path" v-for="v1 in menusList" :key="v1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ v1.authName }}</span>
            </template>
            <el-menu-item-group v-for="v2 in v1.children" :key="v2.id">
              <template slot="title">
                <el-menu-item :index="'/'+v2.path">
                  <i class="el-icon-menu"></i>
                  {{ v2.authName }}
                </el-menu-item>
              </template>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menusList: []
    };
  },
  mounted() {
    this.http({
      url: "menus",
      method: "get"
    }).then(back => {
      this.menusList = back.data.data;
      // console.log(this.menusList);
    });
  },
  methods: {
    out() {
      this.$confirm("此操作将退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          localStorage.removeItem('token')
          this.$message({message: '退出成功', type: 'success'})
          this.$router.push({ path: '/login' })
          })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    }
  }
};
</script>

<style>
.height100 {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #ffffff;
  text-align: center;
  height: 60px;
  line-height: 60px;
  font-size: 30px;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
  margin-left: -20px;
}
.el-menu-item {
  margin-left: -20px;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 10px;
  height: 100%;
}
</style>
