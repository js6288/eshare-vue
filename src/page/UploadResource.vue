<template>
  <a-page-header
      style="border: 0 solid rgb(235, 237, 240);background: #ffffff"
      title="上传资源"
      sub-title=""
      @back="() => $router.go(-1)"
  >
    <a-form style="margin-left: 60px">
      <a-form-item label="上传资源" :wrapper-col="{span: 16}">
        <a-upload-dragger
            v-model:fileList="fileList"
            name="file"
            :multiple="false"
            action="http://eshare-resources.linjsblog.top"
            :before-upload="beforeUpload"
            :data="dataObj"
            :max-count="1"
            @change="handleUploadChange"
        >
          <p class="ant-upload-drag-icon">
            <inbox-outlined></inbox-outlined>
          </p>
          <p class="ant-upload-text">单击或拖动文件到此区域进行上传
          </p>
          <p class="ant-upload-hint">
            一次只能上传一个文件，如果要上传多个文件请上传压缩包
          </p>
        </a-upload-dragger>
      </a-form-item>
      <a-form-item label="资源名称" :wrapper-col="{span: 16}">
        <a-input size="large" v-model:value="resourceTitle"  show-count :maxlength="30"  placeholder="资源标题不能超过30字" allow-clear />
      </a-form-item>
      <a-form-item label="资源描述" :wrapper-col="{span: 16}">
        <a-textarea size="large" v-model:value="resourceDescription" :rows="8" show-count :maxlength="500" placeholder="资源描述不能超过500字" allow-clear />
      </a-form-item>
      <a-form-item label="资源标签" >
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
      <a-form-item label="所属分类" >
        <a-select
            ref="select"
            v-model:value="value1"
            style="width: 200px"
            :options="options1"
            size="large"
            show-search
            @focus="getDefaultResourceTags"
        ></a-select>
      </a-form-item>
      <a-form-item label="所属专业" >
        <a-select
            ref="select"
            size="large"
            v-model:value="value2"
            style="width: 200px"
            :options="options2"
            show-search
            @focus="getMajorList"
        ></a-select>
      </a-form-item>
      <a-form-item label="发布形式" >
        <a-radio-group v-model:value="checked" @change="resourceTypeChange">
          <a-radio :value="0">免费资源</a-radio>
          <a-radio :value="1">积分资源</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="所需积分" >
        <a-input-number size="large" :disabled="disabled" id="inputNumber" v-model:value="coin" :min="0" :max="200" />
      </a-form-item>
      <a-form-item style="text-align: center">
        <a-button @click="submitResource" style="width: 200px"  size="large" type="primary">提交</a-button>
      </a-form-item>
    </a-form>
  </a-page-header>
</template>

<script lang="ts" setup>
import {nextTick, reactive, ref} from "vue";
import {message, SelectProps, Upload, UploadChangeParam, UploadProps} from "ant-design-vue";
import {policy} from "../api/policy";
import {getUUID} from "../utils/uuid";
import useDefaultResourceTagsStore from "../store/modules/DefaultResourceTags";
import {storeToRefs} from "pinia";
import useMajorStore from "../store/modules/Major";
import {ResourceCommitBody} from "../model/ResourceCommitBody";
import {commitResource} from "../api/resource";
import {useRouter} from "vue-router";
import {getUserType} from "../auth/auth";

const resourceTitle = ref("")
const resourceDescription = ref("");

// 上传封面图片
const dataObj = {
  policy: '',
  signature: '',
  key: '',
  OSSAccessKeyId: '',
  dir: '',
  host: '',
}

