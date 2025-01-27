<template>
  <div class="personal-center-main">
    <personal-canter-sub-header headName="文章收藏夹"/>

    <div class="eshare-article-list">
      <a-card class="article-card" :body-style="{}" v-for="article in articlePage.articleCardESList">
        <div class="eshare-card-header">
          <img :src="article.avatar" class="avatar-img" alt="">
          <span class="card-username"> {{article.nickname}} </span>
          <a-tag color="#ffcd36" style="margin-left: 6px">Lv.{{article.level}}</a-tag>
          <span style="position: absolute;right: 30px;color: #666666">收藏于 {{dayjs(article.createTime).format("YYYY-MM-DD")}} </span>
        </div>
        <a-divider style="margin:10px 0"/>
        <div class="article-card-content">
          <div class="article-title-div">
            <a-tag class="official-lab" v-if="article.type === 1" color="#1890ff" style="">官方</a-tag>
            <a-list-item-meta>
              <template #title>
                <a href="#" class="article-title">
                  <h3 @click="toArticleDetailPage(article.articleId)">
                    {{article.articleTitle}}
                  </h3>
                </a>
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

          <div class="article-card-data" style="">
            <eye-outlined />
            <span class="article-card-data-num">{{article.viewsNum}}</span>
            <like-outlined />
            <span class="article-card-data-num">{{ article.likesNum }}</span>
            <message-outlined />
            <span class="article-card-data-num">{{ article.commentsNum }}</span>
          </div>
          <a-dropdown-button size="small">

            <template #overlay>
              <a-menu >
                <a-menu-item key="1" @click="handleCancelCollect(article.articleId)">
                  <delete-outlined />
                  取消收藏
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
import PersonalCanterSubHeader from "../../components/PersonalCanterSubHeader.vue"
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import {ArticleCardsPage} from "../../model/ArticleCardsPage";
import {collectArticle, myCollectArticle} from "../../api/article";
import dayjs from "dayjs";
import {message} from "ant-design-vue";
const router = useRouter();
const route:any = useRoute();

const articlePage = ref<ArticleCardsPage>({
  articleCardESList: [], curPage: 0, pageNum: 0, total: 0
})

const pageSize = ref(5);

const curPage = ref(articlePage.value.curPage+1);

const loadStarArticlePage = async () => {
  const res:any = await myCollectArticle(articlePage.value.curPage);
  articlePage.value = res.data;
}

loadStarArticlePage();

const pageChange = async (e: any) => {
  console.log(e)
  const res: any = await myCollectArticle(e-1);
  articlePage.value = res.data;
}

const toArticleDetailPage = (aid:number) => {
  router.push({
    path: '/articleDetail/'+aid
  })
}

//取消收藏
const handleCancelCollect = async (articleId:number) => {
  const res:any = await collectArticle(articleId,2);
  if (res.code == 200){
    message.success("已从收藏列表中移除");
    await loadStarArticlePage();
  }else {
    message.error(res.description||res.message);
  }
}
</script>

<style scoped lang="scss">
.personal-center-main{
  padding: 20px 10px 10px 10px;
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

.article-title{
h3{
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}
}
.article-pagination{
  text-align: center;
  margin-bottom: 20px;
}
</style>
