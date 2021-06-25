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
          pr-6
          max-w-xs
        "
      />
      <div
        class="pl-12 col-span-3 col-start-2 row-span-3 flex-col align-middle"
      >
        <h1 class="text-3xl font-bold pt-8 lg:pt-4">{{ info.name }}</h1>
        <div
          class="
            mx-auto
            lg:mx-0
            w-full
            pt-3
            border-b-2 border-green-600
            opacity-25
          "
        ></div>
        <h1 v-if="info.country" id="country" class="text-base">
          Страна: {{ info.country }}
        </h1>
        <div>
          <label for="description" class="text-base text-bold"
            >Краткая информация</label
          >
          <h1 id="description" class="text-base pl-4">
            {{ info.description }}
          </h1>
        </div>
        <div v-if="info.birthday !== undefined">
          <h1 id="description" class="text-base">
            День рождения: {{ info.birthday.slice(0, 10) }}
          </h1>
        </div>
        <div v-if="info.birthday !== undefined">
          <h1 id="description" class="text-base">
            День рождения: {{ info.birthday.slice(0, 10) }}
          </h1>
        </div>
      </div>
    </div>
    <div class="h-80 col-start-1 col-span-4">
      <h2>Произведения автора</h2>
      <ul class="divide-y divide-gray-300 overflow-auto h-full">
        <li v-for="creation in creations" :key="creation.id">
          <mini-creation-info
            :creation_id="creation.id"
            :img_height="80"
            :img_width="80"
            :isApproved="true"
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
            if (this.info.image !== undefined) {
              this.image = "data:image/jpg;base64," + this.info.image;
            }
          }
          this.loading = false;
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
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