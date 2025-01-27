import myAxios from "../plugins/myAxios";
import {ArticleAddBody} from "../model/ArticleAddBody";
import {ArticleEditBody} from "../model/ArticleEditBody";
import {CommentAddBody} from "../model/CommentAddBody";

//获取所有系统默认的文章标签
export function getDefaultArticleTags(){
    return myAxios({
        url: '/article/tags/default',
        method: 'get',
        headers: {
            isRefreshToken: false
        }
    })
}

//添加文章
export function addArticle(articleAddBody:ArticleAddBody) {
    return myAxios({
        url: '/article/publish',
        method: 'post',
        headers: {
            isRefreshToken: false
        },
        data: articleAddBody
    })
}

//获取最新文章
export function getLatestAllOnlineArticle(curPage:number){
    return myAxios({
        url: '/article/getOnlineArticle/latest',
        method: 'get',
        headers:{
            isAccessToken: false,
            isRefreshToken: false
        },
        params:{
            curPage:curPage
        }
    })
}

////根据userId获取查询文章
export function getArticlePageByUserId(curPage:number,userId:number){
    return myAxios({
        url: '/article/mine/page/id',
        method: 'get',
        headers: {
            isAccessToken: false,
            isRefreshToken: false
        },
        params:{
            curPage:curPage,
            userId:userId
        }
    })
}

//根据articleId查询文章
export function getArticleEsByArticleId(articleId:number){
    return myAxios({
        url:'/article/get/one',
        method: 'get',
        headers: {
            isAccessToken: false,
            isRefreshToken: false
        },
        params:{
            articleId:articleId
        }
    })
}

//文章浏览数+1
export function articleViewNumIncr(articleId:number){
    return myAxios({
        url: '/article/view',
        method: 'post',
        headers:{
            isAccessToken: false,
            isRefreshToken: false
        },
        params:{
            articleId: articleId
        }
    })
}

//文章点赞
export function likeArticle(articleId:number,like:number){
    return myAxios({
        url: '/article/like',
        method: 'post',
        headers:{
            isRefreshToken: false
        },
        params:{
            articleId:articleId,
            like: like
        }
    })
}

//判断当前用户是否点赞该文章
export function isLike(articleId:number){
    return myAxios({
        url: '/article/isLike',
        method: 'get',
        headers:{
            isRefreshToken: false
        },
        params:{
            articleId:articleId
        }
    })
}

//文章收藏
export function collectArticle(articleId:number,collect:number){
    return myAxios({
        url: '/article/collect',
        method: 'post',
        headers:{
            isRefreshToken: false
        },
        params:{
            articleId:articleId,
            collect: collect
        }
    })
}

//是否收藏
export function isCollect(articleId:number){
    return myAxios({
        url: '/article/isCollect',
        method: 'get',
        headers:{
            isRefreshToken: false
        },
        params:{
            articleId:articleId
        }
    })
}

//删除稿件
export function removeArticleSelf(articleId: number) {
    return myAxios({
        url: '/article/remove/self',
        method: 'delete',
        headers:{
            isRefreshToken: false
        },
        params:{
            articleId:articleId
        }
    })
}


//更新稿件
export function updateArticle(articleEditBody:ArticleEditBody){
    return myAxios({
        url: '/article/edit',
        method: 'post',
        headers:{
            isRefreshToken: false
        },
        data:articleEditBody
    })
}

//查询个人收藏的文章
export function myCollectArticle(curPage:number) {
    return myAxios({
        url: '/article/mine/collect',
        method: 'get',
        headers: {
            isRefreshToken: false
        },
        params:{
            curPage:curPage
        }
    })
}

//搜索文章
export function searchArticle(searchText:string,curPage:number){
    return myAxios({
        url: '/article/search',
        method: 'get',
        headers:{
            isAccessToken: false,
            isRefreshToken: false
        },
        params:{
            searchText,
            curPage
        }
    })
}

//热门文章
export function hotArticle(){
    return myAxios({
        url: '/article/hot',
        method: 'get',
        headers:{
            isAccessToken: false,
            isRefreshToken: false
        },
    })
}

//发表评论
export function addComment(commendAddBody:CommentAddBody){
    return myAxios({
        url: '/article/comment/add',
        method: 'post',
        headers:{
            isRefreshToken: false
        },
        data:commendAddBody
    })

}

//查询评论列表
export function articleCommentList(articleId: number, userId: number) {
    return myAxios({
        url: '/article/comment/list',
        method: 'get',
        headers:{
            isAccessToken: false,
            isRefreshToken: false
        },
        params:{
          articleId:articleId,
          userId: userId
        }
    })
}
