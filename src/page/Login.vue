<template>
  <div class="login-page">
    <a-card hoverable class="login-card mouse-hover">
      <a-tabs v-model:active-key="activeKey" style="margin:20px auto" centered>
        <a-tab-pane key="1" tab="密码登录">
          <a-form
              style="margin-top: 20px"
              :model="formPasswordState"
              name="basic"
              :label-col="{ span: 4 }"
              :wrapper-col="{ offset:4, span: 16 }"
              autocomplete="off"
              @finish="submitPasswordLoginFrom"
          >
            <a-form-item
                name="username"
                :rules="[{ required: true, message: '请输入用户名!' }]"
            >
              <a-input placeholder="用户名" v-model:value="formPasswordState.username" size="large">
                <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
              </a-input>
            </a-form-item>

            <a-form-item
                name="password"
                :rules="[{ required: true, message: '请输入密码!' }]"
            >
              <a-input-password
                  placeholder="密码"
                  v-model:value="formPasswordState.password"
                  size="large"
                  autocomplete="autocomplete"
              >
                <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
              </a-input-password>

            </a-form-item>


            <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
              <a-button size="large" type="primary" block html-type="submit">登录</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" tab="手机号登录" force-render>
          <a-form
              style="margin-top: 20px"
              :model="formPhoneState"
              name="basic"
              :label-col="{ span: 4 }"
              :wrapper-col="{ offset:4, span: 16 }"
              autocomplete="off"
              @finish="submitPhoneLoginFrom"
          >
            <a-form-item
                name="phone"
                :rules="[{  validator: validatePhone }]"
            >
              <a-input placeholder="手机号" v-model:value="formPhoneState.phone" size="large">
                <template #prefix><PhoneOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
              </a-input>
            </a-form-item>

            <a-form-item
                name="verificationCode"
                :rules="[{ required: true, message: '请输入验证码!' }]"
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

            <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
              <a-button size="large" type="primary" block html-type="submit">登录 / 注册</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
      <a-card-meta title="">
        <template #description>
          <div style="display: flex;align-items: center;margin-left: 65px;width: 350px">
            <span style="margin-right: 10px">其他登录方式</span>
            <a title="Github登录" @click="toGitHubLoginPage"><img src="../assets/github.svg" style="height: 20px"></a>
            <a-divider type="vertical" />
<!--            <a href="#"><img src="../assets/QQ.svg" style="height: 20px"></a>-->
            <a title="QQ登录" href="#"><img src="../assets/01_qq_logo.png" style="height: 20px"></a>
            <router-link to="/register" style="margin-left: 120px">注册账号</router-link>
          </div>

        </template>
      </a-card-meta>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {loginByPassword, loginByPhone} from "../api/login";
import {FormPasswordState} from "../model/FormPasswordState"
import {message} from "ant-design-vue";
import {useRoute, useRouter} from "vue-router";
import {setToken, setUserType} from "../auth/auth";
import {isMobile} from "../utils/validate";
import type { Rule } from 'ant-design-vue/es/form';
import {getSmsCode} from "../api/sms";
import {FormPhoneState} from "../model/FormPhoneState";
import {getGitHubUrl} from "../api/oauth";
const activeKey = ref('1')
const route = useRoute();
const router = useRouter();

//获取短信验证码文本
let btnTxt = ref("获取验证码");
let disabled = ref(false);
//计时器
let time = ref(0);


const formPhoneState = reactive<FormPhoneState>({
  phone: '',
  uuid: '',
  verificationCode: ''
})

const formPasswordState = reactive<FormPasswordState>({
  username: '',
  password: '',
});

const submitPasswordLoginFrom = async () => {

  const res = await loginByPassword(formPasswordState);

  // @ts-ignore
  if (res.code === 200 && res.data){

    //保存token
    setToken(res.data.token);
    //保存用户信息
    setUserType(res.data.userVO);
    //TODO 路由到主页或之前的页面
    window.location.href = "/";
  }else {
    message.error("用户名或密码不正确");
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

//手机号登录
const submitPhoneLoginFrom = async ()=>{

  if (!formPhoneState.uuid){
    message.warn("请先获取验证码");
    return;
  }
  const res:any = await loginByPhone(formPhoneState);

  //@ts-ignore
  if (res.code === 200 && res.data){
    //保存token
    setToken(res.data.token);
    //保存用户信息
    setUserType(res.data.userVO);
    //TODO 路由到主页或之前的页面
    window.location.href = "/";
  }else if (res.code === 40000){
    message.error(res.description)
  }else {
    message.error("登录失败请稍后重试")
  }

}

const toGitHubLoginPage = async () => {
  //获取GitHub登录地址
  const res: any = await getGitHubUrl();
  if (res.code == 200 && res.data) {
    const url = res.data;
    //跳转到GitHub登录地址
    window.location.href = url;
  } else {
    message.error("系统繁忙请稍后重试")
  }
}

</script>

<style lang="scss" scoped>
.login-page{

}
.login-card{
  margin: 80px auto;
  /*text-align: center;*/
  width: 500px;
  cursor: auto;
}
.mouse-hover{

}

</style>
