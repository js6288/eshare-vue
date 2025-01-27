import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {AntDesignVueResolver} from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [AntDesignVueResolver()],
        }),
    ],
    server: {
        port: 3000,
        host: '0.0.0.0'
    },

    optimizeDeps: {
        include: [
            '@kangc/v-md-editor/lib/theme/vuepress.js',
            'dayjs/locale/zh-cn'
        ],
    },

})
