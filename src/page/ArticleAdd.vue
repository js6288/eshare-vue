<template>
  <div>
    <a-page-header
        style="border: 0 solid rgb(235, 237, 240);background: #ffffff"
        title="发表文章"
        sub-title=""
        @back="() => $router.go(-1)"
    >
      <a-form>
          <a-form-item
            label="标题"
          >
            <a-input v-model:value="articleTitle"  size="large" show-count :maxlength="30" placeholder="请输入标题，标题不多于30字"/>
          </a-form-item>
          <a-form-item label="内容">
            <v-md-editor
                v-model="text"
                height="600px"
                :disabled-menus="[]"
                @upload-image="handleUploadMdImage"
            ></v-md-editor>
            <span>字数：{{text.length}}</span>
          </a-form-item>
          <a-form-item label="添加标签">
            <template v-for="(tag, index) in state.tags" :key="tag">
              <a-tooltip v-if="tag.length > 20" :title="tag">
                <a-tag color="blue" closable @close="handleClose(tag)">
                  {{ `${tag.slice(0, 20)}...` }}x`
                </a-tag>
              </a-tooltip>
              <a-tag color="blue" v-else closable @close="handleClose(tag)">
                {{ tag }}
              </a-tag>
            </template>
            <a-input
                v-if="state.inputVisible"
                ref="inputRef"
                v-model:value="state.inputValue"
                class="define-tag"
                size="small"
                type="text"
                :maxlength="30"
                placeholder="自定义标签"
                @blur="handleInputConfirm"
                @keyup.enter="handleInputConfirm"
            />
            <a-tag v-else style="background: #fff; border-style: dashed" @click="showInput">
              <plus-outlined />
              New Tag
            </a-tag>
          </a-form-item>
          <a-form-item label="选择标签">
            <a-space direction="vertical">
              <a-select
                  v-model:value="value"
                  mode="multiple"
                  style="width: 600px"
                  placeholder="选择平台默认标签"
                  @focus="getDefaultTags"
                  :max-tag-text-length="15"
                  :options="options"
                  @select="consoleSelect"
              ></a-select>
            </a-space>
          </a-form-item>
          <a-form-item label="封面图片">

            <a-upload
                v-model:file-list="fileList"
                action="http://eshare-resources.linjsblog.top"
                list-type="picture-card"
                @preview="handlePreview"
                :before-upload="beforeUpload"
                :data="dataObj"
                @change="handleUploadSuccess"
            >
              <div v-if="fileList.length < 3">
                <plus-outlined />
                <div style="color: #666666;font-size: 14px">上传封面</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
            <div style="color: #777888">最多上传三张封面图片，图片大小不要超过3M，支持 'png', 'jpg', 'jpeg', 'webp', 'svg' 格式</div>
          </a-form-item>
          <a-form-item style="text-align: center">
            <a-button @click="submitArticle" size="large" type="">点击发布文章</a-button>
          </a-form-item>
      </a-form>
    </a-page-header>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, nextTick} from "vue";
import {SelectProps, UploadProps, message, Upload, UploadChangeParam} from "ant-design-vue";
import useDefaultTagsStore from "../store/modules/DefaultTags";
import {storeToRefs} from "pinia";
import {policy} from "../api/policy";
import {getUUID} from "../utils/uuid";
import request from 'umi-request';
import {ArticleAddBody} from "../model/ArticleAddBody";
import {addArticle} from "../api/article";
import {useRouter} from "vue-router";
import {getUserType} from "../auth/auth";

const router = useRouter();
const articleTitle = ref("")

const text = ref('');
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

    const response = await request("http://eshare-resources.linjsblog.top", {
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

const inputRef = ref();
//自定义标签
const state = reactive({
  tags: [],
  inputVisible: false,
  inputValue: '',
});

const handleInputConfirm = () => {
  if (!validateTagsNum(5)){
    state.inputVisible = false;
    return;
  }
  const inputValue:any = state.inputValue;
  let tags:any = state.tags;
  if (inputValue && tags.indexOf(inputValue) === -1) {
    tags = [...tags, inputValue];
  }
  console.log(tags);
  Object.assign(state, {
    tags,
    inputVisible: false,
    inputValue: '',
  });
};
const handleClose = (removedTag: string) => {
  const tags = state.tags.filter(tag => tag !== removedTag);
  console.log(tags);
  state.tags = tags;
};
const showInput = () => {
  state.inputVisible = true;
  nextTick(() => {
    inputRef.value.focus();
  });
};

//已选择的标签
const value = ref([])
// //已选择的标签id
// const systemTagIdList = ref<number[]>([])
const options = ref<SelectProps['options']>([]);

//状态库中获取默认标签
const defaultTagsStore = useDefaultTagsStore()
const {defaultTags} = storeToRefs(defaultTagsStore);
const getDefaultTags = () => {
  defaultTagsStore.getAndSetDefaultTags().then(
      (res:any)=>{
        const tempList = [];
        for (let i = 0; i < res.value.length; i++) {
          // console.log(res.value[i]);
          //添加标签搭配options中
          const value = res.value[i].tagName+":"+res.value[i].id;
          tempList.push({
            label: res.value[i].tagName,
            value
          })
          // options.value?.push({
          //   label: res.value[i].tagName,
          //   value
          // })
        }
        options.value = tempList;
      }
  );
}

const consoleSelect = () => {
  if(!validateTagsNum(6)){
    value.value.pop();
  }
}

//判断系统标签和自定义标签是否超过5个 超过则返回false
const validateTagsNum = (maxNum:number)=>{
  const systemTagNum = value.value.length;
  const userDefTagNum = state.tags.length;
  if (systemTagNum+userDefTagNum >= maxNum){
    message.warn("系统标签和自定义标签不能超过5个")
    return false;
  }
  return true;
}


// 上传封面图片
const dataObj = {
  policy: '',
  signature: '',
  key: '',
  OSSAccessKeyId: '',
  dir: '',
  host: '',
}

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const fileList:any = ref<UploadProps['fileList']>([
]);

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};
const handlePreview = async (file: UploadProps['fileList'][number]) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
  console.log(fileList)
};

const beforeUpload: UploadProps['beforeUpload'] = async file => {
  const isLt3M = file.size / 1024 / 1024 < 3;
  // 获取文件后缀名
  const fileExt = file.name.replace(/.+\./, "");
  console.log(fileExt)
  const isImage = !(['png', 'jpg', 'jpeg', 'webp', 'svg'].indexOf(fileExt.toLowerCase()) === -1);
  console.log(isImage)
  if (!isImage) {
    message.error(`${file.name} 不是图片或不支持该格式，请选择合适的图片格式上传`);
    return Upload.LIST_IGNORE;
  }
  if (!isLt3M) {
    message.warn("请不要上传超过3M的文件")
    return Upload.LIST_IGNORE;
  }

  const res:any = await policy();
  if (res.code === 200 && res.data) {
    dataObj.policy = res.data.policy;
    dataObj.signature = res.data.signature;
    dataObj.OSSAccessKeyId = res.data.accessKeyId;
    dataObj.key = res.data.dir + getUUID() + `_${file.name}`
    dataObj.dir = res.data.dir;
    dataObj.host = res.data.host;
  }
};

//上传成功的文件设置下载地址
const handleUploadSuccess =  (res:UploadChangeParam) => {
  if (res?.file.status === "done"){//如果上传成功

    // const file = fileList.value?.pop();
    //设置下载地址
    const pop:any = fileList.value?.pop();
    pop.url = "http://eshare-resources.linjsblog.top"+ '/' + dataObj.key
    fileList.value?.push(pop);
    console.log(fileList.value)
  }
}

//提交文章
const submitArticle = async () => {
  //文章和标题不能为空
  if (!articleTitle.value || !text.value) {
    message.warn("文章和标题不能为空");
    return;
  } else if (text.value.length > 20000) {
    message.warn("文章长度不能超过20000字");
    return;
  }
  const articleAddBody: ArticleAddBody = {
    articleTitle: articleTitle.value,
    content: text.value,
    orderImages: [],
    userTagList: [],
    systemTagIdList: []
  }
  //遍历 fileList 数组 添加url到orderImages
  for (let i = 0; i < fileList.value.length; i++) {
    if (fileList.value[i].status == 'done'){

      let url: string | any = fileList.value[i]?.url;
      articleAddBody.orderImages.push(url);
    }
  }
  //拷贝systemTagIdList数组
  //将已选择标签的id值拷贝到articleAddBody的systemTagIdList
  for (let i = 0; i < value.value.length; i++) {
      const valueElement:string = value.value[i];
      const colonIndex = valueElement.lastIndexOf(":");
      const s = valueElement.substring(colonIndex+1);
      articleAddBody.systemTagIdList.push(parseInt(s))
  }
  //拷贝userTagList数组
  articleAddBody.userTagList = state.tags.slice();

  const res: any = await addArticle(articleAddBody);
  if (res.code === 200) {
    message.success("提交成功");
    const userType = getUserType();
    await router.push("/personalCenter/"+userType.userId+"/postList");
  } else {
    message.error(res.description)
  }
}


</script>

<style scoped>
.define-tag{
  width: 100px;
}
</style>
