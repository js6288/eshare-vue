<template>
  <div class="personal-center-main">
    <personal-canter-sub-header headName="上传头像"/>
    <div class="upload-avatar">
      <a-avatar :size="144" :src="head">

      </a-avatar>

    </div>
    <div class="save-avatar-btn">
      <a-upload
          v-model:file-list="fileList"
          list-type="picture"
          :max-count="1"
          action="http://eshare-resources.linjsblog.top"
          :before-upload="beforeUpload"
          :data="dataObj"
          @preview="handlePreview"
          @change="handleUploadSuccess"
      >
        <a-button>
          <upload-outlined></upload-outlined>
          上传头像
        </a-button>
      </a-upload>
      <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>

      <a-button style="margin-top: 50px" @click="submitAvatar" v-if="fileList.length>0" size="large" type="primary">保存更改</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import head from "../../assets/xiaoheizi.jpeg"
import PersonalCanterSubHeader from "../../components/PersonalCanterSubHeader.vue";
import {message, Upload, UploadChangeParam, UploadProps} from "ant-design-vue";
import {ref} from "vue";
import currentUserDetailStore from "../../store/modules/CurrentUserDetailStore";
import {storeToRefs} from "pinia";
import {CurrentUserDetail} from "../../model/CurrentUserDetail";
import {policy} from "../../api/policy";
import {getUUID} from "../../utils/uuid";
import {getBase64} from "../../utils/file";
import {updateAvatar} from "../../api/user";
import {getUserType, setUserType} from "../../auth/auth";
//获取当前用户头像
const currentUserStore = currentUserDetailStore();
const {currentUserDetail} = storeToRefs(currentUserStore);

const head = ref();
const getAvatar =async ()=>{
  const res:any = await currentUserStore.getAndSetCurrentUserDetail();
  head.value = res.value?.avatarUrl;
}
getAvatar();

const fileList:any = ref<UploadProps['fileList']>([
]);

const beforeUpload: UploadProps['beforeUpload'] = async file => {
  const isLt2M = file.size / 1024 / 1024 < 2;
  // 获取文件后缀名
  const fileExt = file.name.replace(/.+\./, "");
  console.log(fileExt)
  const isImage = !(['png', 'jpg', 'jpeg', 'webp'].indexOf(fileExt.toLowerCase()) === -1);
  console.log(isImage)
  if (!isImage) {
    message.error(`${file.name} 不是图片或不支持该格式，请选择合适的图片格式上传`);
    return Upload.LIST_IGNORE;
  }
  if (!isLt2M) {
    message.warn("请不要上传超过2M的文件")
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

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const handlePreview = async (file: UploadProps['fileList'][number]) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
  console.log(fileList)
};

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
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

const dataObj = {
  policy: '',
  signature: '',
  key: '',
  OSSAccessKeyId: '',
  dir: '',
  host: '',
}

const submitAvatar = async ()=>{
  const avatarUrl = fileList.value.pop().url;
  const res:any = await updateAvatar(avatarUrl);
  if (res.code === 200){
    message.success("更新成功",0.5).then(()=>{
      //修改localStorage的用户头像
      const userType = getUserType();
      userType.avatarUrl = avatarUrl;
      setUserType(userType);
      location.href = window.location.href;
    })
  }else {
    message.error(res.description||res.message);
  }
}
</script>

<style scoped>
.personal-center-main{
  padding: 20px 10px 10px 10px;
}
.upload-avatar{
  margin-top: 30px;
  text-align: center;
}
.save-avatar-btn{
  margin-top: 20px;
  text-align: center;
}
</style>
