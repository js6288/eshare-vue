<template>
<div>

  <a-page-header
      style="border: 0 solid rgb(235, 237, 240);background: #ffffff"
      title="文章详情"
      sub-title=""
      @back="() => $router.go(-1)"
  >
  <a-typography-title style="margin-top: 30px;margin-left: 20px">{{ articleDetail.articleTitle }}</a-typography-title>
  <div class="article-author-div">
    <a-avatar :src="articleDetail.avatar" :size="64"></a-avatar>
    <div class="author-data">
      <div>
        <span class="nickname" @click="router.push('/personalCenter/'+articleDetail.userId+'/postList')">{{ articleDetail.nickname }}</span>
        <a-tag color="#1890ff" style="margin-left: 10px">lv.{{ articleDetail.level }}</a-tag>
      </div>
      <div class="article-num" style="display: flex;margin-top: 15px">
        <span>发表于: {{ dayjs(articleDetail.createTime).format("YYYY-MM-DD HH:MM") }}</span>
        <span style="margin-left: 10px">已于: {{ dayjs(articleDetail.updateTime).format("YYYY-MM-DD HH:MM") }} 修改</span>
        <div class="article-data" >
          <eye-outlined style="font-size: 20px"/>
          <span style="margin-left: 5px;margin-right: 40px">{{ articleDetail.viewsNum }}</span>
          <div v-if="curUserId === articleDetail.userId" class="edit-btn" @click="toEditPage(articleDetail.articleId)">
            <edit-outlined style="font-size: 20px"/>
            <span style="margin-left: 5px;margin-top: 2px">编辑</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <a-divider></a-divider>
  <div class="article-content">
    <v-md-preview :text="articleDetail.content"></v-md-preview>
  </div>
  <a-divider></a-divider>
  <div class="article-foot">
    <div class="article-tags">
      <a-space :size="size">
        <a-tag v-for="tag in articleDetail.tagList" color="blue">{{tag}}</a-tag>

      </a-space>
    </div>
    <div class="article-like-collect-num">
      <div class="article-like"  @click="likeAction">
        <like-filled v-if="!likedStatus" style="font-size: 30px;color: #666666"/>
        <like-filled v-else style="font-size: 30px;color: #40a9ff"/>
        <span>{{ articleDetail.likesNum }}</span>
      </div>
      <div class="article-star" @click="starAction">
        <star-filled v-if="!starStatus" style="font-size: 30px;color: #666666"/>
        <star-filled v-else style="font-size: 30px;color: #40a9ff"/>
        <span>{{ articleDetail.collectionsNum }}</span>
      </div>
    </div>
  </div>
  <div>
    <div class="resource-commend-input">
      <h3 style="font-weight: 700;margin-top: 20px">评论区</h3>
      <a-divider style="margin: 5px 0"/>
      <a-comment>
        <template #avatar>
          <a-avatar :src="userHead" :size="32">
            <template #icon><UserOutlined /></template>
          </a-avatar>
        </template>
        <template #content>
          <a-form-item>
            <a-textarea  :placeholder="commendPlaceholderText" v-model:value="commendText" :rows="4" />
          </a-form-item>
          <a-form-item>
            <a-button  :loading="submitting" type="primary" @click="submitComment">
              发表评论
            </a-button>
          </a-form-item>
        </template>
      </a-comment>
    </div>
  </div>
  <div class="comment-div">
    <a-comment v-for="commentList in articleCommentData">
      <template #actions>
        <span @click="openReplyModal(commentList[0])" key="comment-nested-reply-to">回复</span>
        <span key="comment-basic-like">
        <a-tooltip title="Like">
          <template v-if="action === 'liked'">
            <LikeFilled @click="like" />
          </template>
          <template v-else>
            <LikeOutlined @click="like" />
          </template>
        </a-tooltip>
        <span style="padding-left: 8px; cursor: auto">
          {{ likes }}
        </span>
      </span>
      </template>
      <template #author>
        <a>{{commentList[0].nickname}}</a>
      </template>
      <template #avatar>
        <a-avatar :src="commentList[0].avatarUrl" alt="Han Solo" />
      </template>
      <template #content>
        <p>
          {{commentList[0].content}}
        </p>
      </template>
      <a-comment v-for="comment in commentList.slice(1)">
        <template #actions>
          <span @click="openReplyModal(comment)">回复</span>
        </template>
        <template #author>
          <a>{{comment.nickname}}</a>
        </template>
        <template #avatar>
          <a-avatar :src="comment.avatarUrl" alt="Han Solo" />
        </template>
        <template #content>
          <p>
            {{comment.content}}
          </p>
        </template>
      </a-comment>
    </a-comment>
  </div>
    <a-modal v-model:visible="replyVisible" title="回复" @ok="commitReply">
      <a-form-item>
        <a-textarea  :placeholder="commendPlaceholderText" v-model:value="replyText" :rows="4" />
      </a-form-item>
    </a-modal>
  </a-page-header>
