<template>
  <div class="eshare-account-center">
    <div class="account-center-header">
      <a-avatar
          :size="120"
          class="account-center-avatar"
          :src="currentPageUser?.avatarUrl"
      >
      </a-avatar>
      <div class="account-center-user">
        <div class="user-item">
          <span style="font-weight: 700;font-size: 16px">{{ currentPageUser?.nickname }}</span>
          <a-tag class="level-icon" color="#108ee9">Lv.{{ currentPageUser?.level }}</a-tag>
        </div>
        <div style="font-size: 14px;color: #808080">
          UID: {{ currentPageUser?.userId }}
        </div>
        <div class="user-item">
          <tags-outlined style="color: #ac33c1;font-size: 22px"/>
          <span style="margin-left: 10px">{{ currentPageUser?.personalSignature }}</span>
        </div>
        <div class="user-item">
          <wifi-outlined style="color: dodgerblue;font-size: 22px"/>
          <span style="margin-left: 10px">{{ currentPageUser?.ipAddress }}</span>
        </div>
        <div class="user-item">
          <bank-outlined style="color: darkgray;font-size: 22px"/>
          <span style="margin-left: 10px">{{ currentPageUser?.school }}</span>
        </div>
        <a-divider style="width: 650px;"></a-divider>
        <div class="user-center-data">
          <a-statistic title="获赞数" :value="currentPageUser?.likesNum" style="margin-right: 80px"></a-statistic>
          <a-statistic title="浏览量" :value="currentPageUser?.readNum"></a-statistic>
        </div>
      </div>
    </div>
    <div class="user-center-menu">
      <a-menu
          v-model:openKeys="openKeys"
          v-model:selectedKeys="selectedKeys"
          style="width: 256px"
          mode="inline"
          theme="dark"
          @click="handleClick"
      >
        <a-sub-menu key="content-management">
          <template #icon>
            <SettingOutlined/>
          </template>
          <template #title>内容管理</template>
          <a-menu-item key="postList">投稿</a-menu-item>
          <a-menu-item key="resourceList">资源</a-menu-item>
        </a-sub-menu>
        <a-sub-menu v-if="isShow" key="account">
          <template #icon>
            <SettingOutlined/>
          </template>
          <template #title>个人信息设置</template>
          <a-menu-item key="thirdParty">第三方账号</a-menu-item>
          <a-menu-item key="uploadAvatar">我的头像</a-menu-item>
          <a-menu-item key="passwordReset">密码重置</a-menu-item>
          <a-menu-item key="editAccount">编辑资料</a-menu-item>
        </a-sub-menu>
        <a-menu-item v-if="isShow" key="myLevel">我的等级</a-menu-item>
        <a-menu-item v-if="isShow" key="myPoint">我的积分</a-menu-item>
        <a-sub-menu v-if="isShow" key="star">
          <template #title>我的收藏</template>
          <a-menu-item key="starsArticle">文章</a-menu-item>
          <a-menu-item key="starsResource">资源</a-menu-item>
        </a-sub-menu>
        <a-menu-item v-if="isShow" key="messageCenter">消息中心</a-menu-item>
      </a-menu>
    </div>
    <div class="user-center-content">
      <router-view></router-view>
    </div>
    <div class="back-top">
      <a-back-top>
        <div class="ant-back-top-inner"></div>
      </a-back-top>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {MenuProps} from "ant-design-vue";
import {useRoute, useRouter} from "vue-router";
import {UserType} from "../model/user";
import {getUserById} from "../api/user";
import currentUserDetailStore from "../store/modules/CurrentUserDetailStore";
import {storeToRefs} from "pinia";

const router = useRouter();
const route = useRoute();

//页面加载时获取当前个人主页对应的用户信息
//获取当前页面对应的用户信息
const getPostListUser = async () => {
  const uid:any = route.params.uid;
  console.log("uid", uid)
  const res = await getUserById(uid);
  if (res?.data == null) {
    //该页面用户信息不存在，跳转404
    await router.push('/404')
  } else {
    console.log(res.data)
    currentPageUser.value = res.data;
  }
}
getPostListUser()
const currentPageUser = ref<UserType>()

const userDetailStore = currentUserDetailStore();
const {currentUserDetail} = storeToRefs(userDetailStore);
//校验该主页的用户id是否与当前用户id相同
const isMindPage = async ()=>{
  //获取当前用户信息
  const res:any = await userDetailStore.getAndSetCurrentUserDetail();
  // console.log("res",res.value?.userId)
  if (res.value?.userId == route.params.uid){
    isShow.value = true;
    return;
  }
  isShow.value = false;
}
isMindPage()
//是否展示
const isShow = ref<boolean>();


const selectedKeys = ref<string[]>(['article']);
const openKeys = ref<string[]>(['content-management', 'account']);
const handleClick: MenuProps['onClick'] = e => {
  console.log('click', e);
  console.log(e.key)
  console.log(`/personalCenter/${route.params.uid}/` + e.key)
  router.push({
    path: `/personalCenter/${route.params.uid}/` + e.key
  })
};
const titleClick = (e: Event) => {
  console.log('titleClick', e);
};


watch(
    () => openKeys,
    val => {
      console.log('openKeys', val);
    },
);

</script>

<style lang="scss" scoped>

.account-center-header {
  display: flex;
  width: 970px;
  min-height: 250px;
  /*border: 1px gray solid;*/
  margin-top: 10px;
  border-radius: 10px;
  padding: 20px 50px 24px;
  background-color: #ffffff;
  box-shadow: 0 0 16px 0 rgb(205 216 228 / 80%);
  margin-bottom: 20px;
}

.account-center-avatar {
  margin-right: 24px;
}

.account-center-user {

}

.level-icon {
  height: 20px;
  margin-left: 10px;
  font-weight: 600
}

.user-item {
  display: flex;
  align-items: center;
  margin-top: 6px;
}

.user-center-data {
  display: flex;
  align-items: center;

}

.user-center-menu {
  width: 280px;
  float: left;
}

.user-center-content {
  width: 690px;
  float: right;
  background-color: #fff;
  border-radius: 4px;
  min-height: 700px;
  margin-bottom: 62px;
}

.ant-back-top-inner {
  display: block;
  width: 102px;
  height: 102px;
  line-height: 40px;
  border-radius: 4px;
  background-image: url(data:image/png;base64,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);
  background-size: cover;
}

.back-top .ant-back-top {
  bottom: 250px;
  right: 200px;
}
</style>
