export type ResourceCommentPage={
    total: number,
    size: number,
    current: number,
    records: ResourceComment[]
}

export type ResourceComment={
    avatarUrl:string,
    nickname: string,
    createTime: Date,
    content: string
}
