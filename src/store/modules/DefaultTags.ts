import { defineStore } from 'pinia'
import { ref } from 'vue'
import {DefaultTag} from "../../model/defaultTag";
import {getDefaultArticleTags} from "../../api/article";

const useDefaultTagsStore = defineStore('defaultTags',()=>{
    const defaultTags = ref<DefaultTag[]>([]);


    const getAndSetDefaultTags = async () => {
      //如果由则直接返回
      if (defaultTags.value.length !== 0){
          return defaultTags;
      }
      //从远程获取系统默认标签
      const res = await getDefaultArticleTags();
      // @ts-ignore
        if (res.code === 200 && res.data){
          for (let i = 0; i < res.data.length; i++) {
                defaultTags.value.push({
                    id: res.data[i].id,
                    tagName: res.data[i].tagName
                })
          }
          return defaultTags;
      }
    }
    return {
        defaultTags,
        getAndSetDefaultTags
    }
})
export default useDefaultTagsStore;
