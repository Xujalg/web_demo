<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="search">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
      <el-table :data="rightsList" border style="width: 100% ">
      <el-table-column type="index" width="80" label="#"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"> </el-table-column>
      <el-table-column prop="path" label="路径" width="180"> </el-table-column>
      <el-table-column  label="层级"> 
        <template slot-scope="scope">
          <p v-if="scope.row.level == 0">一级</p>
          <p v-if="scope.row.level == 1">二级</p>
          <p v-if="scope.row.level == 2">三级</p>
        </template>
      </el-table-column>
    </el-table>
    
  </div>
</template>

<script>
export default {
  data(){
    return {
      rightsList: []

    }
  },
  methods: {

  },
  mounted() {
    this.http({
      url: '/rights/list' ,
      method: 'get'
    }).then(back =>{
      // console.log(back)
      this.rightsList =back.data.data
    })
  }

};
</script>

<style>
.search {
  margin-top: 10px;
  margin-bottom: 10px;
}</style>
