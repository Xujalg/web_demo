<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="search">
      <el-alert title="消息提示的文案" type="info" show-icon center> </el-alert>
    </div>
    <!-- 步骤 -->
    <el-steps :active="parseInt(active)" finish-status="success" class="a">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <!-- 下拉 -->
    <el-tabs
      tab-position="left"
      style="height: 100%; margin-top:10px"
      v-model="active"
      @tab-click="parm"
    >
      <el-tab-pane label="基本信息">
        <el-form label-position=" left" label-width="80px" :model="addData">
          <el-form-item label="名称">
            <el-input v-model="addData.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="addData.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="重量">
            <el-input v-model="addData.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="addData.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="分类">
            <el-cascader
              v-model="goods_cat"
              :options="catList"
              :props="defaultParams"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数">
        <el-form>
          <el-form-item
            v-for="v1 in cat_many"
            :key="v1.attr_id"
            :label="v1.attr_name"
          >
            <el-checkbox-group v-model="v1.attr_vals" size="small">
              <el-checkbox
                v-for="(v, i) in v1.attr_vals"
                :key="i"
                :label="v"
                border
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品属性">
        <el-form>
          <el-form-item
            v-for="v2 in cat_only"
            :key="v2.attr_id"
            :label="v2.attr_name"
          >
            <el-input v-model="v2.attr_vals"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片">
        <el-upload
          class="upload-demo"
          :headers="upload_head"
          action="http://localhost:8888/api/private/v1/upload"
          :on-success="upload_success"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容">
        <quillEditor class="quill" v-model="addData.goods_introduce"> </quillEditor>
        <el-button type="success" plain @click="upload" class="btn">确定添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "0",
      // 添加
      addData: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_introduce:"",
        goods_cat:'',
        pics:[]
      },
      // 获取分类
      catList: [],
      goods_cat: [],
      cat_many: [],
      cat_only: [],
      defaultParams: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 图片
        upload_head:{
        Authorization : localStorage.getItem('token')
      }
    };
  },
  methods: {
    // 添加商品

    upload(){
      this.addData.goods_cat = this.goods_cat.join()
      console.log(this.addData)
      this.http({
        url:'/goods',
        method:'post',
        data:this.addData
      }).then(back =>{
        var {meta} =back.data
        if(meta.status === 201){
         this.$router.push({path: '/goods'})
          this.$message({message:meta.msg,type:'success'})
        }else{
          this.$message({message:meta.msg, type:'error'})
        }
      })
    },
    // 上传图片
      upload_success(back) {
        console.log(back)
      if (back.meta.status === 200) {
        this.$message({message: back.meta.msg,type:'success'});
        var a={pic:back.data.tmp_path}
        this.addData.pics.push(a)
        console.log(this.addData)
      } else {
             this.$message({message: back.meta.msg,type:'error'});
      }
    },
    parm() {
      if (this.active == "1") {
        if (this.goods_cat.length == 0) {
          this.$message({ message: "请选择商品分类", type: "error" });
        }
        if (this.goods_cat.length != 3) {
          this.$message({ message: "请确认商品分类", type: "error" });
        } else {
          // console.log(this.value[2]);
          this.http({
            url: `categories/${this.goods_cat[2]}/attributes?sel=many`,
            method: "get"
          }).then(back => {
            this.cat_many = back.data.data;
            console.log(this.cat_many);
            this.cat_many.forEach(v1 => {
              v1.attr_vals = v1.attr_vals.split(",");
            });
            console.log(this.cat_many);
          });
        }
      } else if (this.active == "2") {
        this.http({
          url: `categories/${this.goods_cat[2]}/attributes?sel=only`,
          method: "get"
        }).then(back => {
          this.cat_only = back.data.data;
          console.log(this.cat_only);
        });
      }
    }
  },
  mounted() {
    this.http({
      url: "categories",
      method: "get"
    }).then(back => {
      this.catList = back.data.data;
      // console.log(back.data.data);
    });
  }
};
</script>

<style>
.quill {
  height: 300px;
  margin-bottom: 50px;
  background: #fff;
}

.ql-editor {
  background: #fff;
}
.btn{
  margin-top: 50px
}
</style>
