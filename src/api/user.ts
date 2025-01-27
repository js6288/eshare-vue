import myAxios from "../plugins/myAxios";
import {ResetPasswordBody} from "../model/ResetPasswordBody";

//获取当前用户详细信息
export function getCurrentUserDetails(){
    return myAxios({
        url: '/user/current',
        method: 'get',
        headers:{
            isRefreshToken: false
        }
    })
}

//根据用户id获取用户信息
export function getUserById(id:number){
    return myAxios({
        url: '/user/safety/'+id,
        method: 'get',
        headers:{
            isRefreshToken: false,
            isAccessToken: false
        }
    })
}

//提交头像
export function updateAvatar(url:string){
    return myAxios({
        url: '/user/avatar',
        method: 'put',
        headers:{
            isRefreshToken: false
        },
        params:{
            avatarUrl: url
        }
    })
}

//绑定手机号
export function bindingPhone(phone:string,code:string,uuid:string){
    return myAxios({
        url: '/user/phone',
        method: 'put',
        headers:{
            isRefreshToken: false
        },
        params:{
            phone: phone,
            code: code,
            uuid: uuid
        }
    })
}

//更新用户接口
export function updateUserDetail(updateUserBody:any){
    return myAxios({
        url: '/user/update/self',
        method: 'put',
        headers:{
            isRefreshToken: false
        },
        data: updateUserBody
    })
}

//重置密码接口
export function resetPassword(resetPasswordBody:ResetPasswordBody){
    return myAxios({
        url: '/user/password',
        method:'put',
        headers:{
            isRefreshToken: false
        },
        data: resetPasswordBody
    })
}

//获取当前用户积分
export function getCurrentUserPoint(){
    return myAxios({
        url: '/user/accumulatePoints',
        method: 'get',
        headers:{
            isRefreshToken: false
        }
    })
}
