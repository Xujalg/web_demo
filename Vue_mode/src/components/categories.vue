<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="serach">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="aa"><el-button type="success" plain @click="add">添加分类</el-button></div>

    <el-table :data="type_3" style="width: 100%" row-key="cat_id" border :tree-props="{children: 'children'}">
      <el-table-column label="商品 ID" prop="cat_name" width="300px">
      
      </el-table-column>
      <el-table-column label="级别" width="200px">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-if="scope.row.cat_level === 1">二级</span>
          <span v-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效" width="200px">
        <template slot-scope="scope">{{
          !scope.row.cat_deleted ? "有效" : "无效"
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <div slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" circle plain @click="edit(scope.row)"></el-button>
        <el-button type="danger" icon="el-icon-delete" circle plain @click="del(scope.row)"></el-button>
        </div>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @current-change="current_change"
      :page-size="5"
      :current-page="num"
      layout="total,  prev, pager, next, jumper"
      :total="total"
    > </el-pagination>
    <!-- 修改分类 -->
    <el-dialog title="修改商品分类" :visible.sync="edit_Show">
      <el-form ref="editCateFm" :model="editData" >
        <el-form-item label="分类名称" label-width="100px" prop="cat_name">
          <el-input v-model="editData.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="edit_Show = false">取 消</el-button>
        <el-button type="primary" @click="edit_put">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加分类 -->
    <el-dialog title="添加商品分类" :visible.sync="add_Show">
      <el-form ref="addCateFm" :model="addData" >
        <el-form-item label="分类名称" label-width="100px" prop="cat_name">
          <el-input v-model="addData.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="默认分类类别" label-width="100px">
          <el-cascader :options="type_2" :props="defaultProps" v-model="selectedPIds"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add_Show = false">取 消</el-button>
        <el-button type="primary" @click="add_post">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 0,
      num: 1,
      size: 10,

      type_3: [],
      type_2:[],
      selectedPIds:[],
      edit_Show: false,
      add_Show:false,
      cat_id:0,
      editData:{
        cat_pid: '',
        cat_name: '',
        cat_level: '',
      },
      addData:{
        cat_name:'',
        cat_level:2
      },
       defaultProps: {
        checkStrictly: true,
        value: 'cat_id',
        children: 'children',
        label: 'cat_name',
        expandTrigger: 'hover',
      },
    };
  },
  methods: {
    current_change(num) {
      this.num = num
      // console.log('wewewwe')
      this.getCat();
    },
    add_post(){
     this.http({
       url:'categories',
       method:"post",
       data:{cat_pid: this.selectedPIds[this.selectedPIds.length-1],cat_name:this.addData.cat_name,cat_level: this.addData.cat_level,selectedPIds: this.selectedPIds}
     }).then(back =>{
       console.log(back)
       var {meta} =back.data
       if(meta.status === 201){
         this.$message({message:meta.msg ,type:"success"})
         this.add_Show =false
         this.getCat()
       }else{
         this.$message({message: meta.msg, type:'error'})
       }
       
     })
    },
    add(){
      this.add_Show =true
      console.log
    },
    del(row){
      this.$confirm('你是否要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
      this.http({
        url:'/categories/'+row.cat_id,
        method:'delete'
      }).then(back =>{
      console.log(back)
      var {meta} =back.data
      if(meta.status === 200){
         this.$message({message:meta.msg , type:'success'})
          this.getCat()
      }else{
         this.$message({message:meta.msg , type:'error'})
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
    edit_put(){
      this.http({
        url:"categories/" +this.cat_id,
        method:'put',
        data:{cat_name: this.editData.cat_name}
      }).then(back=> {
        console.log(back)
        var {meta} =back.data
        if(meta.status ===200){
          this.$message({message:meta.msg , type:'success'})
          this.edit_Show = false
             this.getCat()
        }
        else{
          this.$message({message:meta.msg , type:'error'})
        }
      })
    },
    edit(data){
      console.log(data)
      this.editData.cat_name = data.cat_name
      this.cat_id = data.cat_id
      this.edit_Show =true
    },
    getCat(){
      this.http({
      url: "/categories?type=3&pagenum=" + this.num + "&pagesize=5",
      method: "get"
    }).then(back => {
      this.total =back.data.data.total
      this.type_3 =back.data.data.result
     
    });
    },
    addCat(){
       this.http({
      url: "/categories?type=2",
      method: "get"
    }).then(back => {
      this.type_2 = back.data.data;
    });
    }
  },
  mounted() {
    this.getCat()
    this.addCat()
  }
};
</script>

<style>
.aa {
  float: left;
  margin-top: 10px;
  margin-bottom: 6px;
}
</style>
