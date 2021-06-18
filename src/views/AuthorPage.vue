<template>
  <div class="min-h-screen p-0 sm:p-12">
    <custom-header />
    <div v-if="loading">
      <label> Загрузка </label>
    </div>
    <div v-if="!loading" class="grid grid-cols-4 grid-rows-4">
      <img
        v-if="image"
        :src="image"
        class="
          row-span-3
          rounded-none
          lg:rounded-lg
          shadow-xl
          hidden
          lg:block
          m-6
        "
      />
      <div class="col-span-3 col-start-2 row-span-4 flex-col align-middle">
        <h1 class="text-3xl font-bold pt-8 lg:pt-0">{{ info.name }}</h1>
        <div
          class="
            mx-auto
            lg:mx-0
            w-4/5
            pt-3
            border-b-2 border-green-600
            opacity-25
          "
        ></div>
        <h1 v-if="info.country" id="country">
          {{ info.country }}
        </h1>
        <div class="p-6">
          <label for="description">Краткая информация</label>
          <h1 id="description" class="text-xl">{{ info.description }}</h1>
        </div>
      </div>
    </div>
    <div class="h-80 col-start-1 col-span-1">
      <h2>Произведения автора</h2>
      <ul class="divide-y divide-gray-300 overflow-auto h-full">
        <li v-for="creation in creations" :key="creation.id">
          <mini-creation-info
            :creation_id="creation.id"
            :img_height="80"
            :img_width="80"
          />
        </li>
      </ul>
    </div>
    <button v-if="isAdmin" @Click="deleteCreation">Удалить</button>
    <button @Click="$router.go(-1)">Назад</button>
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
      info: null,
      isAdmin: false,
      image: require("@/assets/placeholder.png"),
      loading: true,
      creations: [],
    };
  },
  async created() {
    this.fetchAuthorInfo();
    this.fetchAuthorCreations();
    this.isAdmin = localStorage.getItem("isAdmin");
  },
  methods: {
    fetchAuthorInfo() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/authors/${this.$route.params.id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.info = result.data.result;
          }
          this.loading = false;
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    fetchAuthorCreations() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/author-role/${this.$route.params.id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.creations = result.data.result;
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
</style>