</div>
</template>

<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import {
  addComment,
  articleCommentList,
  articleViewNumIncr,
  collectArticle,
  getArticleEsByArticleId,
  isCollect,
  isLike,
  likeArticle
} from "../api/article";
import {ArticleCard} from "../model/ArticleCard";
import dayjs from "dayjs";
import currentUserDetailStore from "../store/modules/CurrentUserDetailStore";
import {storeToRefs} from "pinia";
import {message} from "ant-design-vue";
import {getUserType} from "../auth/auth";
import {CommentAddBody} from "../model/CommentAddBody";
import {ArticleComment} from "../model/ArticleComment";

const route:any = useRoute();

const action = ref<string>();
const likes = ref<number>(0);
const like = () => {
 if (action.value !== 'liked'){
   likes.value++;
   action.value = 'liked';
 }else {
   likes.value--;
   action.value = 'disliked';
 }
}

articleViewNumIncr(route.params.aid);

const articleDetail = ref<ArticleCard>({
  articleId: 0,
  articleTitle: "",
  content: "",
  type: 0,
  orderImages: [],
  commentsNum: 0,
  likesNum: 0,
  viewsNum: 0,
  collectionsNum: 0,
  createTime: new Date(),
  updateTime: new Date(),
  userId: 0,
  nickname: "",
  avatar: "",
  level: 0,
  tagList: []
})

//获取当前用户id
const curUserId = ref();

// 获取当前用户
const userDetailStore = currentUserDetailStore();
const {currentUserDetail} = storeToRefs(userDetailStore);
const getCurUser = async () => {
  const res:any = await userDetailStore.getAndSetCurrentUserDetail();
  if (res.value){
    curUserId.value = res.value?.userId;
  }

}
getCurUser();

//获取文章信息
const loadArticleDetail = async () => {
  const articleId = parseInt(route.params.aid);
  const res:any = await getArticleEsByArticleId(articleId);
  if (res.code == 200 && res.data){
    articleDetail.value = res.data;
  }
}
loadArticleDetail();

const router = useRouter();
const toEditPage = (aid: number) => router.push({
  path: `/articleEdit/${aid}`
})
const likedStatus = ref(false);
//  判断用户是否对当前文章点赞
const checkISLike = async ()=>{
  const articleId = parseInt(route.params.aid);
  const res:any = await isLike(articleId);
  if (res.code == 200){
    likedStatus.value = res.data;
  }
}
checkISLike();

//  点赞和取消点赞
const likeAction = async ()=>{
  // likedStatus.value = likedStatus.value === false;
  const articleId = parseInt(route.params.aid);
  if (!likedStatus.value){
    //点赞
    // message.info("点赞")
    const res:any = await likeArticle(articleId,1);
    if (res.code==200){
      likedStatus.value = !likedStatus.value;
      articleDetail.value.likesNum++;
      message.success("点赞成功")
    }else {
      message.warn(res.description||res.message);
    }
  }else {
    //取消点赞
    const res:any = await likeArticle(articleId,2);
    if (res.code==200){
      likedStatus.value = !likedStatus.value;
      articleDetail.value.likesNum--;
    }else {
      message.warn(res.description||res.message);
    }
  }
}
const starStatus = ref(false);
const starAction =async ()=>{
  const articleId = parseInt(route.params.aid);
  if (!starStatus.value){
    //收藏
    const res:any = await collectArticle(articleId,1);
    if (res.code==200){
      starStatus.value = !starStatus.value;
      articleDetail.value.collectionsNum++;
      message.success("收藏成功")
    }else {
      message.warn(res.description||res.message);
    }
  }else {
    //取消收藏
    const res:any = await collectArticle(articleId,2);
    if (res.code==200){
      starStatus.value = !starStatus.value;
      articleDetail.value.collectionsNum--;
    }else {
      message.warn(res.description||res.message);
    }
  }
}

