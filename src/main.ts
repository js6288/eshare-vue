import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { Modal, message } from 'ant-design-vue';
import router from "./config/router";
import pinia from "./store";
import 'ant-design-vue/es/message/style/css';
import 'ant-design-vue/es/modal/style/css';
// 导入图标库
import * as Icons from "@ant-design/icons-vue";
// v-md-editor
import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor';
import '@kangc/v-md-editor/lib/style/codemirror-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';

// highlight.js
import hljs from 'highlight.js';
// codemirror 编辑器的相关资源
import Codemirror from 'codemirror';
// mode
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/vue/vue';
// edit
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchbrackets';
// placeholder
import 'codemirror/addon/display/placeholder';
// active-line
import 'codemirror/addon/selection/active-line';
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
// style
import 'codemirror/lib/codemirror.css';

VMdEditor.Codemirror = Codemirror;

VMdEditor.use(githubTheme, {
    Hljs: hljs,
});

VMdPreview.use(githubTheme, {
    Hljs: hljs,
});

message.config({
    maxCount:1//最多显示一条错误信息
})


const app = createApp(App);

// 开始使用全局图标
const icons: any = Icons;
for (const i in icons) {
    // 循环注册组件
    app.component(i, icons[i]);
}


app.use(router);
app.use(pinia);
app.use(VMdEditor);
app.use(VMdPreview);

//当前环境
const env = import.meta.env
console.log(env)

app.mount('#app')
app.config.globalProperties.$Modal = Modal;
app.config.globalProperties.$message = message;


