<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="search"
              ></el-button>
            </el-input></div
        ></el-col>
        <el-col :span="18"
          ><div
            class="grid-content bg-purple"
            style="float:left ;margin-left:15px"
          >
            <el-button type="success" plain @click="addShow = true"
              >添加用户</el-button
            >
          </div></el-col
        >
      </el-row>
    </div>
    <!-- 表格 -->
    <el-table :data="userData" stripe border style="width: 100%">
      <el-table-column type="index" width="80" label="#"></el-table-column>
      <el-table-column prop="username" label="姓名" width="150">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"> </el-table-column>
      <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
      <el-table-column prop="role_name" label="角色" width="200">
      </el-table-column>
      <el-table-column label="用户状态" width="150">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="state_change(scope.row)"
          >
          </el-switch
        ></template>
      </el-table-column>
      <el-table-column prop="mobile" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            plain
            @click="edit(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            plain
            @click="delUser(scope.row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            plain
            @click="roleChange(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗1 add -->
    <el-dialog title="添加用户" :visible.sync="addShow">
      <el-form :model="addData" label-width="80px" class="add_from">
        <el-form-item label="用户名">
          <el-input v-model="addData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="addData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="addData.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add">添加用户</el-button>
          <el-button @click="addShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 弹窗2 edit -->
    <el-dialog title="修改用户" :visible.sync="editShow">
      <el-form :model="editData" label-width="80px" class="add_from">
        <el-form-item label="用户名">
          <el-input v-model="editData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="editData.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editadd">修改用户</el-button>
          <el-button @click="editShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 弹窗3 role -->
    <el-dialog title="修改角色" :visible.sync="roleShow">
      <el-form :model="roleData" label-width="80px" class="add_from">
        <el-form-item label="用户名">
          <el-input v-model="roleData.username" disabled></el-input>
        </el-form-item>
        <template>
          <el-select v-model="rolesChecked" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </template>
        <el-form-item class="rolebtn">
          <el-button type="primary" @click="roleedit">修改角色</el-button>
          <el-button @click="roleShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchData: "",
      // 查询
      userData: [],
      total: 0,
      num: 1,
      size: 4,
      // 弹窗1 add
      addShow: false,
      addData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 弹窗2 edit
      editShow: false,
      editData: {
        username: "",
        email: "",
        mobile: "",
        id: ""
      },
      // 修改角色
      roleShow: false,
      roleData: {
        id: "",
        username: ""
      },
      roleList: [],
      rolesChecked: ""
    };
  },
  methods: {
    // 修改角色提交
    roleedit() {
      this.http({
        url: "/users/" + this.roleData.id + "/role",
        method: "put",
        data: { rid: this.rolesChecked }
      }).then(back => {
        // console.log(back.data)
        var { meta } = back.data;
        if (meta.status === 200) {
          this.roleShow = false;
          this.GetUser();
          this.$message({ message: meta.msg, type: "success" });
        } else {
          this.$message({ message: meta.msg, type: "error" });
        }
      });
    },
    // 修改角色获取
    roleChange(data) {
      this.roleData.id = data.id;
      this.roleData.username = data.username;
      this.http({
        url: "/roles",
        method: "get"
      }).then(back => {
        this.roleList = back.data.data;
        console.log(data.role_name);
        if (data.role_name === "超级管理员") {
          this.rolesChecked = 0;
        } else {
          this.rolesChecked = data.role_name;
        }
        this.roleShow = true;
      });
    },
    // 提交修改
    editadd() {
      this.http({
        url: "/users/" + this.editData.id,
        method: "put",
        data: this.editData
      }).then(back => {
        // console.log(back)
        var { meta } = back.data;
        if (meta.status === 200) {
          this.editShow = false;
          this.GetUser();
          this.$message({ message: meta.msg, type: "success" });
        } else {
          this.$message({ message: meta.msg, type: "error" });
        }
      });
    },
    // 修该用户111
    edit(data) {
      // console.log(data)
      this.editShow = true;
      this.editData.username = data.username;
      this.editData.id = data.id;
      this.editData.mobile = data.mobile;
      this.editData.email = data.email;
    },
    // 添加用户
    add() {
      this.http({
        url: "/users",
        method: "post",
        data: this.addData
      }).then(back => {
        console.log(back)
        var { meta } = back.data;
        if (meta.status === 201) {
          this.addShow = false;
          this.GetUser();
          this.$message({ message: meta.msg, type: "success" });
        } else {
          this.$message({ message: meta.msg, type: "error" });
        }
        // console.log(back);
      });
    },
    // 删除用户
    delUser(id) {
      this.$confirm("此操作将删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.http({
            url: "/users/" + id,
            method: "delete"
          }).then(back => {
            // console.log(back);
            var { meta } = back.data;
            if (meta.status === 200) {
              this.$message({ message: meta.msg, type: "success" });
              this.GetUser();
            } else {
              this.$message({ message: meta.msg, type: "error" });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 用户状态
    state_change(row) {
      this.http({
        url: "/users/" + row.id + "/state/" + row.mg_state,
        method: "put"
      }).then(back => {
        var { meta } = back.data;
        if (meta.status === 200) {
          this.GetUser();
          this.$message({ message: meta.msg, type: "success" });
        } else {
          this.$message({ message: meta.msg, type: "error" });
        }
      });
    },
    // 页数
    current_change(num) {
      (this.num = num), this.GetUser();
    },
    // 	pageSize 改变时会触发
    size_change(size) {
      this.size = size;
      // console.log(this.size)
      this.GetUser();
    },
    search() {
      this.GetUser(this.searchData);
      this.searchData = "";
    },
    // 获取用户信息
    GetUser(s = "") {
      var urls = "";
      if (s != "") {
        urls =
          "/users?pagenum=" +
          this.num +
          "&pagesize=" +
          this.size +
          "&query=" +
          this.searchData;
      } else {
        urls = "/users?pagenum=" + this.num + "&pagesize=" + this.size;
      }
      this.http({
        url: urls,
        method: "get"
      }).then(back => {
        var { data, meta } = back.data;
        // console.log(data);
        this.total = data.total;
        this.userData = data.users;
      });
    }
  },
  mounted() {
    this.GetUser();
  }
};
</script>

<style>
.search {
  margin-top: 10px;
  margin-bottom: 10px;
  
}
.add_from {
  width: 80%;
  margin: 0 auto;
}
.rolebtn {
  margin-top: 20px;
}
</style>