const checkIsCollect = async ()=>{
  const articleId = parseInt(route.params.aid);
  const res:any = await isCollect(articleId);
  if (res.code == 200){
    starStatus.value = res.data;
  }
}

checkIsCollect();


const size = ref(10)

const commendPlaceholderText = ref("轻轻敲醒沉睡的心灵，让我看看你的点评")

//评论表单文本，用于提交评论
const commendText = ref('');

//评论表单用户头像
const userHead = ref()

const getLocalUserHead=()=>{
  //从localStorage中获取
  const loginUser = getUserType();
  if (loginUser != ""){
    userHead.value = loginUser.avatarUrl;
  }
}
getLocalUserHead();

const submitting = ref(false);
//为文章发表评论
const submitComment = async ()=>{
  if (!commendText.value){
    message.warn("评论内容不为空");
    return;
  }
  const articleId = parseInt(route.params.aid);
  const addCommentBody:CommentAddBody = {
    content: commendText.value,
    parentId: 0,//发表根评论
    rootId: 0,//发表根评论
    articleId: articleId
  }

  const res:any = await addComment(addCommentBody);

  if (res.code == 200 && res.data){
    message.success("发表成功");
    await loadArticleComment();
  }else {
    message.warn(res.description||res.message);
  }

  commendText.value = '';

}

const articleCommentData = ref<Array<Array<ArticleComment>>>()

//查询文章评论列表
const loadArticleComment = async ()=>{
  const articleId = parseInt(route.params.aid);
  let userId = 0;
  //获取当前用户id
  const userType = getUserType();
  if (userType != ""){
    userId = userType.userId
  }
  const res:any = await articleCommentList(articleId,userId);
  console.log(res.data);
  articleCommentData.value = res.data;
  console.log(articleCommentData.value)
}

loadArticleComment();

//回复评论文本
const replyText = ref('')

const replyVisible = ref(false)
//打开回复对话框
const openReplyModal = (articleComment:ArticleComment)=>{
  replyVisible.value = true;
  //设置回复的目标评论id
  replyBody.value.parentId = articleComment.id;
  //设置根评论id,如果根评论id为0，则回复为二级评论，设置根id为回复目标的id，否则就继承rootId
  replyBody.value.rootId = articleComment.rootId == 0?articleComment.id:articleComment.rootId;

  replyBody.value.content = "@"+articleComment.nickname+": ";
}

const replyBody = ref<CommentAddBody>({
  articleId: 0, content: "", parentId: 0, rootId: 0
})

//回复评论
const commitReply = async ()=>{
  if (!replyText.value){
    message.warn("回复内容不能为空");
    return;
  }
  //设置articleId
  replyBody.value.articleId = parseInt(route.params.aid);
  replyBody.value.content += replyText.value;

  //提交回复
  const res:any = await addComment(replyBody.value);

  if (res.code==200 && res.data){
    message.success("回复成功");
    //重置
    await loadArticleComment();
  }else {
    message.warn(res.description||res.message)
  }
  //关闭回复框
  replyVisible.value = false;
  replyBody.value = {
    articleId: 0, content: "", parentId: 0, rootId: 0
  }
}
</script>

<style lang="scss" scoped>
.article-author-div{
  display: flex;
  margin-left: 20px;
  margin-top: 30px;
}
.author-data{
  margin-left: 20px;
}
.article-data{
  display: flex;
  align-items: center;
  margin-left: 300px;
}
.article-num{
  color: #666666;
  line-height: 16px;
  font-weight: 400;
}
.edit-btn{
  display: flex;
  cursor: pointer;
}
.article-foot{
  display: flex;
}
.article-like-collect-num{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
  .article-like{
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-right: 40px;
  }
  .article-star{
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-right: 30px;
  }
}

.nickname{
  cursor: pointer;
}
</style>
