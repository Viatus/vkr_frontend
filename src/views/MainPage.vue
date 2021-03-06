<template>
  <div class="min-h-screen p-0">
    <custom-header />
    <div class="grid grid-cols-2 grid-rows-2 h-screen">
      <div class="row-span-1 row-start-2 col-span-1 col-start-1 flex flex-col
        align-items-center
        p-4">
        <h2>Одобренные произведения</h2>
        <ul
          class="divide-y divide-gray-300 overflow-auto h-full w-full"
          v-if="approvedCreations.length != 0"
        >
          <li
            v-for="creation in approvedCreations"
            :key="creation.id"
            class="hover:bg-gray-100"
          >
            <mini-creation-info
              :creation_id="creation.id"
              :img_height="80"
              :img_width="80"
              :isApproved="true"
            />
          </li>
        </ul>
        <label v-if="approvedCreations.length == 0" class="m-4"
          >Здесь ничего нет</label
        >
      </div>
      <div class="row-span-1 row-start-2 col-span-1 col-start-2 flex flex-col
        align-items-center
        p-4">
        <h2>Ожидающие одобрения произведения</h2>
        <ul
          class="divide-y divide-gray-300 overflow-auto h-full w-full"
          v-if="unapprovedCreations.length != 0"
        >
          <li
            v-for="creation in unapprovedCreations"
            :key="creation.id"
            class="hover:bg-gray-100"
          >
            <mini-creation-info
              :creation_id="creation.id"
              :img_height="80"
              :img_width="80"
              :isApproved="false"
            />
          </li>
        </ul>
        <label v-if="unapprovedCreations.length == 0" class="m-4"
          >Здесь ничего нет</label
        >
      </div>
      <div class="row-span-1 row-start-1 col-span-1 col-start-1 flex flex-col
        align-items-center
        p-4">
        <h2>Рекомендации</h2>
        <ul
          class="divide-y divide-gray-300 overflow-auto h-full w-full"
          v-if="recommendedCreations.length != 0"
        >
          <li
            v-for="creation in recommendedCreations"
            :key="creation.id"
            class="hover:bg-gray-100"
          >
            <mini-creation-info
              :creation_id="creation.id"
              :img_height="80"
              :img_width="80"
              :isApproved="true"
              :predictedRating="creation.predicted_rating"
            />
          </li>
        </ul>
        <label v-if="recommendedCreations.length == 0" class="m-4"
          >Здесь ничего нет</label
        >
      </div>
      <div class="row-span-1 row-start-1 col-span-1 col-start-2 flex flex-col
        align-items-center
        p-4">
        <h2>Отзывы</h2>
        <ul
          class="divide-y divide-gray-300 overflow-auto h-full w-full"
          v-if="reviews.length != 0"
        >
          <li v-for="review in reviews" :key="review.id" class="hover:bg-gray-100">
            <review-block :review_id="review.id" :isOnUserPage="true"/>
          </li>
        </ul>
        <label v-if="reviews.length == 0" class="m-4">Здесь ничего нет</label>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";
import CustomHeader from "../components/CustomHeader";
import MiniCreationInfo from "../components/MiniCreationInfo";
import Review from "../components/Review";

export default {
  components: {
    "custom-header": CustomHeader,
    "mini-creation-info": MiniCreationInfo,
    "review-block": Review,
  },
  data() {
    return {
      approvedCreations: [],
      unapprovedCreations: [],
      reviews: [],
      recommendedCreations: [],
    };
  },
  async created() {
    this.fetchUsersReviews();
    this.fetchUsersApprovedCreations();
    this.fetchUsersUnapprovedCreations();
    this.fetchRecommendations();
  },
  methods: {
    fetchUsersReviews() {
      const fetchedId = this.$route.params.id;
      const token = localStorage.getItem("token");
      axios
        .get(`${APIURL}/reviews-by-user`, {
          headers: { authorization: token },
        })
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.reviews = result.data.result;
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
    fetchUsersApprovedCreations() {
      const fetchedId = this.$route.params.id;
      const token = localStorage.getItem("token");
      axios
        .get(`${APIURL}/creations-by-user`, {
          headers: { authorization: token },
        })
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.approvedCreations = result.data.result;
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
    fetchUsersUnapprovedCreations() {
      const fetchedId = this.$route.params.id;
      const token = localStorage.getItem("token");
      axios
        .get(`${APIURL}/unapproved-creations-by-user`, {
          headers: { authorization: token },
        })
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.unapprovedCreations = result.data.result;
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
    fetchRecommendations() {
      const fetchedId = this.$route.params.id;
      const token = localStorage.getItem("token");
      axios
        .get(`${APIURL}/user-profile-recs`, {
          headers: { authorization: token },
        })
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.recommendedCreations = result.data.result;
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
</style>