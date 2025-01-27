<template>
    <a-layout-header :style="{background: '#fff',position: 'fixed', zIndex: 3, width: '100%'}">
      <div style="margin: 0 140px">
        <a-row>
          <a-col :xs="8" :sm="8" :md="6" :lg="6" :xl="5" :xxl="4" :xxxl="4">
            <h1>
              <a id="logo" @click="toMainPage">
                <img style="height: 50px" alt="logo" src="../assets/eshare-logo4.svg">
                ESHARE
              </a>
            </h1>
          </a-col>
          <a-col :xs="16" :sm="16" :md="18" :lg="18" :xl="19" :xxl="20" :xxxl="20" style="height: 64px">

            <a-menu
                mode="horizontal"
                :style="{ lineHeight: '64px',float:'left',width: '600px'}"
                v-model:selectedKeys="selectedKeys"
            >
              <a-menu-item key="/">
                <template #icon><home-outlined /></template>

                <router-link to="/">
                  社&nbsp;&nbsp;区
                </router-link>

              </a-menu-item>
              <a-menu-item key="/resource">
                <template #icon><database-outlined /></template>
                <router-link to="/resource">
                  资&nbsp;&nbsp;源&nbsp;&nbsp;库
                </router-link>
              </a-menu-item>

            </a-menu>
            <div id="avatar-dropdown">

              <a-dropdown id="avatar-menu">
                <a class="ant-dropdown-link" @click.prevent>
                  <a-avatar :size="48" id="avatar" :src="userAvatarUrl">
                    <template #icon><UserOutlined /></template>
                  </a-avatar>
                </a>
                <template #overlay>
                  <a-menu v-if="user" :style="{marginTop:'20px'}">
                    <a-menu-item>
                      <span @click="toPersonalCenter">个人中心</span>
                    </a-menu-item>
                    <a-menu-item>
                      <span @click="logout">退出登录</span>
                    </a-menu-item>
                  </a-menu>
                  <a-menu v-else :style="{marginTop:'20px'}">
                    <a-menu-item>
                      <router-link to="/login">登录 Login</router-link>
                    </a-menu-item>
                    <a-menu-item>
                      <router-link to="/register">注册 Register</router-link>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </a-col>
        </a-row>
      </div>

    </a-layout-header>

</template>

<script setup lang="ts">
import {computed, createVNode, reactive, ref, watch, watchEffect} from "vue";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import {getUserType, userLogout} from "../auth/auth";
import {UserType} from "../model/user";
import {getCurrentUserDetails} from "../api/user";
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
const router = useRouter();
const route = useRoute();
const selectedKeys = ref<string[]>(['/']);

const toMainPage = ()=>{
  router.push({
    path:'/'
  })
}

const user = ref<UserType>(getUserType());

const userId = user.value.userId;

const userAvatarUrl = computed(()=>{

    return user.value.avatarUrl;

})

//路由到个人中心
const toPersonalCenter = async () => {
  //判断用户是否登录
  const res = await getCurrentUserDetails();

  //@ts-ignore
  if (res.code === 40100){
    message.error(res.data);
    await router.push("/login");
    return;
  }

  await router.push({
    path: '/personalCenter/' + userId + '/postList'
  })

  console.log("push")

}

//退出登录
const logout = () => {
  Modal.confirm({
    title: '退出登录',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode('div', { style: 'color:black;' }, '确定要退出当前登录账号吗?'),
    onOk() {
      userLogout();
      location.href = "/";
    },
    onCancel() {
      console.log('Cancel');
    },
    class: 'test',
  })
}


//监听路由变化，绑定指定的selectedKey
watch(
    () =>
        router.currentRoute.value.fullPath,
    (newValue: any) => {
      console.log('newValue',newValue)
      selectedKeys.value = [newValue];
    },
    { immediate: true }
)
</script>

<style scoped>
#logo{
  color: #000000d9;
}

#logo img{
  height: 32px;
}

#avatar-dropdown{
  float: right;
}
</style>
