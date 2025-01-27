import myAxios from "../plugins/myAxios";

//获取GitHub登录页地址
export function getGitHubUrl() {
    return myAxios({
        url: '/oauth/getGithubUrl',
        method: 'get',
        headers:{
            isAccessToken: false,
            isRefreshToken: false
        }
    })
}

//将code参数传递到后端，返回userResponse
export function loginByGitHub(code:string){
    return myAxios({
        url: '/oauth/login/github',
        method: 'post',
        params:{
            code:code
        },
        headers:{
            isAccessToken: false,
            isRefreshToken: false
        }
    })
}

//将code参数传递到后端,绑定Github账号
export function bindingGithub(code:string){
    return myAxios({
        url: '/oauth/binding/github',
        method: 'post',
        params:{
            code:code
        },
        headers:{
            isRefreshToken: false
        }
    })
}

//查询当前用户绑定的第三方平台
export function getUserThirdParty() {
    return myAxios({
        url: '/oauth/user/binds',
        method: 'get',
        headers:{
            isRefreshToken: false
        }
    })
}

//三方账号解绑
export function unbind(authType:string){
    return myAxios({
        url: '/oauth/unbind',
        method: 'post',
        headers:{
            isRefreshToken: false
        },
        params:{
            authType
        }
    })
}
