<template>
  <div v-if="isLoading">Идет загрузка</div>
  <router-link
    v-if="!isLoading"
    class="flex p-2 space-x-4"
    :to="
      isApproved
        ? { path: `/authors/${author.id}` }
        : { path: `/unapproved-authors/${author.id}` }
    "
  >
    <img
      :src="image"
      alt=""
      class="rounded-lg object-cover"
      :width="img_width"
      :height="img_height"
    />
    <div class="min-w-0 relative sm:pr-20 lg:pr-0 xl:pr-20 w-full">
      <h2 class="text-sm font-semibold text-black mb-0.5">
        {{ author ? author.name : "" }}
      </h2>
    </div>
  </router-link>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";

export default {
  props: {
    author_id: Number,
    img_height: Number,
    img_width: Number,
  },
  data() {
    return {
      image: require("@/assets/placeholder.png"),
      author: null,
      isLoading: true,
    };
  },
  created() {
    this.fetchAuthorInfo();
  },
  methods: {
    fetchAuthorInfo() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/authors/${this.author_id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.author = result.data.result;
            if (this.author.image !== undefined) {
              this.image = "data:image/jpg;base64," + this.author.image;
            }
          }
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
  },
};
</script>
<style scoped>
</style>>