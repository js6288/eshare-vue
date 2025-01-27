<template>
  <div class="personal-center-main">
    <personal-canter-sub-header headName="消息中心"/>
    <div class="notice-list">
      <div class="notice-card" v-for="notice in noticePage.records">
        <div class="notice-head">
          <span class="notice-title">{{ notice.title }}</span>
          <span class="notice-date">{{ dayjs(notice.createTime).format("YYYY-MM-DD HH:MM:SS") }}</span>
        </div>
        <div class="notice-content">
          {{ notice.content }}
        </div>
      </div>
<!--      <div class="notice-card">-->
<!--        <div class="notice-head">-->
<!--          <span class="notice-title">文章被下架</span>-->
<!--          <span class="notice-date">2022.11.15  9:22:10</span>-->
<!--        </div>-->
<!--        <div class="notice-content">-->
<!--          很遗憾，您发布的文章因为不符合法律要求下架，请及时修改文章信息，重新上传文章。如有疑问，请联系kefu@bbcnn.net-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="notice-card">-->
<!--        <div class="notice-head">-->
<!--          <span class="notice-title">资源被下架</span>-->
<!--          <span class="notice-date">2022.10.15 8:22:00</span>-->
<!--        </div>-->
<!--        <div class="notice-content">-->
<!--          很遗憾，你上传的【《Java应用提速（速度与激情）》-20230103-221843.pdf】因版权原因已经被下架，如有疑问，请联系kefu@csdn.net-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <div style="margin-top: 20px;text-align: center">
      <a-pagination
          @change="noticePageChange"
          v-model:current="curPage"
          v-model:page-size="noticePage.size"
          :total="noticePage.total"
          :show-size-changer="false"
          show-quick-jumper
      >
      </a-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PersonalCanterSubHeader from "../../components/PersonalCanterSubHeader.vue"
import {ref} from "vue";
import {NoticePage} from "../../model/NoticePage";
import {getNoticePage} from "../../api/notice";
import dayjs from 'dayjs';

const noticePage = ref<NoticePage>({current: 1, records: [], size: 0, total: 0})

const curPage = ref(noticePage.value.current);

const loadNoticePage = async ()=>{
  const res:any = await getNoticePage(noticePage.value.current);
  noticePage.value = res.data;
}

loadNoticePage();

const noticePageChange = async (e:any) => {
  const res:any = await getNoticePage(e);
  noticePage.value = res.data;
}

</script>

<style lang="scss" scoped>
.personal-center-main{
  padding: 20px 10px 10px 10px;
}
.notice-list{
margin-top: 30px;

}
.notice-card{
  margin-top: 20px;
  width: 580px;
  min-height: 120px;
  border-radius: 6px;
  box-shadow: 0 2px 4px 0 rgb(121 146 185 / 54%);
  margin-left: 40px;
  padding: 20px
}
.notice-head{
  display: flex;
  align-items: center;
  .notice-title{
    font-size: 14px;
    font-weight: 600;
  }
  .notice-date{
    margin-left: 50px;
  }
}
.notice-content{
  margin-top: 10px;
}
</style>
