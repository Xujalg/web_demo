<template>
  <div class="login-wrap">
    <el-form
      ref="form"
      :rules="rules"
      :model="LoginData"
      label-width="80px"
      class="login-from"
    >
      <h2>用户登陆</h2>
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="LoginData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="LoginData.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" @click="login"
          >登陆</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      LoginData: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入秘密", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    login() {
      // console.log("23231");
      this.$refs.form.validate(valid => {
        if (valid) {
          this.http({url: "/login", method: "post", data: this.LoginData}).then(
            back => {
              // console.log(back);
              if (back.data.meta.status === 200) {
                localStorage.setItem("token", back.data.data.token);
                this.$router.push({ path: "/" });
                this.$message({ message: "恭喜你, 登录成功", type: "success" });
              } else {
                this.$message({ message: back.data.meta.msg, type: "error" });
              }
            }
          );
        } else {
          this.$message({ message: "输入不合法, 请修改", type: "error" });
        }
      });
    }
  }
};
</script>

<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-from {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}

.login-wrap .login-from .login-btn {
  width: 100%;
}
</style>
