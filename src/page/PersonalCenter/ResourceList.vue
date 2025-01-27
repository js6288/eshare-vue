<template>
  <div class="personal-center-main">
    <div class="personal-center-head">
      <a-divider class="personal-divider" type="vertical" />
      <span class="personal-title">我的资源</span>
      <a-button v-if="isShow" size="middle" type="primary" style="margin-left: auto;margin-right: 30px" @click="toUploadPage"><cloud-upload-outlined />点击上传</a-button>
    </div>
    <div class="resource-list">
      <div class="resource" v-for="resource in resourcePage.records">
        <img src="http://eshare-assers.linjsblog.top/assets/文件.png" style="width: 150px">
        <div  class="resource-title-div">
          <a @click="toResourceDetail(resource.resourceId,resource.status)">
            {{ resource.resourceName }}
          </a>
        </div>
        <div class="file-size">{{formatBytes(resource.fileSize,2)}}</div>
        <div class="resource-data">
          {{ resource.downloadNum }} 下载
          <a-divider type="vertical" />
          {{ resource.collectionNum }} 收藏
        </div>
        <div v-if="isShow" class="resource-settings">
          <span style="color: #a5d63f" v-if="resource.status === 1">审核通过</span>
          <span style="color: #ffc300"  v-else-if="resource.status === 0">审核中</span>
          <span  style="color: #d43030" v-else>审核不通过</span>

          <a-dropdown-button size="small"  >

            <template #overlay>
              <a-menu>
                <a-menu-item key="1" @click="handleDeleteResource(resource.resourceId)">
                  <delete-outlined />
                  删除资源
                </a-menu-item>
                <a-menu-item key="2" @click="handleCollectResource(resource.resourceId,resource.status)">
                  <star-outlined />
                  收藏资源
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown-button>
        </div>
      </div>
      <div class="resource-pagination">
        <a-pagination @change="pageChange"
                      v-model:current="curPage"
                      v-model:page-size="resourcePage.size"
                      :total="resourcePage.total"
                      :show-size-changer="showSizeChanger"
                      show-quick-jumper
        />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {createVNode, ref} from "vue";
import currentUserDetailStore from "../../store/modules/CurrentUserDetailStore";
import {storeToRefs} from "pinia";
import {ResourcePage} from "../../model/ResourcePage";
import {collectResource, getResourcePageById, removeResource} from "../../api/resource";
import {formatBytes} from "../../utils/file";
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import {removeArticleSelf} from "../../api/article";

const route:any = useRoute();
const router = useRouter();
const toUploadPage = () =>{
  router.push({
    path: '/uploadResource'
  })
}

const resourcePage = ref<ResourcePage>({
  current: 1, records: [], size: 0, total: 0
})
//获取主页对应的资源列表
const curPage = ref(resourcePage.value.current);
const loadResourcePage = async () => {
  const uid = parseInt(route.params.uid);
  const res: any = await getResourcePageById(uid,resourcePage.value.current);
  resourcePage.value = res.data;
  // console.log(resourcePage.value)
}
loadResourcePage();
//操作按钮的显示
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

const showSizeChanger = false;
const current = ref(1);

const toResourceDetail = (id: number,status:number) => {
  //如果当前资源审核通过才允许跳转
  if (status === 1){
    router.push({
      path:`/resourceDetail/${id}`
    })
  }{
    message.warn("该资源需要审核通过才能访问哦")
  }

}

const pageChange = async (e: any) => {
  console.log(e)
  const uid = parseInt(route.params.uid);
  const res: any = await getResourcePageById(uid,e);
  resourcePage.value = res.data;
}

const handleCollectResource = async (resourceId:number,status:number) => {
  if (status!=1){
    message.warn("不能收藏未通过审核的资源！")
    return;
  }
  const res:any = await collectResource(resourceId,1);
  if (res.code==200){
    message.success("收藏成功,已加入我的收藏资源")
  }else {
    message.warn(res.description||res.message);
  }
}

const handleDeleteResource = (resourceId:number) => {
    Modal.confirm({
      title: '删除资源',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:black;' }, '确定要删除该资源吗?删除稿件后无法再恢复哦！'),
      async onOk() {
        const res:any = await removeResource(resourceId);
        if (res.code && res.data){
          message.success("操作成功");
          await loadResourcePage();
        }else {
          message.warn(res.description||res.message);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    })
}
</script>

<style lang="scss" scoped>
.personal-center-main{
  padding: 20px 10px 10px 10px;
}
.personal-center-head{
  margin-top: 10px;
  display: flex;
  align-items: center;
}
.personal-divider{
  width: 8px; height: 20px; background-color: #999999;margin-left: 25px
}
.personal-title{
  font-size: 17px;
  font-weight: 700;
  margin-left: 5px;
}

.resource-list{
  width: 620px;
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 0;
  padding: 10px 0 16px 40px;
}
.resource{
  width: 150px;
  margin-right: 30px;
  margin-bottom: 30px;
}
.resource-title-div a{
  font-size: 14px;
  color: #222226;
  line-height: 24px;
}

.resource-title-div{
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size{
  text-align: center;color: #8e8e93;font-weight: 500;margin-top: 8px;
}

.resource-data{
  text-align: center;
  font-size: 12px;
  margin-top: 8px;
}
.resource-pagination{
  width: 580px;
  text-align: center;
  flex-wrap: wrap;
}
.resource-settings{
  display: flex;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
}
</style>
