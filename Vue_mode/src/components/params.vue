<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="search">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-alert
      title="
注意：只允许为第三级分类设置相关参数！"
      type="info"
      show-icon
      center
      class="search"
    >
    </el-alert>
    <div class="aa">
      <el-cascader
        v-model="goods_cat"
        :options="paramsList"
        :props="defaultParams"
        @change="change"
      >
      </el-cascader>
    </div>
    <template>
      <el-tabs class="bb" @tab-click="parm" v-model="active">
        <el-tab-pane label="动态参数">
          <el-button round class="aa" border :disabled="a" @click="add_many"
            >动态添加数据</el-button
          >
          <el-table
            :data="userData_many"
            stripe
            border
            style="width: 100%"
            type="expand"
          >
            <el-table-column type="expand">
              <el-row slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(item, index) in scope.row.params"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row, index)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  >+ New Tag</el-button
                >
              </el-row>
            </el-table-column>

            <el-table-column
              type="index"
              label="#"
              width="80"
            ></el-table-column>
            <el-table-column prop="attr_name" label="商品参数" width="180">
            </el-table-column>
            <el-table-column label="操作">
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
                  @click="del_many(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数">
          <el-button round class="aa" border :disabled="a" @click="add_only"
            >静态数据添加</el-button
          >
          <el-table :data="userData_only" stripe border style="width: 100%">
            <el-table-column type="index" width="80"></el-table-column>
            <el-table-column prop="attr_name" label="商品名称" width="180">
            </el-table-column>
            <el-table-column prop="attr_vals" label="属性值" width="180">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  plain
                  @click="edit_only(scope.row)"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="del_only(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </template>
    <!-- 弹窗 动态修改 -->
    <el-dialog title="编辑动态参数" :visible.sync="edit_many_Show">
      <el-form :model="many_data" label-width="80px" class="add_from">
        <el-form-item label="用户名">
          <el-input v-model="many_data.attr_name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="edit_many">修改用户</el-button>
          <el-button @click="edit_many_Show = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 弹窗 静态修改 -->
    <el-dialog title="编辑静态参数" :visible.sync="edit_only_Show">
      <el-form :model="edit_only_data" label-width="90px" class="add_from">
        <el-form-item label="静态参数">
          <el-input v-model="edit_only_data.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="静态参数值" >
          <el-input v-model="edit_only_data.attr_vals"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="edit_only_put">修改用户</el-button>
          <el-button @click="edit_only_Show = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 弹窗 动态添加 -->
    <el-dialog title="添加动态参数" :visible.sync="add_many_Show">
      <el-form :model="add_many_data" label-width="90px" class="add_from">
        <el-form-item label="用户名">
          <el-input v-model="add_many_data.attr_name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add_many_2">修改用户</el-button>
          <el-button @click="add_many_Show = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

     <!-- 弹窗 动态添加 -->
    <el-dialog title="添加静态参数" :visible.sync="add_only_Show">
      <el-form :model="add_only_data" label-width="90px" class="add_from">
        <el-form-item label="静态参数">
          <el-input v-model="add_only_data.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="静态参数值">
          <el-input v-model="add_only_data.attr_vals"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add_only_2">修改用户</el-button>
          <el-button @click="add_only_Show = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: "0",
      paramsList: [],
      goods_cat: [],
      a: true,
      defaultParams: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: "hover"
      },
      checked: 0,
      userData_many: [],
      userData_only: [],
      edit_many_Show: false,
      add_many_Show: false,
      many_data: {
        attr_name: "",
        attr_sel: "",
        attr_vals: "",
        cat_id: "",
        attr_id: ""
      },
      add_many_data: {
        attr_name: "",
        attr_sel: "many",
        attr_id: ""
      },
      inputVisible: false,
      inputValue: "",

      edit_only_Show: false,
      edit_only_data: {
        attr_id: 0,
        attr_name: "",
        attr_sel: "",
        attr_vals: "",
        cat_id: "",
      },
      add_only_Show: false,
      add_only_data:{
        attr_name: "",
        attr_sel: "only",
        attr_id: "",
        attr_vals:''
      }
    };
  },
  methods: {
    add_only_2(){
        this.http({
        url: `/categories/${this.checked}/attributes/`,
        method: "post",
        data: this.add_only_data
      }).then(back => {
        var { meta } = back.data;
        if (meta.status === 201) {
          this.$message({ message: meta.msg, type: "success" });
          this.add_only_Show = false;
          this.parm();
        } else {
          this.$message({ message: meta.msg, type: "error" });
        }
      });
    },
    add_only(){
      console.log('12112')
      this.add_only_Show = true;
    },

    del_only(row){
      this.$confirm("此操作将删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        this.http({
          url: `/categories/${row.cat_id}/attributes/${row.attr_id}`,
          method:'delete'
        }).then(back =>{
           var { meta } = back.data;
        if (meta.status === 200) {
          this.$message({ message: meta.msg, type: "success" });
          this.parm();
        } else {
          this.$message({ message: meta.msg, type: "error" });
        }
        })
      }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    edit_only_put(){
      this.http({
        url:`categories/${this.edit_only_data.cat_id}/attributes/${this.edit_only_data.attr_id}`,
        method:'put',
        data:this.edit_only_data
      }).then(back =>{
        var {meta}= back.data
        if(meta.status ===200){
          this.$message({message:meta.msg,type:"success"})
          this.edit_only_Show = false
          this.parm()
        }else{
          this.$message({message:meta.msg,type:"error"})
        }
      })
    },
    edit_only(data) {
      this.edit_only_Show = true;
      console.log(data);
      this.edit_only_data.attr_id = data.attr_id;
      this.edit_only_data.attr_name = data.attr_name;
      this.edit_only_data.attr_sel = "only";
      this.edit_only_data.attr_vals = data.attr_vals;
      this.edit_only_data.cat_id =data.cat_id
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm(row) {
      let inputValue = this.inputValue;
      if (inputValue) {
        row.params.push(inputValue);
        var putData = {};
        (putData.attr_name = row.attr_name),
          (putData.attr_sel = row.attr_sel),
          (putData.attr_vals = row.params.join(","));

        row.attr_vals = putData.attr_vals;
        this.http({
          url: `/categories/${row.cat_id}/attributes/${row.attr_id}`,
          method: "put",
          data: putData
        }).then(back => {
          var { meta } = back.data;
          if (meta.status === 200) {
            this.$message({ message: meta.msg, type: "success" });
          } else {
            this.$message({ message: meta.msg, type: "error" });
          }
        });
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    add_many_2() {
      this.http({
        url: `/categories/${this.checked}/attributes/`,
        method: "post",
        data: this.add_many_data
      }).then(back => {
        var { meta } = back.data;
        if (meta.status === 201) {
          this.$message({ message: meta.msg, type: "success" });
          this.add_many_Show = false;
          this.parm();
        } else {
          this.$message({ message: meta.msg, type: "error" });
        }
      });
    },
    add_many() {
      this.add_many_Show = true;
    },
    edit_many() {
      this.http({
        url: `/categories/${this.many_data.cat_id}/attributes/${this.many_data.attr_id}`,
        method: "put",
        data: this.many_data
      }).then(back => {
        var { meta } = back.data;
        if (meta.status === 200) {
          this.$message({ message: meta.msg, type: "success" });
          this.parm();
          this.edit_many_Show = false;
        } else {
          this.$message({ message: meta.msg, type: "error" });
        }
      });
    },
    // 修改获取数据
    edit(row) {
      // console.log(row);
      this.many_data.attr_name = row.attr_name;
      this.many_data.attr_sel = row.attr_sel;
      this.many_data.attr_vals = row.attr_vals;
      this.many_data.attr_id = row.attr_id;
      this.many_data.cat_id = row.cat_id;
      this.edit_many_Show = true;
    },
    handleClose(data, index) {
      data.params.splice(index, 1);
      this.http({
        url: `/categories/${data.cat_id}/attributes/${data.attr_id}`,
        method: "put",
        data: {
          attr_name: data.attr_name,
          attr_sel: "many",
          attr_vals: data.params.join(",")
        }
      }).then(back => {
        var { meta } = back.data;
        if (meta.status === 200) {
          this.$message({ message: meta.msg, type: "success" });
          // console.log(this.cat_many);
        } else {
          this.$message({ message: meta.msg, type: "error" });
        }
      });
    },
    // 删除动态
    del_many(row) {
         this.$confirm("此操作将删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        this.http({
          url: `/categories/${row.cat_id}/attributes/${row.attr_id}`,
          method:'delete'
        }).then(back =>{
           var { meta } = back.data;
        if (meta.status === 200) {
          this.$message({ message: meta.msg, type: "success" });
          this.parm();
        } else {
          this.$message({ message: meta.msg, type: "error" });
        }
        })
      }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    change() {
      this.a = false;
      this.parm();
    },
    parm() {
      if (this.active == "0") {
        this.http({
          url: `categories/${
            this.goods_cat[this.goods_cat.length - 1]
          }/attributes?sel=many`,
          method: "get"
        }).then(back => {
          var { meta } = back.data;
          if (meta.status === 200) {
            this.userData_many = back.data.data;
            // console.log(this.userData_many)
            this.checked = this.userData_many[
              this.userData_many.length - 1
            ].cat_id;
          }
          this.userData_many.forEach(v1 => {
            const arr = [];
            v1.attr_vals
              .trim()
              .split(",")
              .forEach(v2 => {
                if (v2) {
                  arr.push(v2);
                }
              });
            this.$set(v1, "params", arr);
          });
        });
      } else {
        this.http({
          url: `categories/${
            this.goods_cat[this.goods_cat.length - 1]
          }/attributes?sel=only`,
          method: "get"
        }).then(back => {
          this.userData_only = back.data.data;
        });
      }
    }
  },
  mounted() {
    this.http({
      url: "/categories",
      method: "get"
    }).then(back => {
      // console.log(back)
      this.paramsList = back.data.data;
    });
  }
};
</script>

<style>
.aa {
  float: left;
  margin-top: 5px;
}
.bb {
  margin-top: 50px;
}
</style>
