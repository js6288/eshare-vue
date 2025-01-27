import myAxios from "../plugins/myAxios";
//获取oss签名
export function policy(){
    return myAxios({
        url: '/oss/policy',
        method: 'get',
        headers: {
            isRefreshToken: false
        }
    })
}
