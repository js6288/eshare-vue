<template>
  <a-layout class="layout" id="components-layout-demo-top">
    <Header/>

    <a-layout-content style="padding: 100px 250px 0">
      <div :style="{ background: 'rgba(255,255,255,0.0)', padding: '24px',paddingBottom:'62px', minHeight: '500px' }">
        <router-view/>
      </div>
    </a-layout-content>
    <Footer/>
  </a-layout>
</template>

<script setup lang="ts">
import Header from "./Header.vue";
import Footer from "./Footer.vue"
</script>

<style scoped>
</style>
