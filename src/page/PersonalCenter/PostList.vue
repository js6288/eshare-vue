<template>
  <div class="my-post">
    <div class="my-post-head">
      <a-divider class="my-post-divider" type="vertical" />
      <span class="my-post-title">我的投稿</span>
      <a-button v-if="isShow" type="primary" size="middle" style="margin-left: auto;margin-right: 30px" @click="toAddArticlePage">
        <form-outlined />
        点击投稿
      </a-button>
    </div>
    <div class="eshare-article-list">
      <a-card class="article-card" :body-style="{}" v-for="article in articlePage.articleCardESList">
        <div class="eshare-card-header">
          <img :src="article.avatar" class="avatar-img" alt="">
          <span class="card-username"> {{article.nickname}} </span>
          <a-tag color="#ffcd36" style="margin-left: 6px">Lv.{{article.level}}</a-tag>
          <span style="position: absolute;right: 30px;color: #666666"> {{dayjs(article.createTime).format("YYYY-MM-DD")}} </span>
        </div>
        <a-divider style="margin:10px 0"/>
        <div class="article-card-content">
          <div class="article-title-div">
            <a-tag class="official-lab" v-if="article.type === 1" color="#1890ff" style="">官方</a-tag>
            <a-list-item-meta>
              <template #title>
                <div class="article-title">
                  <h3 @click="toArticleDetailPage(article.articleId)">
                    {{article.articleTitle}}
                  </h3>
                </div>
              </template>
            </a-list-item-meta>

          </div>
          <div class="article-content">
            <h3>{{article.content}}</h3>
          </div>
          <div class="article-content-img" style="margin-top: 10px">
            <img
                v-for="(orderImage,index) in article.orderImages"
                :width="120"
                :height="120"
                :style="index >= 1 ?{marginLeft: '10px'}:{}"
                :src="orderImage"
                alt=""
            />
          </div>
        </div>

        <div class="article-card-footer" style="margin-top: 7px;display: flex;">
          <a-tag v-for="tag in article.tagList" color="blue">{{tag}}</a-tag>
          <!--          <a-tag color="blue">面试</a-tag>-->

          <div class="article-card-data" style="">
            <eye-outlined />
            <span class="article-card-data-num">{{article.viewsNum}}</span>
            <like-outlined />
            <span class="article-card-data-num">{{ article.likesNum }}</span>
            <message-outlined />
            <span class="article-card-data-num">{{ article.commentsNum }}</span>
          </div>
          <a-dropdown-button v-if="isShow" size="small" >

            <template #overlay>
              <a-menu>
                <a-menu-item @click="toArticleEditPage(article.articleId)" key="1">
                  <edit-outlined />
                  编辑稿件
                </a-menu-item>
                <a-menu-item key="2" @click="handleDeleteArticle(article.articleId)">
                  <delete-outlined />
                  删除稿件
                </a-menu-item>
                <a-menu-item key="3" @click="handleCollectArticle(article.articleId)">
                  <star-outlined />
                  收藏稿件
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown-button>

        </div>

      </a-card>

    </div>
    <div class="article-pagination">
      <a-pagination @change="pageChange" v-model:current="curPage" v-model:page-size="pageSize" :total="articlePage.total" :show-size-changer="false" show-quick-jumper />
    </div>

  </div>

</template>

<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {createVNode, ref} from "vue";
import {collectArticle, getArticlePageByUserId, removeArticleSelf} from "../../api/article";
import dayjs from "dayjs";
import {ArticleCardsPage} from "../../model/ArticleCardsPage";
import currentUserDetailStore from "../../store/modules/CurrentUserDetailStore";
import {storeToRefs} from "pinia";
import {message,Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
const router = useRouter();
const route:any = useRoute();
const toAddArticlePage = ()=>{
  router.push({
    path: '/articleAdd'
  })
}

const articlePage = ref<ArticleCardsPage>({
  articleCardESList: [], curPage: 0, pageNum: 0, total: 0
})
const pageSize = ref(5)

//获取主页对应的投稿列表
// const articleCardList = ref<ArticleCard[]>([]);
//当前页（从1开始）
const curPage = ref(articlePage.value.curPage+1);
const loadUserPostList = async () => {
  const uid = parseInt(route.params.uid);
  const res:any = await getArticlePageByUserId(articlePage.value.curPage, uid);
  articlePage.value = res.data;
  // console.log(articlePage.value )
  // articleCardList.value.push()
}
loadUserPostList();

const pageChange = async (e: any) => {
  console.log(e)
  const uid = parseInt(route.params.uid);
  const res: any = await getArticlePageByUserId(e-1, uid);
  articlePage.value = res.data;
}

const toArticleDetailPage = (aid:number) => {
  router.push({
    path: '/articleDetail/'+aid
  })
}

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

const toArticleEditPage = (articleId:number) => {
  router.push({
    path: '/articleEdit/'+articleId
  })
}

const handleCollectArticle = async (articleId:number) => {
  const res:any = await collectArticle(articleId,1);
  if (res.code==200){
    message.success("收藏成功,已加入我的收藏文章")
  }else {
    message.warn(res.description||res.message);
  }
}

const handleDeleteArticle = async (articleId:number) => {
  Modal.confirm({
    title: '删除稿件',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode('div', { style: 'color:black;' }, '确定要删除稿件吗?删除稿件后无法再恢复哦！'),
    async onOk() {
      const res:any = await removeArticleSelf(articleId);
      if (res.code && res.data){
        message.success("操作成功");
        await loadUserPostList();
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
.my-post{
  padding: 20px 10px 10px 10px;

}
.my-post-head{
  margin-top: 10px;
  display: flex;
  align-items: center;
}
.my-post-divider{
  width: 8px; height: 20px; background-color: #999999;margin-left: 25px
}
.my-post-title{
  font-size: 17px;
  font-weight: 700;
  margin-left: 5px;
}
.article-card{
  width: 620px;
  margin: 30px auto 0;
}

.article-card-data-num{
  margin-left: 8px;
  width: 50px;
  color: #2b2b2c;
}
.article-card-data{
  display:flex;
  flex-grow: 1;
  justify-content: flex-end;
  align-items: center
}
.article-card-content h3 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-content h3 {
  margin-top: 8px;
  line-height: 18px;
  color: #999;
}

.official-lab {
  font-weight: 600;
  text-align: center;
  padding: 0 4px;
  height: 20px;
  line-height: 18px;
  margin-right: 6px;
}

.article-title-div {
  display: flex;
  align-items: center;
}

.article-title h3{
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 0;
  /*margin-bottom: 0.1em;*/
}

.eshare-card-header {
  display: flex;
  align-items: center;
}

.eshare-article-list {
  margin-bottom: 30px;
}

.avatar-img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.card-username {
  font-size: 12px;
  color: #666;
  margin-left: 10px
}
.article-pagination{
  text-align: center;
  margin-bottom: 20px;
}

.article-content-img img{
  object-fit: cover;
  border-radius: 6px;
}

.article-title{
  h3{
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
  }
}
</style>
