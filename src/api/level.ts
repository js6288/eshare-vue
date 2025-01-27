import myAxios from "../plugins/myAxios";

//获取当前用户等级
export function getCurUserLevel() {
    return myAxios({
        url: '/level/current',
        method: 'get',
        headers:{
            isRefreshToken: false
        },
    })
}

//根据等级获取最大经验
export function getMaxExperience(level: number) {
    return myAxios({
        url: '/level/maxExperience',
        method: 'get',
        headers:{
            isRefreshToken: false
        },
        params:{
            level: level
        }
    })
}

//获取每日奖励进度
export function getDailyRewardProgress() {
    return myAxios({
        url: '/level/daily',
        method: 'get',
        headers:{
            isRefreshToken: false
        }
    })
}
