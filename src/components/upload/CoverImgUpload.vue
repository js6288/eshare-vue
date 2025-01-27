<template>
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
</template>

<script lang="ts" setup>

import {ref} from "vue";
import {message, Upload, UploadProps} from "ant-design-vue";
import {policy} from "../../api/policy";
import {getUUID} from "../../utils/uuid";

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

const fileList = ref<UploadProps['fileList']>([
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

  const res = await policy();
  if (res.code === 200 && res.data) {
    dataObj.policy = res.data.policy;
    dataObj.signature = res.data.signature;
    dataObj.OSSAccessKeyId = res.data.accessKeyId;
    dataObj.key = res.data.dir + getUUID() + `_${file.name}`
    dataObj.dir = res.data.dir;
    dataObj.host = res.data.host;
  }
};

const handleUploadSuccess :UploadProps['beforeUpload'] =  (res:any) => {
  if (res?.file.status === "done"){//如果上传成功

    // const file = fileList.value?.pop();
    //设置下载地址
    const pop:any = fileList.value?.pop();
    pop.url = "http://eshare-resources.linjsblog.top"+ '/' + dataObj.key
    fileList.value?.push(pop);


    console.log(fileList.value)
  }
}



</script>

<style scoped>

</style>
