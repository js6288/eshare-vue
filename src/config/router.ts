import * as VueRouter from "vue-router";
import routes from "./routes";


const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, // `routes: routes` 的缩写
    scrollBehavior(to, from, savedPosition) {
        // 始终滚动到顶部
        return { top: 0 }
    },
})

// router.beforeEach((to,form,next)=>{
//
// })

export default router
