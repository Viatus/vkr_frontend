<template>
  <div v-if="isLoading">Идет загрузка</div>
  <router-link
    v-if="!isLoading"
    class="p-4 flex space-x-4"
    :to="
      isApproved
        ? { path: `/creations/${creation.id}` }
        : { path: `/unapproved-creations/${creation.id}` }
    "
  >
    <img
      :src="image"
      alt=""
      class="flex-none w-18 h-18 rounded-lg object-cover"
      :width="img_width"
      :height="img_height"
    />
    <div class="min-w-0 relative flex-auto sm:pr-20 lg:pr-0 xl:pr-20">
      <h2 class="text-lg font-semibold text-black mb-0.5">
        {{ creation.Creation_Names[0].name }}
      </h2>
      <dl class="flex flex-wrap text-sm font-medium whitespace-pre">
        <div>
          <dt class="sr-only">Жанр</dt>
          <dd>{{ creation.genre }}</dd>
        </div>
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
              creation.rating == null
                ? "Нет данных"
                : Math.round((creation.rating + Number.EPSILON) * 100) / 100
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
    creation_id: Number,
    img_height: Number,
    img_width: Number,
    isApproved: Boolean,
  },
  data() {
    return {
      image: require("@/assets/placeholder.png"),
      creation: null,
      isLoading: true,
    };
  },
  created() {
    this.fetchCreationInfo();
    this.fetchRating();
  },
  methods: {
    fetchCreationInfo() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creations/${this.creation_id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.creation = result.data.result;
          }
          axios
            .get(`${APIURL}/genres`)
            .then((result) => {
              if (this.$route.params.id !== fetchedId) return;
              if (result.data.result !== undefined) {
                var genre = null;
                for (genre of result.data.result) {
                  if (genre.id == this.creation.CreationTypeId) {
                    this.creation.genre = genre.name;
                    break;
                  }
                }
                this.isLoading = false;
              }
            })
            .catch((error) => {
              alert(`${error}`);
            });
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    fetchRating() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/rating/${this.creation_id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          this.rating = result.data.average;
        })
        .catch((error) => {
          alert(error);
        });
    },
  },
};
</script>
<style scoped>
</style>>