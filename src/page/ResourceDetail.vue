<template>
  <div>

    <div class="resource-detail-card">
<!--      <a-page-header-->
<!--          style="border: 0 solid rgb(235, 237, 240);padding: 0"-->
<!--          title="资源详情"-->
<!--          @back="() => $router.go(-1)"-->
<!--      />-->
      <a-breadcrumb separator=">">
        <a-breadcrumb-item><router-link to="/resource">资源库</router-link></a-breadcrumb-item>
        <a-breadcrumb-item class="breadcrumb-resourceName">资源详情</a-breadcrumb-item>
      </a-breadcrumb>
      <a-divider style="margin: 5px 0"/>
      <div class="resource-detail-flex">
        <div class="resource-detail">
          <a-typography-title
              :content="resourceDetail.resourceName"
              class="resource-name"
              :style="ellipsis ? {width: '700px'}: {}"
              :ellipsis="ellipsis ? {tooltip: resourceDetail.resourceName} : false"
              :level="3">{{resourceDetail.resourceName}}</a-typography-title>
<!--          <h3>{{resourceDetail.resourceName}}</h3>-->
          <div class="resource-tag">
            <a-tag color="blue" v-for="(tag) in resourceDetail.tagList">{{tag}}</a-tag>
            <a-tag color="blue">{{resourceDetail.majorName}}</a-tag>
<!--            <a-tag color="blue">面试</a-tag>-->
<!--            <a-tag color="blue">资源</a-tag>-->
          </div>
          <div class="resource-detail-data">
            <a-statistic title="需积分" :value="resourceDetail.requirePoint" style="margin-right: 50px  " />
            <a-statistic title="下载量" :value="resourceDetail.downloadNum" style="margin-right: 50px" />
            <a-statistic title="收藏量" :value="resourceDetail.collectionNum" style="margin-right: 50px" />
            <div style="margin-right: 50px;color: #777888">{{ dayjs(resourceDetail.createTime).format("YYYY-MM-DD") }} 上传</div>
            <div style="color: #777888">{{formatBytes(resourceDetail.fileSize,2)}}</div>
          </div>
          <div class="btn-group">
            <a-button type="primary" shape="round" size="large" @click="handleDownloadResource">
              <template #icon>
                <DownloadOutlined />
              </template>
              下 载
            </a-button>
            <div class="collect-resource" @click="handleCollectResource">
              <img v-if="!collectState" src="../assets/collect/collect_2.svg">
              <img v-else src="../assets/collect/collect_1.svg">
              <div v-bind:style="collectState?{color: '#409EFF'}:{}" style="margin-left: 10px;font-size: 16px">收藏</div>
            </div>
          </div>
        </div>
        <div class="user-head">

          <a-avatar :src="resourceDetail.avatar" class="avatar" :size="64">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <div style="margin-top: 10px">{{ resourceDetail.nickname }}</div>
        </div>
      </div>

    </div>
    <div class="resource-detail-card">
      <h3 style="font-weight: 700">资源描述</h3>
      <div class="desc-content">{{resourceDetail.resourceDescription}}</div>
    </div>
    <div class="resource-detail-card">
      <h3 style="font-weight: 700">资源评论</h3>
      <a-divider style="margin: 5px 0"/>
      <div class="resource-commend-input">
        <a-comment>
          <template #avatar>
            <a-avatar :src="userHead" :size="32">
              <template #icon><UserOutlined /></template>
            </a-avatar>
          </template>
          <template #content>
            <a-form-item>
              <a-textarea :disabled="commendDisable" :placeholder="commendPlaceholderText" v-model:value="commendText" :rows="4" />
            </a-form-item>
            <a-form-item>
              <a-button :disabled="commendDisable" :loading="submitting" type="primary" @click="submitComment">
                发表评论
              </a-button>
            </a-form-item>
          </template>
        </a-comment>
      </div>
      <div>
        <a-list
            class="comment-list"
            :header="`${resourceCommentPage.total} 条评论`"
            item-layout="horizontal"
            :data-source="resourceCommentPage.records"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-comment :author="item.nickname" :avatar="item.avatarUrl">

                <template #content>
                  <p>
                    {{ item.content }}
                  </p>
                </template>
                <template #datetime>
                  <a-tooltip :title="dayjs(item.createTime).format('YYYY-MM-DD HH:MM')">
                    <span>{{ dayjs(item.createTime).fromNow() }}</span>
                  </a-tooltip>
                </template>
              </a-comment>
            </a-list-item>
          </template>
        </a-list>
      </div>
      <div style="text-align: center;margin-top: 40px">
        <a-pagination @change="commentPageChange"
                      v-model:current="curPage"
                      v-model:page-size="resourceCommentPage.size"
                      :total="resourceCommentPage.total"
                      :show-size-changer="false"
                      show-quick-jumper />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {reactive, ref} from "vue";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import articleImgUrl from '../assets/xiaoheizi.jpeg'
import {
  addResourceComment, collectResource,
  getDownloadUrl,
  getResourceCommentPage,
  getResourceDetailById,
  getResourceIsDownload,
  isResourceCollect
} from "../api/resource";
import {ResourceDetail} from "../model/ResourceDetail";
import {message} from "ant-design-vue";
import {formatBytes} from "../utils/file";
import {getUserType} from "../auth/auth";
import {ResourceCommentPage} from "../model/ResourceCommentPage";
import router from "../config/router";

dayjs.extend(relativeTime);
// dayjs.extend(utc)
// dayjs.extend(timezone)
//
// dayjs.tz.setDefault("Asia/Shanghai")

