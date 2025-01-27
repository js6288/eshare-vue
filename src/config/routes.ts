import Community from '../page/Community.vue'
import Resource from '../page/ResourceLibrary.vue'
import MyLevel from "../page/PersonalCenter/MyLevel.vue"
import MyPoint from "../page/PersonalCenter/MyPoint.vue"
const routes = [
    {
        path: '/',
        component: Community,
        title: '社区'
    },
    {
        path: '/resource',
        component: Resource,
        title: '资源库'
    },
    {
        path: '/login',
        component: ()=> import("../page/Login.vue"),
        title: '登录'
    },
    {
        path: '/register',
        component:  ()=>import("../page/Register.vue"),
        title: '注册'
    },
    {
        path: '/githubCallback',
        component: ()=>import("../page/Oauth/GithubCallback.vue")
    },
    {
        path: '/articleAdd',
        component: ()=> import("../page/ArticleAdd.vue"),
        title: '发表文章'
    },
    {
        path: '/articleEdit/:aid',
        component: ()=> import("../page/ArticleEdit.vue"),
        title: '编辑文章'
    },
    {
        path: '/resourceDetail/:rid',
        component:  ()=>import("../page/ResourceDetail.vue"),
        title: '资源详情'
    },
    {
        path: '/articleDetail/:aid',
        component:  ()=>import("../page/ArticleDetail.vue"),
        title: '文章详情'
    },
    {
        path: '/uploadResource',
        component:  ()=>import("../page/UploadResource.vue"),
    },
    {
        path: '/personalCenter/:uid',
        component: ()=> import("../page/PersonalCenter.vue"),
        children: [
            {
                path: 'postList',
                component:  ()=> import("../page/PersonalCenter/PostList.vue"),
            },
            {
                path: 'resourceList',
                component:  ()=>import("../page/PersonalCenter/ResourceList.vue")
            },{
                path: 'thirdParty',
                component:  ()=> import("../page/PersonalCenter/ThirdParty.vue")
            },{
                path: 'uploadAvatar',
                component: ()=> import("../page/PersonalCenter/UploadAvatar.vue")
            },{
                path: 'passwordReset',
                component:  ()=> import("../page/PersonalCenter/PasswordReset.vue")
            },{
                path: 'editAccount',
                component:  ()=> import("../page/PersonalCenter/EditAccount.vue")
            },{
                path: 'myLevel',
                component: ()=> import("../page/PersonalCenter/MyLevel.vue")
            },{
                path: 'myPoint',
                component:  ()=> import("../page/PersonalCenter/MyPoint.vue")
            },{
                path: 'starsArticle',
                component: ()=> import("../page/PersonalCenter/StarsArticle.vue")
            },{
                path: 'starsResource',
                component:  ()=>import("../page/PersonalCenter/StarsResource.vue")
            },{
                path: 'messageCenter',
                component:  ()=> import("../page/PersonalCenter/MessageCenter.vue")
            }

        ]
    }
    ,
    {
        path: "/home",
        redirect: '/'
    },
    {
        path: '/404',
        component:()=> import("../page/404/NotFound.vue")
    },
    {
        path: '/:pathMatch(.*)',
        redirect: '/404'
    }

]

export default routes;
