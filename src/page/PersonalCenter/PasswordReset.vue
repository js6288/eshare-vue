<template>
  <div class="personal-center-main">
    <personal-canter-sub-header headName="密码重置"/>
    <div class="change-password-form">
      <a-form>
        <a-form-item v-bind="validateInfos.newPassword">
          <a-input-password v-model:value="resetPasswordBody.newPassword" size="large" placeholder="请输入密码">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" style="color: rgba(0, 0, 0, 0.25)"/>
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item v-bind="validateInfos.confirmPassword">
          <a-input-password v-model:value="resetPasswordBody.confirmPassword" size="large" placeholder="请重新输入密码">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" style="color: rgba(0, 0, 0, 0.25)"  />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item
            name="phone"
            v-bind="validateInfos.phone"
        >
          <a-input v-model:value="resetPasswordBody.phone" placeholder="请输入手机号"  size="large">
            <template #prefix><PhoneOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
          </a-input>
        </a-form-item>

        <a-form-item
            name="verificationCode"
            v-bind="validateInfos.code"
        >
          <a-input
              placeholder="验证码"
              size="large"
              style="width: 60%;float: left"
              v-model:value="resetPasswordBody.code"
          >
            <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
          </a-input>

          <a-button @click="getVerificationCode" :disabled="disabled" style="width: 38%;float: right;text-align: center" size="large">
            {{ btnTxt }}
          </a-button>

        </a-form-item>
        <a-form-item>
          <a-button block danger size="large" @click="onSubmit">提交</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PersonalCanterSubHeader from "../../components/PersonalCanterSubHeader.vue";
import {reactive, ref} from "vue";
import {ResetPasswordBody} from "../../model/ResetPasswordBody";
import {Form, message} from "ant-design-vue";
import {isMobile} from "../../utils/validate";
import {getSmsCode} from "../../api/sms";
import {Rule} from "ant-design-vue/es/form";
import {resetPassword} from "../../api/user";

const useForm = Form.useForm;

const resetPasswordBody = ref({
  code: "",
  newPassword: "",
  confirmPassword:"",
  phone: "",
  uuid: ""
})


//校验密码是否一致
let validatePass2 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请再次输入密码');
  } else if (value !== resetPasswordBody.value.newPassword) {
    return Promise.reject("两次密码不一致!");
  } else {
    return Promise.resolve();
  }
};



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

//获取手机验证码
const getVerificationCode = async () => {
  if (!resetPasswordBody.value.phone) {
    //手机号码不能为空
    message.warn("请输入手机号码");
    return;
  } else if (!isMobile(resetPasswordBody.value.phone)) {
    //此处失去焦点后自动触发手机校验规则
  } else {
    //手机校验通过发送验证码
    time.value = 60;
    disabled.value = true;
    //调用计时器方法
    timer();
    //调用短信验证码接口
    const res = await getSmsCode(resetPasswordBody.value.phone);
    //@ts-ignore
    if (res.code === 200 && res.data) {
      message.success("短信发送成功，请注意在手机上查收")
      resetPasswordBody.value.uuid = res.data;
    }else {
      message.error("短信发送失败，请检查手机号是否正确")
    }
  }
}

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

//校验规则
const rules = reactive({
  newPassword:[{required: true,message: '请输入密码'},{
    min: 8,
    max: 16,
    message: '密码必须8-16位',
    trigger: 'blur',
  }],
  confirmPassword: [{validator:validatePass2,trigger: 'change'}],
  phone: [{required: true,validator:validatePhone}],
  code: [{required: true,message: '请输入短信验证码'}]
})

const {resetFields,validate, validateInfos } = useForm(resetPasswordBody,rules)


const onSubmit = () => {
  validate().then(async ()=>{
    //请求接口
    const res:any = await resetPassword(resetPasswordBody.value);
    if (res.code === 200 && res.data === true){
      message.success("重置密码成功");
      resetFields();
    }else {
      message.error(res.description||res.message)
    }
  })
}
</script>

<style scoped>
.personal-center-main{
  padding: 20px 10px 10px 10px;
}
.change-password-form{
  width: 400px;
  margin: 50px auto;
}
</style>