const route:any = useRoute();
// const resourceName = ref('微软面试100题系列之高清完整版PDF文档[带目录+标签]by_July 阿巴阿巴阿巴')
const ellipsis = ref(true);

const resourceDetail = ref<ResourceDetail>({
  avatar: "",
  collectionNum: 0,
  createTime: new Date(),
  downloadNum: 0,
  fileSize: 0,
  fileType: "",
  majorName: "",
  nickname: "",
  requirePoint: 0,
  resourceDescription: "",
  resourceId: 0,
  resourceName: "",
  status: 0,
  tagList: [],
  type: 0,
  updateTime: new Date()
})
//获取资源详情
const loadResourceDetail = async ()=>{
  const resourceId:number = parseInt(route.params.rid);
  const res:any = await getResourceDetailById(resourceId);
  if (res.code === 200 && res.data){
    resourceDetail.value = res.data;
  }else {
    message.error(res.description||res.message);
    router.go(-1);
  }
}

loadResourceDetail();

const collectState = ref(false)
const handleCollectResource =async () => {
  const resourceId = parseInt(route.params.rid);
  // collectState.value = collectState.value === false;
  if (!collectState.value){
    //收藏
    const res:any = await collectResource(resourceId,1);
    if (res.code == 200){
      collectState.value = !collectState.value;
      resourceDetail.value.collectionNum++;
      message.success("收藏成功");
    }else {
      message.warn(res.description||res.message);
    }
  }else {
    //取消收藏
    const res:any = await collectResource(resourceId,2);
    if (res.code == 200){
      collectState.value = !collectState.value;
      resourceDetail.value.collectionNum--;
      message.success("取消收藏成功");
    }else {
      message.warn(res.description||res.message);
    }
  }

}
//评论表单用户头像
const userHead = ref()
//获取当前用户头像
const getLocalUserHead=()=>{
  //从localStorage中获取
  const loginUser = getUserType();
  if (loginUser != ""){
    userHead.value = loginUser.avatarUrl;
  }
}
getLocalUserHead();

//是否禁止评论
const commendDisable = ref(true);
//发表评论文本域placeholder
const commendPlaceholderText = ref("只有下载资源才能发表评论")

const commendText = ref('');

//查询用户是否下载资源
const setCommendDisable = async ()=>{
  const resourceId = route.params.rid;
  const res:any = await getResourceIsDownload(resourceId??0)
  if (res.code == 200){
    if (res.data == true){
      commendDisable.value = false;
      commendPlaceholderText.value = "请友善发表评论哦~";
    }else if (res.data == false){
      return;
    }
  }
}
setCommendDisable();
/**
 * 下载资源
 */
const handleDownloadResource = async ()=>{
  const resourceId = route.params.rid;
  //获取下载地址
  const res:any = await getDownloadUrl(resourceId);
  if (res.code == 200 && res.data){
    const downloadUrl = res.data;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = resourceDetail.value.resourceName+"."+resourceDetail.value.fileType;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    await setCommendDisable();
  }else {
    message.error(res.description||res.message)
  }

}

const resourceCommentPage = ref<ResourceCommentPage>({
  current: 1, records: [], size: 0, total: 0
})
const curPage = ref(resourceCommentPage.value.current);
//加载评论分页
const loadCommentPage = async ()=>{
  const rid = parseInt(route.params.rid);
  const res:any = await getResourceCommentPage(rid,resourceCommentPage.value.current);
  resourceCommentPage.value = res.data;
}
loadCommentPage();


const commentPageChange = async (e: any) => {
  const rid = parseInt(route.params.rid);
  const res:any = await getResourceCommentPage(rid,e);
  resourceCommentPage.value = res.data;
}

const submitting = ref(false);

const submitComment = async ()=>{
  if (commendText.value.length == 0){
    message.warn("评论不能为空哦")
  }
  const resourceId = resourceDetail.value.resourceId;
  const res:any = await addResourceComment(resourceId,commendText.value);
  if (res.code == 200 && res.data){
    message.success("评论发布成功");
    //TODO 重新获取评论列表
    await loadCommentPage();
    commendText.value = '';
  }else {
    message.warn(res.description||res.message);
  }

}

//判断用户是否收藏该资源
const checkIsCollect = async ()=>{
  const resourceId = parseInt(route.params.rid);
  const res:any = await isResourceCollect(resourceId);
  if (res.code == 200){
    collectState.value = res.data;
  }
}

checkIsCollect();

//收藏资源和取消操作



const data = [
  {
    author: 'Han Solo',
    avatar: articleImgUrl,
    content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    datetime: dayjs().subtract(1, 'days'),
  },
  {
    author: 'Han Solo',
    avatar: articleImgUrl,
    content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    datetime: dayjs().subtract(2, 'days'),
  },
]

const current = ref(2);
</script>

<style lang="scss"  scoped>
.resource-detail-card{
  width: 950px;
  min-height: 250px;
  /*border: 1px gray solid;*/
  margin-top: 20px;
  border-radius: 10px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 16px 0 rgb(205 216 228 / 80%);
}
.breadcrumb-resourceName{

}
.resource-detail-flex{
  display: flex;
}
.resource-detail{
  width: 700px;
}
.user-head{
  width: 200px;

  margin-left: 10px;
  text-align: center;
  .avatar{
    margin-top: 20px;
  }
}
.resource-detail-data{
  display: flex;
  margin-top: 20px;
  align-items: center;
}
.btn-group{
  margin-top: 20px;
  display: flex;
}
.collect-resource {
  margin-left: 50px;
  display: flex;
  align-items: center;
  cursor: pointer;
  img{
    height: 40px;
  }
}
</style>
