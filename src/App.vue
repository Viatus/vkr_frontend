<template>
  <div id="modals"></div>
  <router-view></router-view>
  <notifications position="bottom right"/>
</template>
<script>
export default {
  name: "App",
};
</script>
<style>
.form-field input {
  width: 100%;
}
#app {
  margin: 0 auto;
  width: 100vw;
  font-family: Roboto, Helvetica, Arial, sans-serif;
}
</style>
