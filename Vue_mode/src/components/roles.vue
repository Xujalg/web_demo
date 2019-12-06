<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="search">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button plain @click="addRolesShow = true">添加角色</el-button>

    <!-- 表格 -->
    <el-table :data="rolesList" stripe border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row v-for="v1 in props.row.children" :key="v1.id">
            <el-col :span="4">
              <div class="grid-content bg-purple  ">
                <el-tag type="success" closable @close="del_1(props.row, v1.id)">
                  {{ v1.authName }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="20">
              <el-row v-for="v2 in v1.children" :key="v2.id" >
                <el-col :span="6"
                  ><div class="grid-content bg-purple-light ">
                    <el-tag type="info" closable @close="del_2(props.row, v2.id)">
                      {{ v2.authName }}
                    </el-tag>
                  </div></el-col
                >
                <el-col :span="18"
                  ><div class="grid-content bg-purple-light ">
                    <el-tag
                      type="warning"
                      closable
                      v-for="v3 in v2.children"
                      :key="v3.id"
                      @close="del_3(props.row, v3.id)"
                    >
                      {{ v3.authName }}
                    </el-tag>
                  </div></el-col
                >
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="80" label="#"></el-table-column>
      <el-table-column prop="roleName" label="角色姓名" width="250">
      </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="250">
      </el-table-column>
      <el-table-column prop="mobile" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            plain
            @click="editroles(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            plain
            @click="delroles(scope.row.id)"
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

    <!--弹窗1  add  -->
    <el-dialog title="添加角色" :visible.sync="addRolesShow">
      <el-form ref="form" :model="addRolesData" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="addRolesData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRolesData.roleDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addPost">立即创建</el-button>
          <el-button @click="addRolesShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--弹窗2  edit -->
    <el-dialog title="修改角色" :visible.sync="editRolesShow">
      <el-form ref="form" :model="editRolesData" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="editRolesData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRolesData.roleDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editPost">确定修改</el-button>
          <el-button @click="editRolesShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--弹窗2  tree -->
    <el-dialog title="权限分配" :visible.sync="rolesChangeShow" style="height:100%">
      <el-tree
        :data="rightList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="rightChecked"
        :props="defaultProps"
        ref="trees"
      >
      </el-tree>
          <el-button type="primary" @click="rolePost">确定修改</el-button>
          <el-button @click="rolesChangeShow = false">取消</el-button>
         
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      // add
      addRolesShow: false,
      addRolesData: {
        roleName: "",
        roleDesc: ""
      },
      // edit
      editRolesShow: false,
      editRolesData: {
        id: "",
        roleName: "",
        roleDesc: ""
        //
      },
      // 权限分配
      rolesChangeShow: false,
      rightList: [],
      rightid:0,
      rightChecked:[],
      defaultProps:{
        children: 'children',
          label: 'authName'
      }
    };
  },
  methods: {
    // 提交
    rolePost(){
      console.log(this.rightChecked)
      var rid=this.$refs.trees.getCheckedKeys().concat(this.$refs.trees.getHalfCheckedKeys()).join()
      console.log(rid)
      this.http({
        url: 'roles/'+ this.rightid+'/rights',
        method:'post',
        data:{rids: rid}
      }).then(back =>{
        var{meta} =back.data
        if(meta.status === 200){
          this.$message({message:meta.msg, type:'success'})
          this.getroles()
          this.rolesChangeShow=false
        }
      })
    },
    // 获取所有权限
    roleChange(row) {
      this.rightid =row.id
      // console.log(row)
      this.http({
        url:'/rights/tree',
        method: 'get'
      }).then(back =>{
        // console.log(back.data.data)
        this.rightList = back.data.data
      })
      // 获取拥有的权限
      var arr=[]
      row.children.forEach(v1 => {
        v1.children.forEach(v2 =>{
          v2.children.forEach(v3 => {
            arr.push(v3.id)
          })
        })
      });
      this.rightChecked =arr
      this.rolesChangeShow = true;
    },
     del_1(role, rightid) {
      this.http({
        url: "/roles/" + role.id + "/rights/" + rightid,
        method: "delete"
      }).then(back => {
        var { data, meta } = back.data;
        if (meta.status === 200) {
          this.$message({ message: meta.msg, type: "success" });
          role.children = data;
        }
        // console.log(data)
      });
    },
     del_2(role, rightid) {
      this.http({
        url: "/roles/" + role.id + "/rights/" + rightid,
        method: "delete"
      }).then(back => {
        var { data, meta } = back.data;
        if (meta.status === 200) {
          this.$message({ message: meta.msg, type: "success" });
          role.children = data;
        }
        // console.log(data)
      });
    },
    // 删除权限
    del_3(role, rightid) {
      this.http({
        url: "/roles/" + role.id + "/rights/" + rightid,
        method: "delete"
      }).then(back => {
        var { data, meta } = back.data;
        if (meta.status === 200) {
          this.$message({ message: meta.msg, type: "success" });
          role.children = data;
        }
        // console.log(data)
      });
    },
    // 修改提交
    editPost() {
      this.http({
        url: "/roles/" + this.editRolesData.id,
        method: "put",
        data: {
          roleName: this.editRolesData.roleName,
          roleDesc: this.editRolesData.roleDesc
        }
      }).then(back => {
        var { meta } = back.data;
        if (meta.status === 200) {
          this.editRolesShow = false;
          this.getroles();
          this.$message({ message: meta.msg, type: "success" });
        } else {
          this.$message({ message: meta.msg, type: "error" });
        }
      });
    },
    // 修改角色 获取
    editroles(data) {
      this.editRolesShow = true;
      (this.editRolesData.id = data.id),
        (this.editRolesData.roleName = data.roleName);
      this.editRolesData.roleDesc = data.roleDesc;
    },
    // 添加角色
    addPost() {
      this.http({
        url: "/roles",
        method: "post",
        data: {
          roleName: this.addRolesData.roleName,
          roleDesc: this.addRolesData.roleDesc
        }
      }).then(back => {
        var { meta } = back.data;
        // console.log(meta)
        if (meta.status === 201) {
          this.getroles();
          this.$message({ message: meta.msg, type: "success" });
          this.addRolesShow = false;
          (this.addRolesData.roleDesc = ""), (this.addRolesData.roleName = "");
        } else {
          this.$message({ message: meta.msg, type: "error" });
        }
      });
    },
    // 删除角色
    delroles(id) {
      this.$confirm("此操作将删除角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.http({
            url: "/roles/" + id,
            method: "delete"
          }).then(back => {
            var { meta } = back.data;
            if (meta.status === 200) {
              this.getroles();
              this.$message({ message: meta.msg, type: "success" });
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
    // 获取角色数据
    getroles() {
      this.http({
        url: "/roles",
        method: "get"
      }).then(back => {
        this.rolesList = back.data.data;
        // console.log(this.rolesList);
      });
    }
  },
  mounted() {
    this.getroles();
  }
};
</script>

<style>
.el-button {
  float: left;
  margin-top: 10px;
}
.el-tag {
  margin: 8px 8px  8px;
}
</style>
