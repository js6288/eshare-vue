export type UserType = {
    /**
     * 用户id
     */
    userId:number;

    /**
     * 用户名
     */
    username:string;

    /**
     * 昵称
     */
    nickname:string;

    /**
     * 个性签名
     */
    personalSignature:string;


    /**
     * ip地址：String 类型，如广东
     */
    ipAddress:string;

    /**
     * 头像地址
     */
    avatarUrl:string;

    /**
     * 学校
     */
    school:string;

    /**
     * 0-男 1女 2保密 默认为2
     */
    gender:number;

    /**
     * 用户角色 0-普通用户 1-管理员
     */
    userRole:number;

    /**
     * 阅读数
     */
    readNum:number;

    /**
     * 获赞数
     */
    likesNum:number;

    /**
     * 账号状态是否封禁 默认为0-正常 1-封禁
     */
    status:number;

    /**
     * 创建时间
     */
    createTime:Date;

    /**
     * 等级
     */
    level:number;
}
