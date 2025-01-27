<template>
  <div class="personal-center-main">
    <personal-canter-sub-header headName="我的积分"></personal-canter-sub-header>
    <div class="points-header-warp">
      <div class="points-header-box">
        <span>积分余额</span>
        <span class="point-num">{{ point }}</span>
      </div>
    </div>
    <div class="points-rules">
      <span style="font-weight: 700;font-size: 16px;color: #505050">如何获得积分</span>
      <div class="rules-list">
        <div class="rule-item">
          <img class="item-img"  src="http://eshare-assers.linjsblog.top/assets/personal-center/24个人资料.svg"/>
          <div style="margin-top: 10px">新用户免费赠送200积分</div>

        </div>
        <div class="rule-item">
          <img class="item-img"  src="http://eshare-assers.linjsblog.top/assets/personal-center/25上传.svg"/>
          <div style="margin-top: 10px">上传一次资源并通过审核赠送10积分</div>

        </div>
        <div class="rule-item">
          <img class="item-img"  src="http://eshare-assers.linjsblog.top/assets/personal-center/18发现.svg"/>
          <div style="margin-top: 10px">其他用户每下载资源一次你的资源赠送1积分</div>
        </div>
        <div class="rule-item">
          <img class="item-img"  src="http://eshare-assers.linjsblog.top/assets/personal-center/21信息.svg"/>
          <div style="margin-top: 10px">下载资源并评论获得5积分</div>
        </div>
      </div>
    </div>
    <div class="tips">小贴士：后续会推出更多获取积分的方式</div>
  </div>
</template>

<script lang="ts" setup>
import PersonalCanterSubHeader from "../../components/PersonalCanterSubHeader.vue"
import {ref} from "vue";
import {getCurrentUserPoint} from "../../api/user";

const point = ref<number>(0)
/**
 * 获取当前用户积分
 */
const loadPoint = async ()=>{
  const res:any = await getCurrentUserPoint();
  if (res.code == 200 && res.data){
    point.value = res.data;
  }
}

loadPoint();
</script>

<style lang="scss" scoped>
.personal-center-main{
  padding: 20px 10px 10px 10px;
}
.points-header-warp{
  margin-top: 40px;
  padding: 0 20px;
  height: 145px;
  width: 789px;
  background: url("https://s1.hdslb.com/bfs/static/jinkela/account/assets/score.png") no-repeat;
  background-size: 650px;

}
.points-header-box{
  font-size: 30px;
}
.points-header-box{
  margin-left: 200px;
  padding-top: 25px;
}
.points-header-box .point-num {
  margin-left: 15px;
  color: #00a1d6;
}
.points-rules{
  margin-top: 50px;
  padding: 10px 11px 12px 30px;
}
.rules-list{
  margin-top: 20px;
  display: flex;
  flex-flow: wrap;
}
.rule-item{
  width: 100px;
  text-align: center;
  margin-right: 50px;
  margin-bottom: 20px;
}
.item-img{
  width: 98px;
  height: 98px;
}
.tips{
  margin-left: 30px;
  margin-top: 30px;
  font-size: 10px;
  color: #505050;
}
</style>
