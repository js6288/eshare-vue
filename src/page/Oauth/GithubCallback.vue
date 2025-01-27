<template>
<h1>登录中。。。</h1>
</template>

<script lang="ts" setup>

import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import {bindingGithub, loginByGitHub} from "../../api/oauth";
import {getUserType, setToken, setUserType} from "../../auth/auth";
import {message} from "ant-design-vue";

const route = useRoute();
const router = useRouter();

const code = ref(route.query.code)

//获取query参数,发送给后端
const loginGithub = async () => {
  const code: any = route.query.code;
  if (code){
    //判断当前用户是否登录，如果未登录，则调用三方登录接口，如果已登录，则调用绑定第三方账号接口
    const userType = getUserType();
    if (userType == ""){
      const res:any = await loginByGitHub(code);
      if (res.code == 200 && res.data){
        //保存token
        setToken(res.data.token);
        //保存用户信息
        setUserType(res.data.userVO);
        //TODO 路由到主页或之前的页面
        window.location.href = "/";
      }else {
        message.error(res.description||res.message)
        await router.replace("/");
      }
    }else {
      const res:any = await bindingGithub(code);
      if (res.code == 200 && res.data){
        message.success("绑定成功")
      }else {
        message.warn(res.description||res.message);
      }
      await router.replace("/")
    }
  }else {
    message.error("系统繁忙，请稍后重试")
    await router.replace("/");
  }

}


loginGithub();



</script>

<style scoped>

</style>
