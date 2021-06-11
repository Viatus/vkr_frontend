<template>
  <article class="flex flex-col space-x-4 border-2 border-double">
    <div class="bg-green-300 flex flex-row justify-between">
      <h5 class="">{{ user_nickname }}</h5>
      <h5 class="">{{ date_published }}</h5>
    </div>
    <h1 class="text-xl">{{ content }}</h1>
  </article>
</template>
<script>
export default {
  props: { user_nickname: String, content: String, date_published: String },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped>
</style>>