import myAxios from "../plugins/myAxios";
import {FormPasswordState} from "../model/FormPasswordState"
import {FormPhoneState} from "../model/FormPhoneState"

//账号密码登录
export function loginByPassword(formPasswordState:FormPasswordState){
    return myAxios({
        url: '/login/password',
        method: 'post',
        params: formPasswordState,
        headers: {
            isAccessToken: false,
            isRefreshToken: false
        }
    })
}

//刷新token
export function refreshToken() {
    return myAxios({
        url: 'login/refresh/token',
        method: 'post',
        headers: {
            isAccessToken: false,
            isRefreshToken: true
        }
    });

}

//手机号登录
export function loginByPhone(fromPhoneState:FormPhoneState){
    return myAxios({
        url: '/login/phone',
        method: 'post',
        params: {
            phone: fromPhoneState.phone,
            uuid: fromPhoneState.uuid,
            code: fromPhoneState.verificationCode
        },
        headers:{
            isAccessToken: false,
            isRefreshToken: false
        }
    })
}
