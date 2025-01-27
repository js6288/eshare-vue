import myAxios from "../plugins/myAxios";

export function getNoticePage(curPage: number) {
    return myAxios({
        url: '/notice/page',
        method: 'get',
        headers:{
            isRefreshToken: false
        },
        params:{
            curPage:curPage
        }
    })
}
