<template>
  <div class="personal-center-main">
    <personal-canter-sub-header headName="编辑资料"/>
    <div class="edit-account">
      <a-form :label-col="{ style: { width: '120px' } }">
        <a-form-item label="用户名">
          {{ username }}
        </a-form-item>
        <a-form-item label="昵称">
          <a-input v-model:value="updateUserBody.nickname" size="large">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" style="color: rgba(0, 0, 0, 0.25)"/>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="手机号">
          {{ phone }}
          <a @click="showModal" style="float: right" v-if="phone">更换手机</a>
          <a @click="showModal" style="float: right" v-else>绑定手机</a>
        </a-form-item>
        <a-form-item label="个性签名">
          <a-textarea :rows="4" v-model:value="updateUserBody.personalSignature" placeholder="最大长度不要超过60" :maxlength="60" >
          </a-textarea>
        </a-form-item>
        <a-form-item label="性别">
          <a-radio-group v-model:value="updateUserBody.gender">
            <a-radio  :value="0">男</a-radio>
            <a-radio  :value="1">女</a-radio>
            <a-radio  :value="2">保密</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="学校">
          <a-input v-model:value="updateUserBody.school" size="large"></a-input>
        </a-form-item>
        <a-form-item label="生日">
          <a-date-picker size="large" value-format="YYYY-MM-DD" v-model:value="updateUserBody.birthday" />
        </a-form-item>
        <a-form-item>
          <a-button @click="saveUpdate" size="large" type="primary" style="float: right">保存更改</a-button>
        </a-form-item>
      </a-form>
      <a-modal v-model:visible="visible" title="绑定手机号">
        <template #footer>
          <a-button key="back" @click="handleCancel">取消</a-button>
          <a-button key="submit" type="primary" @click="submitPhoneBind">绑定</a-button>
        </template>
        <a-form
            style="margin-top: 20px"
            :model="formPhoneState"
            name="basic"
            :label-col="{ span: 4 }"
            :wrapper-col="{ offset:4, span: 16 }"
            autocomplete="off"
        >
          <a-form-item
              name="phone" v-bind="validateInfos.phone"
          >
            <a-input placeholder="请输入手机号" v-model:value="formPhoneState.phone" size="large">
              <template #prefix><PhoneOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
            </a-input>
          </a-form-item>

          <a-form-item
              name="verificationCode"
              v-bind="validateInfos.verificationCode"
          >
            <a-input
                placeholder="验证码"
                v-model:value="formPhoneState.verificationCode"
                size="large"
                style="width: 60%;float: left"
            >
              <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
            </a-input>
            <a-button @click="getVerificationCode" :disabled="disabled" style="width: 38%;float: right;text-align: center" size="large">
              {{ btnTxt }}
            </a-button>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import { reactive} from 'vue';
import PersonalCanterSubHeader from "../../components/PersonalCanterSubHeader.vue";
import {FormPhoneState} from "../../model/FormPhoneState";
import {Rule} from "ant-design-vue/es/form";
import {isMobile} from "../../utils/validate";
import {Form, message} from "ant-design-vue";
import {getSmsCode} from "../../api/sms";
import {bindingPhone, updateUserDetail} from "../../api/user";
import currentUserDetailStore from "../../store/modules/CurrentUserDetailStore";
import {storeToRefs} from "pinia";
import dayjs, {Dayjs} from "dayjs";
import {setUserType} from "../../auth/auth";
const useForm = Form.useForm;
const desc = ref("系统原装签名，送给每一个小可爱~");
const checked = ref(0)

const value1 = ref();

const username = ref('')
const phone = ref('')
const updateUserBody = ref({
  nickname:'',
  personalSignature: '',
  school: '',
  birthday: '',
  gender: 0
})

//获取当前用户详细信息
const userDetailStore = currentUserDetailStore();
const {currentUserDetail} = storeToRefs(userDetailStore);
const loadCurrentUserDetail =async ()=>{
  const res:any = await userDetailStore.getAndSetCurrentUserDetail();
  username.value = res.value.username
  phone.value = res.value.phone
  updateUserBody.value.nickname = res.value.nickname;
  updateUserBody.value.gender = res.value.gender;
  updateUserBody.value.personalSignature = res.value.personalSignature;
  updateUserBody.value.school =res.value.school;
  updateUserBody.value.birthday = res.value.birthday;
}
loadCurrentUserDetail();


const visible = ref(false)
//打开绑定手机
const showModal = () => {
  visible.value = true;
  console.log("show")
};

const handleCancel = () => {
  visible.value = false;
  resetFields();
};


//校验手机号
const validatePhone = async (_rule: Rule, value: string)=>{
  if (value === ''){
    return Promise.reject('手机号不能为空');
  }
  //使用正则表达式进行验证手机号码
  else if (!isMobile(value)){
    return Promise.reject('请输入正确的手机号码');
  }
  else return Promise.resolve();
}

const formPhoneState = reactive<FormPhoneState>({
  phone: '',
  uuid: '',
  verificationCode: ''
})

//获取短信验证码文本
let btnTxt = ref("获取验证码");
let disabled = ref(false);
//计时器
let time = ref(0);

//计时器方法
const timer = ()=>{
  if (time.value > 0){
    time.value--;
    btnTxt.value = time.value + "s";
    setTimeout(timer,1000);
  }else {
    time.value = 0;
    btnTxt.value = "获取验证码";
    disabled.value = false;
  }
}

//获取短信验证码
const getVerificationCode = async () => {
  if (!formPhoneState.phone) {
    //手机号码不能为空
    message.warn("请输入手机号码");
    return;
  } else if (!isMobile(formPhoneState.phone)) {
    //此处失去焦点后自动触发手机校验规则
  } else {
    //手机校验通过发送验证码
    time.value = 60;
    disabled.value = true;
    //调用计时器方法
    timer();
    //调用短信验证码接口
    const res = await getSmsCode(formPhoneState.phone);
    //@ts-ignore
    if (res.code === 200 && res.data) {
      message.success("短信发送成功，请注意在手机上查收")
      formPhoneState.uuid = res.data;
    }else {
      message.error("短信发送失败，请检查手机号是否正确")
    }
  }
}
//手机表单校验规则
const phoneRules = reactive({
  phone: [{  validator: validatePhone }],
  verificationCode: [{required: true,message: '请输入短信验证码'}],
})


const {resetFields,validate, validateInfos} = useForm(formPhoneState,phoneRules)

const submitPhoneBind = ()=>{
  validate().then(async ()=>{
    //请求接口
    const res:any = await bindingPhone(formPhoneState.phone,formPhoneState.verificationCode,formPhoneState.uuid);
    if (res.code == 200 &&res.data){
        message.success("绑定成功")
        visible.value = false;
        resetFields();
        location.href = window.location.href
    }else {
      message.error(res.description||res.message);
    }
  })
}

//保存修改后的用户信息
const saveUpdate = async ()=>{
  console.log(updateUserBody.value);
  const res:any = await updateUserDetail(updateUserBody.value);
  if (res.code == 200 && res.data){
    message.success("更新成功")
    //更新localStorage
    const userVO = res.data;
    setUserType(userVO);
    location.href = window.location.href;
  }else {
    message.error(res.description||res.msg)
  }

}
</script>

<style scoped>
.personal-center-main{
  padding: 20px 10px 10px 10px;
}
.edit-account{
  margin-top: 30px;
  width: 500px;
}
</style>
