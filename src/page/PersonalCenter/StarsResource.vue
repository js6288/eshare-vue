<template>
  <div class="personal-center-main">
    <personal-canter-sub-header headName="资源收藏夹"/>
    <div class="resource-list">
      <div class="resource" v-for="resource in resourcePage.records">
        <img src="http://eshare-assers.linjsblog.top/assets/文件.png" style="width: 150px">
        <div  class="resource-title-div">
          <a @click="toResourceDetail(resource.resourceId)">
            {{ resource.resourceName }}
          </a>
        </div>
        <div class="file-size">{{formatBytes(resource.fileSize,2)}}</div>
        <div class="resource-data">
          {{ resource.downloadNum }} 下载
          <a-divider type="vertical" />
          {{ resource.collectionNum }} 收藏
        </div>
        <div class="resource-settings" >
          <a-dropdown-button size="small">
            <template #overlay>
              <a-menu>
                <a-menu-item key="1" @click="handleCancelCollect(resource.resourceId)">
                  <delete-outlined />
                  取消收藏
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown-button>
        </div>
      </div>
      <div class="resource-pagination">
        <a-pagination @change="pageChange"
                      v-model:current="curPage"
                      v-model:page-size="resourcePage.size"
                      :total="resourcePage.total" :show-size-changer="showSizeChanger" show-quick-jumper />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PersonalCanterSubHeader from "../../components/PersonalCanterSubHeader.vue"
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import {ResourcePage} from "../../model/ResourcePage";
import {collectResource, resourceCollectPage} from "../../api/resource";
import {formatBytes} from "../../utils/file";
import {message} from "ant-design-vue";

const router = useRouter();
const route:any = useRoute();

const toResourceDetail = (id: number) => {
  router.push({
    path:`/resourceDetail/${id}`
  })
}

const resourcePage = ref<ResourcePage>({
  current: 1, records: [], size: 0, total: 0
})


const showSizeChanger = false;
const curPage = ref(resourcePage.value.current);
//加载收藏列表
const loadStarResourcePage = async ()=>{
  const res:any = await resourceCollectPage(resourcePage.value.current);
  resourcePage.value = res.data;
}
loadStarResourcePage();


const pageChange = async (e:any)=>{
  const res:any = await resourceCollectPage(e);
  resourcePage.value = res.data;
}

const handleCancelCollect =async (resourceId:number) => {
  const res:any = await collectResource(resourceId,2);
  if (res.code == 200){
    message.success("已从收藏列表中移除");
    await loadStarResourcePage();
  }else {
    message.error(res.description||res.message);
  }
}

</script>

<style scoped>
.personal-center-main{
  padding: 20px 10px 10px 10px;
}
.resource-list{
  width: 620px;
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 0;
  padding: 10px 0 16px 40px;
  /*background-color: #fff;*/
  /*border-radius: 10px;*/
  /*box-shadow: 0 0 16px 0 rgb(205 216 228 / 80%);*/
}
.resource{
  width: 150px;
  margin-right: 30px;
  margin-bottom: 30px;
}
.resource-title-div a{
  font-size: 14px;
  color: #222226;
  line-height: 24px;
}
.resource-title-div{
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size{
  text-align: center;color: #8e8e93;font-weight: 500;margin-top: 8px;
}

.resource-data{
  text-align: center;
  font-size: 12px;
  margin-top: 8px;
}
.resource-pagination{
  width: 580px;
  text-align: center;
  flex-wrap: wrap;
}
.resource-settings{
  display: flex;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
}
</style>
