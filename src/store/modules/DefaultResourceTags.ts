import { defineStore } from 'pinia'
import { ref } from 'vue'
import {DefaultTag} from "../../model/defaultTag";
import {getDefaultResourceTags} from "../../api/resource";

const useDefaultResourceTagsStore = defineStore('defaultResourceTags',()=>{

    const defaultResourceTags = ref<DefaultTag[]>([]);

    const getAndSetDefaultResourceTags = async () => {
        //如果由则直接返回
        if (defaultResourceTags.value.length !== 0){
            return defaultResourceTags;
        }
        //从远程获取系统默认标签
        const res = await getDefaultResourceTags();
        // @ts-ignore
        if (res.code === 200 && res.data){
            for (let i = 0; i < res.data.length; i++) {
                defaultResourceTags.value.push({
                    id: res.data[i].id,
                    tagName: res.data[i].tagName
                })
            }
            return defaultResourceTags;
        }
    }

    return{
        defaultResourceTags,
        getAndSetDefaultResourceTags
    }
})

export default useDefaultResourceTagsStore
