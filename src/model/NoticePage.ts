export type NoticePage = {
    total: number,
    size: number,
    current: number,
    records: Notice[]
}

export type Notice = {
    title:string,
    content:string,
    createTime: Date
}
