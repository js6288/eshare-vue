import { defineStore } from 'pinia'
import { ref } from 'vue'
import {DefaultTag} from "../../model/defaultTag";
import {getMajors} from "../../api/resource";

const useMajorStore = defineStore('majorList',()=>{

    const majorList = ref<DefaultTag[]>([]);

    const getAndSetMajorList = async () => {
        //如果由则直接返回
        if (majorList.value.length !== 0){
            return majorList;
        }
        //从远程获取系统所有专业列表
        const res = await getMajors();
        // @ts-ignore
        if (res.code === 200 && res.data){
            for (let i = 0; i < res.data.length; i++) {
                majorList.value.push({
                    id: res.data[i].id,
                    tagName: res.data[i].majorName
                })
            }
            return majorList;
        }
    }

    return{
        majorList,
        getAndSetMajorList
    }
})

export default useMajorStore
