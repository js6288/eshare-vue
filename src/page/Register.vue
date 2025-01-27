<template>
  <div class="register-page-card">
    <a-card class="register-card" hoverable>
      <h2 style="text-align: center;font-weight: 700">注册</h2>
      <a-form
          name="registerFrom"
          style="margin: 20px 60px"
      >
        <a-form-item name="username" v-bind="validateInfos.username">
          <a-input size="large" v-model:value="registerUser.username" placeholder="请输入用户名"/>
        </a-form-item>
        <a-form-item name="nickname" v-bind="validateInfos.nickname">
          <a-input size="large" v-model:value="registerUser.nickname" placeholder="请输入昵称"/>
        </a-form-item>
        <a-form-item name="password" v-bind="validateInfos.password">
          <a-input-password size="large" @blur="validate('password', { trigger: 'blur' }).catch(() => {})" v-model:value="registerUser.password" autocomplete="autocomplete" placeholder="8-16位密码，区分大小写"/>
        </a-form-item>
        <a-form-item name="confirmPassword" v-bind="validateInfos.confirmPassword">
          <a-input-password size="large" v-model:value="registerUser.confirmPassword" autocomplete="autocomplete" placeholder="确认密码"/>
        </a-form-item>
        <a-form-item name="phone" v-bind="validateInfos.phone">
          <a-input size="large" v-model:value="registerUser.phone" placeholder="请输入手机号"/>
        </a-form-item>
        <a-form-item
            name="phoneCode"
            v-bind="validateInfos.phoneCode"
        >
          <a-input
              placeholder="验证码"
              v-model:value="registerUser.phoneCode"
              size="large"
              style="width: 60%;float: left"
          >
            <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
          </a-input>

          <a-button @click="getVerificationCode" :disabled="disabled" style="width: 38%;float: right;text-align: center" size="large">
            {{ btnTxt }}
          </a-button>


        </a-form-item>
        <a-form-item :wrapper-col="{ span:0, offset: 0 }">
          <div style="display: flex;align-items: center;">
            <a-button size="large" type="primary" html-type="submit" @click.prevent="onSubmit">注册</a-button>
            <a-button size="large" style="margin-left: 10px" @click="resetFields">重置</a-button>
            <router-link to="/login" style="margin-left: 70px">使用已有账号登录</router-link>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref, toRaw} from "vue";
import {Form, message} from "ant-design-vue";
import {isMobile} from "../utils/validate";
import {getSmsCode} from "../api/sms";
import {Rule} from "ant-design-vue/es/form";
import {commonRegister} from "../api/register";
import {setToken, setUserType} from "../auth/auth";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 24 },
};
const useForm = Form.useForm;
interface RegisterUser{
  username: string;
  nickname: string;
  password: string;
  confirmPassword: string;
  phone: string;
  phoneCode: string
  uuid: string
}
const registerUser = reactive<RegisterUser>({
  username: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  phone: '',
  phoneCode: '',
  uuid: ''
});

//获取短信验证码文本
let btnTxt = ref("获取验证码");
let disabled = ref(false);
//计时器
let time = ref(0);

let validatePass2 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请再次输入密码');
  } else if (value !== registerUser.password) {
    return Promise.reject("两次密码不一致!");
  } else {
    return Promise.resolve();
  }
};

//校验手机号是否合法
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

const rules = reactive({
  username: [{required: true,message: '请输入用户名'}],
  nickname: [{required: true,message: '请输入昵称'}],
  password: [{required: true,message: '请输入密码'},{
    min: 8,
    max: 16,
    message: '密码必须8-16位',
    trigger: 'blur',
  }],
  confirmPassword: [{validator:validatePass2,trigger: 'change'}],
  phone: [{required: true,validator:validatePhone}],
  phoneCode: [{required: true,message: '请输入短信验证码'}],
});



const {resetFields,validate, validateInfos } = useForm(registerUser, rules);

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
  if (!registerUser.phone) {
    //手机号码不能为空
    message.warn("请输入手机号码");
    return;
  } else if (!isMobile(registerUser.phone)) {
    //此处失去焦点后自动触发手机校验规则
  } else {
    //手机校验通过发送验证码
    time.value = 60;
    disabled.value = true;
    //调用计时器方法
    timer();
    //调用短信验证码接口
    const res = await getSmsCode(registerUser.phone);
    //@ts-ignore
    if (res.code === 200 && res.data) {
      message.success("短信发送成功，请注意在手机上查收")
      registerUser.uuid = res.data;
    }else {
      message.error("短信发送失败，请检查手机号是否正确")
    }
  }
}

const onSubmit = () => {
  validate()
      .then(async () => {
        //请求接口
        const res:any = await commonRegister(registerUser);
        if (res.code === 200 && res.data){
          //保存token
          setToken(res.data.token);
          //保存用户信息
          setUserType(res.data.userVO);
          //TODO 路由到主页或之前的页面
          window.location.href = "/";
        }else {

        }
      })
      .catch(err => {
        message.error(err.errorFields[0].errors[0]);
        console.log('error', err);
      });
}
</script>

<style lang="scss" scoped>
.register-page-card{
  width: 500px;
  margin: 50px auto;
}
.register-card{
  cursor: auto;
}
</style>
