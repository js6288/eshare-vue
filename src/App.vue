<template >
  <a-config-provider :locale="locale">
    <BasicLayout/>
  </a-config-provider>

</template>

<script setup lang="ts">

import BasicLayout from "./layouts/BasicLayout.vue";
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
const locale = zhCN;
</script>

<style scoped>

</style>
