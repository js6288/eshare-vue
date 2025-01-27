export type ArticleComment={
    id: number,
    nickname: string,
    avatarUrl: string,
    content: string,
    parentId: number,
    rootId: number,
    userId: number,
    articleId: number,
    createTime: Date,
    likeNum: number,
    likeStatus: number
}
