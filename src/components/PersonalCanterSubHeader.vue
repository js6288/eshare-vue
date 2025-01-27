<template>
  <div class="personal-center-head">
    <a-divider class="personal-divider" type="vertical" />
    <span class="personal-title">{{props.headName}}</span>
  </div>
</template>

<script lang="ts" setup>

interface HeadName{
  headName: string
}
const props = withDefaults(defineProps<HeadName>(),{
  headName: '默认标题' as string
})
</script>

<style scoped>
.personal-center-head{
  margin-top: 10px;
  display: flex;
  align-items: center;
}
.personal-divider{
  width: 8px; height: 20px; background-color: #999999;margin-left: 25px
}
.personal-title{
  font-size: 17px;
  font-weight: 700;
  margin-left: 5px;
}
</style>