const beforeUpload: UploadProps['beforeUpload'] = async file => {
  const isLt1000M = file.size / 1024 / 1024 < 1000;
  // // 获取文件后缀名
  // const fileExt = file.name.replace(/.+\./, "");
  // console.log(fileExt)
  // const isImage = !(['png', 'jpg', 'jpeg', 'webp', 'svg'].indexOf(fileExt.toLowerCase()) === -1);
  // console.log(isImage)
  // if (!isImage) {
  //   message.error(`${file.name} 不是图片或不支持该格式，请选择合适的图片格式上传`);
  //   return Upload.LIST_IGNORE;
  // }
  if (!isLt1000M) {
    message.warn("请不要上传超过1000M的文件")
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

const handleUploadChange = (info: UploadChangeParam) => {
  const status = info.file.status;
  if (status !== 'uploading') {
    // console.log(info.file, info.fileList);
  }
  if (status === 'done') {
    message.success(`${info.file.name} 上传成功.`);
    //设置下载地址
    const pop:any = fileList.value?.pop();
    pop.url = "http://eshare-resources.linjsblog.top"+ '/' + dataObj.key
    fileList.value?.push(pop);
    // console.log(fileList);
  } else if (status === 'error') {
    message.error(`${info.file.name} 文件上传失败.`);
    // console.log(fileList);
  }
};

const fileList:any = ref([]);

const inputRef = ref();
const state = reactive({
  tags: [],
  inputVisible: false,
  inputValue: '',
});

const handleInputConfirm = () => {
  //用户自定义标签不能超过5个
  if (!validateTagsNum(5)){
    state.inputVisible = false;
    return;
  }
  const inputValue = state.inputValue;
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


//判断自定义标签是否超过5个 超过则返回false
const validateTagsNum = (maxNum:number)=>{
  const userDefTagNum = state.tags.length;
  if (userDefTagNum >= maxNum){
    message.warn("自定义标签不能超过5个")
    return false;
  }
  return true;
}
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


//已选择的分类值"tagName:id"
const value1 = ref('')
//分类
const options1 = ref<SelectProps['options']>([]);
//从状态库中获取默认标签
const resourceTagsStore = useDefaultResourceTagsStore();
const {defaultResourceTags} = storeToRefs(resourceTagsStore);
// //已选择的分类id（默认标签id）
// const defaultResourceTagId = ref<number>();
const getDefaultResourceTags = ()=>{
  resourceTagsStore.getAndSetDefaultResourceTags().then(
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
          // options1.value?.push({
          //   label: res.value[i].tagName,
          //   value
          // })
        }
        options1.value = tempList;
      }
  )
}
// const consoleSelect = ()=>{
//   const length = value1.value.length;
//   //提取出标签最后一个冒号的数字，就是系统默认标签的id
//   const valueElement:string = value1.value[length-1];
//   const colonIndex = valueElement.lastIndexOf(":");
//   const s = valueElement.substring(colonIndex+1);
//   defaultResourceTagId.value = parseInt(s);
//   console.log(defaultResourceTagId.value)
// }


//已选择的专业
const value2 = ref<string>('')
//专业options
const options2 = ref<SelectProps['options']>([]);
//从状态库中获取专业列表
const MajorStore = useMajorStore();
const {majorList} = storeToRefs(MajorStore);

const getMajorList = () => {
  MajorStore.getAndSetMajorList().then((res:any)=>{
    const tempList = [];
    for (let i = 0; i < res.value.length; i++) {
      // console.log(res.value[i]);
      //添加标签搭配options中
      const value = res.value[i].tagName+":"+res.value[i].id;
      tempList.push({
        label: res.value[i].tagName,
        value
      })
      // options2.value?.push({
      //   label: res.value[i].tagName,
      //   value
      // })
    }
    options2.value = tempList;
  })
}

// const consoleSelect2 = () => {
//   const length = value2.value.length;
//
//   //提取出标签最后一个冒号的数字，就是系统默认标签的id
//   const valueElement:string = value2.value[length-1];
//   // console.log(valueElement);
//   const colonIndex = valueElement.lastIndexOf(":");
//   const s = valueElement.substring(colonIndex+1);
//   selectMajorId.value = parseInt(s);
//   // console.log(selectMajorId.value)
// }


// const handleChange = (value: string) => {
//   console.log(`selected ${value}`);
// };


//免费资源:0  积分资源1
const checked = ref(0)
//所需积分
const coin = ref<number>(0);
//是否禁用所需积分输入框
const disabled = ref(true);
// 单选框选项发生变化时的回调
const resourceTypeChange = (e:Event) => {
  //获取当前单选框所选的资源
  const radioSelectKey = parseInt((e.target as HTMLInputElement).value);
  //如果选择的时免费资源就禁用积分数字输入框，清空所需积分
  if(radioSelectKey === 0){
    disabled.value = true;
    coin.value = 0;
  }else {
    disabled.value = false;
  }
}

const router = useRouter();

//提交
const submitResource = async () => {
  console.log(fileList.value[0]);
  //fileList不能为空
  if (fileList.value.length === 0) {
    message.warn("请上传文件")
    return;
  }
  //资源名称不能为空
  if (resourceTitle.value.length === 0) {
    message.warn("资源名称不能为空")
    return;
  }

  const resourceCommitBody: ResourceCommitBody = {
    resourceName: resourceTitle.value,
    resourceDescription: resourceDescription.value,
    majorId: 0,
    type: checked.value,
    requirePoint: coin.value,
    downloadUrl: fileList.value[0].url,
    fileSize: fileList.value[0].size,
    fileType: fileList.value[0].name.replace(/.+\./, ""),
    userDefineTagList: state.tags.slice(),
    defaultResourceTagId: 0
  }

  //分类id
  console.log(value1.value)
  const valueElement: string = value1.value;
  const colonIndex = valueElement.lastIndexOf(":");
  const s = valueElement.substring(colonIndex + 1);
  resourceCommitBody.defaultResourceTagId = parseInt(s);
  //填充majorId
  console.log(value2.value);
  const valueElement2 = value2.value;
  const colonIndex2 = valueElement2.lastIndexOf(":");
  const s2 = valueElement2.substring(colonIndex2 + 1);
  resourceCommitBody.majorId = parseInt(s2);

  console.log(resourceCommitBody)

  //提交到后端
  const res:any = await commitResource(resourceCommitBody);
  if (res.code === 200){
    message.success("提交成功");
    const userType = getUserType();

    await router.push("/personalCenter/"+userType.userId+"/resourceList");
  }else {
    message.error(res.description)
  }


}

</script>

<style lang="scss" scoped>
.define-tag{
  width: 100px;
}
</style>
