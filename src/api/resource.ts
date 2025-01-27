import myAxios from "../plugins/myAxios";
import {ResourceCommitBody} from "../model/ResourceCommitBody";

//获取所有系统默认的资源标签
export function getDefaultResourceTags() {
    return myAxios({
        url: '/resource/tags/default',
        method: 'get',
        headers: {
            isRefreshToken: false
        }
    })
}

//获取所有专业分类
export function getMajors(){
    return myAxios({
        url: '/major/list',
        method: 'get',
        headers: {
            isRefreshToken: false
        }
    })
}

//提交资源
export function commitResource(resourceCommitBody:ResourceCommitBody){
    return myAxios({
        url: '/resource/commit',
        method: 'post',
        data: resourceCommitBody,
        headers: {
            isRefreshToken: false
        }
    })
}

//根据userId获取资源
export function getResourcePageById(userId:number,curPage:number){
    return myAxios({
        url: '/resource/user/page',
        method: 'get',
        headers:{
            isAccessToken: false,
            isRefreshToken: false
        },
        params:{
            userId:userId,
            curPage: curPage
        }
    })
}

//获取资源库的默认分页资源列表
export function getResourceLibrary(curPage: number) {
    return myAxios({
        url: '/resource/library/page',
        method:'get',
        headers:{
            isAccessToken: false,
            isRefreshToken: false
        },
        params:{
            curPage:curPage
        }
    })
}

//根据resourceId获取资源详情
export function getResourceDetailById(resourceId:number){
    return myAxios({
        url: '/resource/detail',
        method: 'get',
        headers:{
            isAccessToken: false,
            isRefreshToken: false
        },
        params:{
            resourceId:resourceId
        }
    })
}

//查询当前用户是否下载资源
export function getResourceIsDownload(resourceId:number){
    return myAxios({
        url: '/resource/isDownload',
        method: 'get',
        headers:{
            isRefreshToken: false
        },
        params:{
            resourceId:resourceId
        }
    })
}

//获取下载地址
export function getDownloadUrl(resourceId:number){
    return myAxios({
        url: '/resource/get/download/url',
        method: 'post',
        headers:{
            isRefreshToken: false
        },
        params:{
            resourceId:resourceId
        }
    })
}

//根据resourceId获取评论分页
export function getResourceCommentPage(resourceId: number, curPage: number) {
    return myAxios({
        url: '/resource/comment/page',
        method: 'get',
        headers: {
            isAccessToken: false,
            isRefreshToken: false,
        },
        params:{
            resourceId: resourceId,
            curPage: curPage
        }
    })
}

//发表评论
export function addResourceComment(resourceId:number,content:string){
    return myAxios({
        url: '/resource/comment/publish',
        method: 'post',
        headers:{
            isRefreshToken: false
        },
        data:{
            resourceId: resourceId,
            content: content
        }
    })
}

//收藏资源
export function collectResource(resourceId:number,collect:number){
    return myAxios({
        url: '/resource/collect',
        method: 'post',
        headers:{
            isRefreshToken: false
        },
        params:{
            resourceId:resourceId,
            collect: collect
        }
    })
}

//判断是否收藏该资源
export function isResourceCollect(resourceId:number){
    return myAxios({
        url: '/resource/isCollect',
        method: 'get',
        headers:{
            isRefreshToken: false
        },
        params:{
            resourceId:resourceId
        }
    })
}

//获取收藏资源列表
export function resourceCollectPage(curPage:number){
    return myAxios({
        url: '/resource/mine/collect',
        method: 'get',
        headers:{
            isRefreshToken: false
        },
        params:{
            curPage:curPage
        }
    })
}

//删除资源
export function removeResource(resourceId:number){
    return myAxios({
        url: '/resource/remove',
        method: 'delete',
        headers:{
            isRefreshToken: false
        },
        params:{
            resourceId:resourceId
        }
    })
}

//搜索资源
export function searchResource(keyword:string,curPage:number){
    return myAxios({
        url: '/resource/search/keyword',
        method: 'get',
        headers:{
            isAccessToken: false,
            isRefreshToken: false
        },
        params:{
            keyword,
            curPage
        }
    })
}
