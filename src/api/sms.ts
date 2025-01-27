import myAxios from "../plugins/myAxios";

//获取手机验证码
export function getSmsCode(phone:String){
    return myAxios({
        url: '/sms/sendSms',
        method: 'get',
        params:{
            phone: phone
        },
        headers: {
            isAccessToken: false,
            isRefreshToken: false
        }
    })
}
