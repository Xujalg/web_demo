import Vue from "vue";
import Router from "vue-router";
import login from "@/components/login";
import index from "@/components/index";
import users from "@/components/users";
import error from "@/components/error";
import rights from "@/components/rights"
import roles from "@/components/roles"
import orders from "@/components/orders"
import goods from "@/components/goods"
import goods_add from "@/components/goods_add"
import goods_edit from "@/components/goods_edit"
import params from "@/components/params"
import categories from "@/components/categories"
import reports from "@/components/reports"

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/login",
      component: login
    },
    {
      path: "/",
      component: index,
      children: [
        { path: "/users", component: users },
        {path: '/rights', component: rights},
        {path: '/roles', component: roles},
        {path: '/orders', component: orders},
        {path: '/goods', component: goods},
        {path: '/goods/add', component: goods_add},
        {path: '/goods/edit/:id', component:goods_edit},
        {path: '/params',component:params},
        {path:'/categories',component:categories},
        {path:'/reports' , component :reports},
        { path: "*", component: error },
      ]
    }
  ]
});
