<template>
  <div class="resource-carousel">
    <a-carousel autoplay arrows>
      <template #prevArrow>
        <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
          <left-circle-outlined />
        </div>
      </template>
      <template #nextArrow>
        <div class="custom-slick-arrow" style="right: 10px">
          <right-circle-outlined />
        </div>
      </template>
      <div><img src="https://www.gduf.edu.cn/images/damen.jpg"></div>
      <div><img src="https://www.gduf.edu.cn/images/xdh1.jpg"></div>
      <div><img src="https://www.gduf.edu.cn/images/gaozhiliang2.png"></div>
      <div><img src="https://www.gduf.edu.cn/images/20020827banner.jpg"></div>
    </a-carousel>
  </div>
  <a-divider></a-divider>
  <div class="resource-select-box">
    <div class="flex-select" >
      <div class="search-title">形式</div>
      <div>
        <a-radio-group v-model:value="style" button-style="solid" size="small">
          <a-radio-button v-for="(item,index) in selectFrom.style" :style="index>0?{marginLeft: '10px'}:{}" :value="item">{{item}}</a-radio-button>
        </a-radio-group>
      </div>
    </div>
    <div class="flex-select">
      <div class="search-title">类型</div>
      <div>
        <a-radio-group v-model:value="type" button-style="solid" size="small">
          <a-radio-button v-for="(item,index) in selectFrom.type" :style="index>0?{marginLeft: '10px'}:{}" :value="item">{{item}}</a-radio-button>
        </a-radio-group>
      </div>
    </div>
    <div class="flex-select">
      <div class="search-title">专业</div>
      <div>
        <a-radio-group v-model:value="major" button-style="solid" size="small" >
          <a-radio-button v-for="(item,index) in selectFrom.major" :style="index>0?{marginLeft: '10px'}:{}" :value="item">{{item}}</a-radio-button>
        </a-radio-group>
      </div>
    </div>
    <div class="flex-select">
      <div class="search-title">格式</div>
      <div>
        <a-radio-group v-model:value="format" button-style="solid" size="small">
          <a-radio-button v-for="(item,index) in selectFrom.format" :style="index>0?{marginLeft: '10px'}:{}" :value="item">{{item}}</a-radio-button>
        </a-radio-group>
      </div>
    </div>
  </div>
  <div class="resource-search">
    <a-input-search
        v-model:value="searchText"
        placeholder="搜索资源"
        enter-button="搜索"
        size="large"
        @search="onSearch"
    />
  </div>
  <div class="resource-list">
    <div class="resource" v-for="resourceCard in resourceCardPage.resourceESList">
      <img src="http://eshare-assers.linjsblog.top/assets/%E6%96%87%E4%BB%B6.png" style="width: 150px">
      <div class="resource-title-div">
        <a @click="toResourceDetail(resourceCard.resourceId)">
          {{resourceCard.resourceName}}
        </a>
      </div>
      <div class="file-size">{{formatBytes(resourceCard.fileSize,2)}}</div>
      <div class="resource-data">
        {{resourceCard.downloadNum}}下载
        <a-divider type="vertical" />
         {{resourceCard.collectionNum}}收藏
      </div>
    </div>
    <div class="resource-pagination">
      <a-pagination @change="pageChange" v-model:current="current" :total="resourceCardPage.total" v-model:page-size="pageSize" :show-size-changer="showSizeChanger" show-quick-jumper />
    </div>
  </div>

</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {ResourceCardsPage} from "../model/ResourceCardsPage";
import {getResourceLibrary, searchResource} from "../api/resource";
import {formatBytes} from "../utils/file"
const showSizeChanger = false;
const router = useRouter();

const resourceCardPage = ref<ResourceCardsPage>({
  curPage: 0, pageNum: 0, resourceESList: [], total: 0
})
//加载资源列表
const loadResourceList = async ()=> {
  //初始化页码为0
  resourceCardPage.value.curPage = 0;
  const res:any = await getResourceLibrary(resourceCardPage.value.curPage);
  resourceCardPage.value = res.data;
  console.log(resourceCardPage.value)
}
loadResourceList()

const pageChange = async (e:any) => {
  const res = await getResourceLibrary(e-1);
  resourceCardPage.value = res.data;
}

interface filterLab{
  style: string[];
  type: string[];
  major: string[];
  format: string[];
}
const selectFrom = reactive<filterLab>({
  style: ["全部","免费资源","积分资源"],
  type: ["全部","专业课","考研","四六级","学习","面试","C++","Java","Python"],
  major: ["全部","计算机科学与技术","信息管理与信息系统","互联网金融","数据科学与大数据技术"],
  format: ["全部","doc","pdf","zip","ppt","exe"]
})

const style = ref<string>(selectFrom.style[0]);
const type = ref<string>(selectFrom.type[0]);
const major = ref<string>(selectFrom.major[0]);
const format = ref<string>(selectFrom.format[0]);

const onSearch =async () => {
  if (!searchText.value){
    await loadResourceList();
  }else {
    const res:any = await searchResource(searchText.value,0)
    resourceCardPage.value = res.data;
  }
}
const searchText = ref('');

const current = ref(resourceCardPage.value.curPage+1);
const pageSize = ref(15);

const toResourceDetail = (id: number) => {
  router.push({
    path:`/resourceDetail/${id}`
  })
}
</script>

<style lang="scss" scoped>
.resource-carousel{
  width: 950px;
  border-radius: 10px;
  -webkit-box-shadow: 0 5px 10px 0 rgba(0,0,0,.2);
  box-shadow: 0 5px 10px 0 rgba(0,0,0,.2);
}
.resource-carousel img{
  width: 100%;
}
.ant-carousel :deep(.slick-list){
  border-radius: 10px;

}
/* For demo */
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 320px;
  line-height: 320px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
}

.resource-select-box{
  width: 950px;
  min-height: 250px;
  /*border: 1px gray solid;*/
  margin-top: 20px;
  border-radius: 10px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 16px 0 rgb(205 216 228 / 80%);
}
.flex-select{
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}
.search-title{
  margin-right: 12px;
  font-size: 15px;
  font-weight: 700;
  color: #3a4156;
  min-width: 40px;
}
.resource-search{
  width: 640px;
  margin-top: 40px;
  margin-left: 150px;
}
.resource-list{
  width: 950px;
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 0;
  padding: 10px 0 16px 40px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 16px 0 rgb(205 216 228 / 80%);
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
  width: 850px;
  text-align: center;
  flex-wrap: wrap;
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  /*background-color: rgba(31, 45, 61, 0.11);*/
  opacity: 0.3;
  z-index: 1;
}

.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}
.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
}
</style>
