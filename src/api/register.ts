import myAxios from "../plugins/myAxios";
import {RegisterUser} from "../model/RegiserUser";

export function commonRegister(registerBody:RegisterUser) {
    return myAxios({
        url: 'register/common',
        method: 'post',
        data: {
            username: registerBody.username,
            nickname: registerBody.nickname,
            password: registerBody.password,
            phone: registerBody.phone,
            phoneCode: registerBody.phoneCode,
            uuid: registerBody.uuid
        },
        headers:{
            isAccessToken: false,
            isRefreshToken: false
        }
    })
}
