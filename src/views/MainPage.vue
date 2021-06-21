<template>
  <div class="min-h-screen p-0">
    <custom-header />
    <div class="grid grid-cols-2 grid-rows-2 h-screen">
      <div class="row-span-1 row-start-2 col-span-1 col-start-1 pt-4 pr-4">
        <h2>Одобренные произведения</h2>
        <ul class="divide-y divide-gray-300 overflow-auto h-full" v-if="approvedCreations.length != 0">
          <li v-for="creation in approvedCreations" :key="creation.id" class="hover:bg-gray-100">
            <mini-creation-info
              :creation_id="creation.id"
              :img_height="80"
              :img_width="80"
              :isApproved="true"
            />
          </li>
        </ul>
        <label v-if="approvedCreations.length == 0" class="m-4">Здесь ничего нет</label>
      </div>
      <div class="row-span-1 row-start-2 col-span-1 col-start-2 pt-4 pl-4">
        <h2>Неодобренные произведения</h2>
        <ul class="divide-y divide-gray-300 overflow-auto h-full" v-if="unapprovedCreations.length != 0">
          <li v-for="creation in unapprovedCreations" :key="creation.id" class="hover:bg-gray-100">
            <mini-creation-info
              :creation_id="creation.id"
              :img_height="80"
              :img_width="80"
              :isApproved="false"
            />
          </li>
        </ul>
        <label v-if="unapprovedCreations.length == 0" class="m-4">Здесь ничего нет</label>
      </div>
      <div class="row-span-1 row-start-1 col-span-1 col-start-1 pt-4 pr-4 pb-4">
        <h2>Рекоммендации</h2>
        <ul class="divide-y divide-gray-300 overflow-auto h-full" v-if="recommendedCreations.length != 0">
          <li v-for="creation in recommendedCreations" :key="creation.id" class="hover:bg-gray-100">
            <mini-creation-info
              :creation_id="creation.id"
              :img_height="80"
              :img_width="80"
              :isApproved="true"
            />
          </li>
        </ul>
        <label v-if="recommendedCreations.length == 0" class="m-4">Здесь ничего нет</label>
      </div>
      <div class="row-span-1 row-start-1 col-span-1 col-start-2 pt-4 pl-4 pb-4">
        <h2>Отзывы</h2>
        <ul class="divide-y divide-gray-300 overflow-auto h-full" v-if="reviews.length != 0">
          <li v-for="review in reviews" :key="review.id">
            <h1>{{ review.content }}</h1>
            <h1>{{ review.score }}</h1>
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

export default {
  components: {
    "custom-header": CustomHeader,
    "mini-creation-info": MiniCreationInfo,
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
          alert(`${error.message}`);
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
          alert(`${error.message}`);
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
          alert(`${error.message}`);
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
          alert(`${error.message}`);
        });
    },
  },
};
</script>
<style scoped>
</style>