<template>
  <div>
    <a-page-header
        style="border: 0 solid rgb(235, 237, 240);background: #ffffff"
        title="编辑文章"
        sub-title=""
        @back="() => $router.go(-1)"
    >
      <a-form>
        <a-form-item
            label="标题"
        >
          <a-input v-model:value="articleDetail.articleTitle"  size="large" show-count :maxlength="30" placeholder="请输入标题，标题不多于30字"/>
        </a-form-item>
        <a-form-item label="内容">
          <v-md-editor
              v-model="articleDetail.content"
              height="600px"
              :disabled-menus="[]"
              @upload-image="handleUploadMdImage"
          ></v-md-editor>
          <span>字数：{{articleDetail.content.length}}</span>
        </a-form-item>

        <a-form-item style="text-align: center">
          <a-button @click="handleUpdateArticle" size="large" type="">提 交 更 新</a-button>
        </a-form-item>
      </a-form>
    </a-page-header>
  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import {ArticleCard} from "../model/ArticleCard";
import {getArticleEsByArticleId, updateArticle} from "../api/article";
import {policy} from "../api/policy";
import {getUUID} from "../utils/uuid";
import request from "umi-request";
import {message} from "ant-design-vue";
import {ArticleEditBody} from "../model/ArticleEditBody";
import {getUserType} from "../auth/auth";

const router = useRouter();
const route:any = useRoute();
//加载文章内容
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

const loadArticleDetail = async () => {
  const articleId = parseInt(route.params.aid);
  const res:any = await getArticleEsByArticleId(articleId);
  if (res.code == 200 && res.data){
    articleDetail.value = res.data;
  }
}
loadArticleDetail();

//markdown编辑器上传图片
const handleUploadMdImage = async (event: Event, insertImage: any, files: File[]) => {
  console.log(files)
  console.log(event)
  console.log(insertImage)
  //进行oss文件上传
  //1.获取oss签名
  const res: any = await policy();
  console.log(files[0].name);
  if (res.code === 200 && res.data) {
    //2.使用formData 来上传图片
    const formData = new FormData();
    const key = res.data.dir + getUUID() + `_${files[0].name}`
    formData.append("policy",res.data.policy)
    formData.append("signature",res.data.signature)
    formData.append("OSSAccessKeyId",res.data.accessKeyId)
    formData.append("key",key)
    formData.append("dir",res.data.dir);
    formData.append("host",res.data.host)
    formData.append("file",files[0])

    const response = await request("https://eshare-resources.linjsblog.top", {
      method: 'post',
      data: formData
    });

    console.log(response)
    //3.文本中插入图片
    insertImage({
      url: "http://eshare-resources.linjsblog.top"+ '/' + key,
      desc: files[0].name
    })
  }
}

//提交更新
const handleUpdateArticle =async () => {
  //文章和标题不能为空
  if (!articleDetail.value.articleTitle || !articleDetail.value.content) {
    message.warn("文章和标题不能为空");
    return;
  } else if (articleDetail.value.content.length > 20000) {
    message.warn("文章长度不能超过20000字");
    return;
  }
  const articleEditBody:ArticleEditBody = {
    articleId: articleDetail.value.articleId,
    articleTitle: articleDetail.value.articleTitle,
    content: articleDetail.value.content
  }

  const res:any = await updateArticle(articleEditBody);
  if (res.code == 200 &&res.data){
    message.success("提交成功");
    const userType = getUserType();
    await router.push("/personalCenter/"+userType.userId+"/postList");
  }else {
    message.error("更新失败");
  }
}

</script>

<style scoped>

</style>
