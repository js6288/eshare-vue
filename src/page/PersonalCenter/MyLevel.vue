<template>
  <div class="personal-center-main">
    <personal-canter-sub-header headName="我的等级"/>
    <div class="level">
      <a-tag color="#1890ff"><span class="level-num">Lv.{{ level }}</span></a-tag>
      <a-progress :stroke-color="{
        '0%': '#108ee9',
        '100%': '#87d068',
      }" :percent="(experience/maxExperience)*100" :show-info="false" />
      <span class="level-num-percent">{{ experience }}/{{ maxExperience }}</span>
    </div>
    <div class="level-rules">
      <div style="font-weight: 700;font-size: 16px;color: #505050">每日奖励</div>
      <div class="rules-list">
        <div class="rule-item">
          <img id="like-svg" class="item-img" src="http://eshare-assers.linjsblog.top/assets/personal-center/17喜欢.svg"/>
          <div style="margin-top: 10px">点赞文章 {{dailyRewardProgress.articleLikeCount}}/5</div>
          <a-tag style="margin-top: 10px" color="blue">+2 EXP</a-tag>
        </div>
        <div class="rule-item">
          <img class="item-img"  src="http://eshare-assers.linjsblog.top/assets/personal-center/10档案.svg"/>
          <div style="margin-top: 10px">收藏文章 {{ dailyRewardProgress.collectionCount }}/5</div>
          <a-tag style="margin-top: 10px" color="blue">+2 EXP</a-tag>
        </div>
        <div class="rule-item">
          <img class="item-img"  src="http://eshare-assers.linjsblog.top/assets/personal-center/5记录.svg"/>
          <div style="margin-top: 10px">发表文章 {{ dailyRewardProgress.articlePolishCount }}/10</div>
          <a-tag style="margin-top: 10px" color="blue">+10 EXP</a-tag>
        </div>
        <div class="rule-item">
          <img class="item-img"  src="http://eshare-assers.linjsblog.top/assets/personal-center/25上传.svg"/>
          <div style="margin-top: 10px">上传资源 {{ dailyRewardProgress.uploadCount }}/10</div>
          <a-tag style="margin-top: 10px" color="blue">+10 EXP</a-tag>
        </div>
        <div class="rule-item">
          <img class="item-img"  src="http://eshare-assers.linjsblog.top/assets/personal-center/21信息.svg"/>
          <div style="margin-top: 10px">文章评论区发表评论 {{ dailyRewardProgress.articleCommentAddCount }}/5</div>
          <a-tag style="margin-top: 10px" color="blue">+10 EXP</a-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PersonalCanterSubHeader from "../../components/PersonalCanterSubHeader.vue";
import {ref} from "vue";
import {getCurUserLevel, getMaxExperience,getDailyRewardProgress} from "../../api/level";

//获取当前用户等级
const level = ref(1);
const experience = ref(0);
const maxExperience = ref(4098)

const loadLevel = async ()=>{
  const res1:any = await getCurUserLevel();
  level.value = res1.data.level;
  experience.value = res1.data.experience
  const res2:any = await getMaxExperience(level.value);
  maxExperience.value = res2.data;
}

const dailyRewardProgress = ref({
  articleLikeCount: 0,
  collectionCount: 0,
  articlePolishCount: 0,
  uploadCount: 0,
  articleCommentAddCount: 0
})

const loadDaily = async ()=>{
  const res:any = await getDailyRewardProgress();
  if (res.code == 200 && res.data){
    dailyRewardProgress.value = res.data;
  }
}

loadDaily();

loadLevel();
</script>

<style lang="scss" scoped>
.personal-center-main{
  padding: 20px 10px 10px 10px;
}
.level{
  display: flex;
  align-items: center;
  width: 400px;
  margin-top: 30px;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
}
.level-num{
  font-weight: 500;
  font-size: 14px;
}
.level-num-percent{
  color: #8c8c8c;
  margin-left: 10px;
}
.level-rules{
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
</style>
