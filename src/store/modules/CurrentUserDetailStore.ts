import { defineStore } from 'pinia'
import { ref } from 'vue'
import {getCurrentUserDetails} from "../../api/user";
import {CurrentUserDetail} from "../../model/CurrentUserDetail";

const currentUserDetailStore = defineStore('currentUserDetail',()=>{
    const currentUserDetail = ref<CurrentUserDetail>();

    const getAndSetCurrentUserDetail = async ()=>{
        if (currentUserDetail.value){
            return currentUserDetail;
        }
        //从远程获取当前用户信息
        const res:any = await getCurrentUserDetails();
        if (res.code == 200 && res.data){
            currentUserDetail.value = res.data;
            return currentUserDetail;
        }
    }

    return{
        currentUserDetail,
        getAndSetCurrentUserDetail
    }
})

export default currentUserDetailStore

