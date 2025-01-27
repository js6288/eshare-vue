export type ResetPasswordBody={
    /**
     * 新的密码
     */
    newPassword:string;
    /**
     * 手机号
     */
    phone:string;

    /**
     * 验证码
     */
    code:string;

    /**
     * uuid
     */
    uuid:string;
}
