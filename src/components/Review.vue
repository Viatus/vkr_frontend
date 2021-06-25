<template>
  <div v-if="isLoading">Идет загрузка</div>
  <router-link
    v-if="!isLoading"
    class="flex p-2 space-x-4"
    :to="isOnUserPage ? { path: `/creations/${review.Creation.id}` } : {}"
  >
    <div class="min-w-0 relative sm:pr-20 lg:pr-0 xl:pr-20 w-full">
      <h2 class="text-sm font-semibold text-black mb-0.5">
        {{
          isOnUserPage
            ? review.Creation.Creation_Names
              ? review.Creation.Creation_Names[0].name
              : ""
            : review.Client.nickname
        }}
      </h2>
      <dl class="flex flex-wrap text-xs font-medium whitespace-pre w-full">
        <h3 class="text-black">{{ review.content ? review.content : "" }}</h3>
        <div
          class="
            absolute
            top-0
            right-0
            rounded-full
            bg-amber-50
            text-amber-900
            px-2
            py-0.5
            hidden
            sm:flex
            lg:hidden
            xl:flex
            items-center
            space-x-1
          "
        >
          <dt class="text-amber-500">
            <span class="sr-only">Рейтинг</span>
            <svg width="16" height="20" fill="currentColor">
              <path
                d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z"
              />
            </svg>
          </dt>
          <dd>
            {{
              review.score == null
                ? 0
                : Math.round((review.score + Number.EPSILON) * 100) / 100
            }}
          </dd>
        </div>
      </dl>
    </div>
  </router-link>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";

export default {
  props: {
    review_id: Number,
    isOnUserPage: Boolean,
  },
  data() {
    return {
      review: null,
      isLoading: true,
    };
  },
  created() {
    this.fetchReviewInfo();
  },
  methods: {
    fetchReviewInfo() {
      this.isLoading = true;
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/reviews/${this.review_id}`)
        .then((result) => {
          this.isLoading = false;
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.review = result.data.result;
          }
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
    },
  },
};
</script>
<style scoped>
</style>>