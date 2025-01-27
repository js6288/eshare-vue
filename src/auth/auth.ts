import {UserToken} from "../model/token";
import {UserType} from "../model/user";
import {getCurrentUserDetails} from "../api/user";

const AccessTokenKey = "access_token";
const RefreshTokenKey = "refresh_token";

const LoginUser = "loginUser";

//保存 access_token 和 refresh_token
export function setToken(token: UserToken) {
    localStorage.setItem(AccessTokenKey,token.accessToken)
    localStorage.setItem(RefreshTokenKey,token.refreshToken)
}

//获取access_token
export function getAccessToken(){
   return localStorage.getItem(AccessTokenKey);
}

//获取refresh_token
export function getRefreshToken(){
    return localStorage.getItem(RefreshTokenKey);
}

//缓存用户信息
export function setUserType(loginUser:UserType){
    return localStorage.setItem(LoginUser,JSON.stringify(loginUser))
}

//TODO 刷新localStorage的用户信息
export function updateUserLocal() {
    // getCurrentUserDetails();
}



export function getUserType(){
    const item = localStorage.getItem(LoginUser);
    if(item != null){
        return JSON.parse(item)
    }else {
        return "";
    }

}

//退出登录
export function userLogout(){
    localStorage.removeItem(AccessTokenKey);
    localStorage.removeItem(RefreshTokenKey);
    localStorage.removeItem(LoginUser);
}
