export type ArticleCard={
    /**
     * 文章id
     */
    articleId:number,

    /**
     * 文章标题
     */
    articleTitle:string;


    /**
     * 文章内容(简化)
     */
    content:string;

    /**
     * 文章类型 0-普通用户文章 1-官方文章
     */
    type:number;

    /**
     * 文章封面图片：最多三张
     */
    orderImages:string[];

    /**
     * 评论数
     */
    commentsNum:number;

    /**
     * 点赞数
     */
    likesNum:number;

    /**
     * 浏览数
     */
    viewsNum:number;

    /**
     * 收藏数
     */
    collectionsNum:number;

    /**
     * 发表时间
     */
    createTime:Date;

    /**
     * 更新时间
     */
    updateTime:Date;

    /**
     * 用户id
     */
    userId:number;

    /**
     * 用户昵称
     */
    nickname:string;

    /**
     * 用户头像
     */
    avatar:string;

    /**
     * 等级
     */
    level:number;

    /**
     * 标签列表
     */
    tagList:string[];

}
