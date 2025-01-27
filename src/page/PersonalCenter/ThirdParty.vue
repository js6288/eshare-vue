<template>
  <div class="personal-center-main">
    <personal-canter-sub-header headName="绑定第三方账号"/>

    <div class="oauth-list">
      <div class="oauth-item">
        <a-divider style="margin: 0"/>
        <div class="list-title">
          <exclamation-circle-filled v-if="githubBindStatus === false" style="color: #d48806;margin-right: 5px;font-size: 18px"/>
          <check-circle-filled v-else style="color: #00bb00;margin-right: 5px;font-size: 18px"/>
          <p>绑定Github账号</p>
        </div>
        <div class="list-description" >
          <p v-if="githubBindStatus" style="color: #6d757a">已绑定Github账号</p>
          <p v-else style="color: #6d757a">未绑定Github账号</p>
        </div>
        <div class="list-link">
          <a v-if="githubBindStatus" @click="unBind('GITHUB')">解绑</a>
          <a v-else @click="toGitHubAuthPage">绑定Github账号</a>
        </div>
      </div>
      <div class="oauth-item">
        <a-divider style="margin: 0"/>
        <div class="list-title">
          <exclamation-circle-filled style="color: #d48806;margin-right: 5px;font-size: 18px"/>
          <p>绑定QQ账号</p>
        </div>
        <div class="list-description" >
          <p style="color: #6d757a">未绑定QQ账号</p>
        </div>
        <div class="list-link">
          <a >绑定QQ账号</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PersonalCanterSubHeader from "../../components/PersonalCanterSubHeader.vue";
import {getGitHubUrl, getUserThirdParty, unbind} from "../../api/oauth";
import {message, Modal} from "ant-design-vue";
import {createVNode, ref} from "vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";

const githubBindStatus = ref(false);

const toGitHubAuthPage = async () => {
  //获取GitHub登录地址
  const res: any = await getGitHubUrl();
  if (res.code == 200 && res.data) {
    const url = res.data;
    //跳转到GitHub登录地址
    window.location.href = url;
  } else {
    message.error("系统繁忙请稍后重试")
  }
}

const getBindingList = async ()=>{
  const res:any = await getUserThirdParty();
  if (res.code == 200 && res.data){
    bindList.value = res.data;
  }
}
interface oauth{
  id: number,
  userId: number,
  authType: string,
  openId: number
}
const bindList = ref<oauth[]>([])
// getBindingList();

//判断用户的绑定状态
const checkBindStatus = async ()=>{
  await getBindingList();
  const valueElement = bindList.value.pop();
  if (!valueElement){
    githubBindStatus.value = false;
    return;
  }else {
    githubBindStatus.value = valueElement.authType === 'GITHUB';
  }
}

const unBind = async (authType:string)=>{
  Modal.confirm({
    title: '第三方账号解绑',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode('div', { style: 'color:black;' }, '确定要解除绑定吗？'),
    async onOk() {
      const res:any = await unbind(authType);
      if (res.code && res.data){
        message.success("解绑成功");
        await checkBindStatus();
      }else {
        message.warn("操作失败,账号可能已经解绑")
      }
    },
    onCancel() {
      console.log('Cancel');
    }
  })



}
checkBindStatus();
</script>

<style scoped lang="scss">
.personal-center-main{
  padding: 20px 10px 10px 10px;
}
.oauth-list{
  margin-top: 30px;
}
.list-title{
  width: 250px;
  display: flex;
  align-items: center;
  padding: 30px 10px 30px 20px;
  float: left;
  p{
    margin-bottom: 0;
  }
}
.list-description{
  width: 250px;
  padding: 30px 10px 30px 20px;
  float: left;
}
.list-link{
  padding: 30px 10px 30px 20px;
  float: left;
}
</style>
