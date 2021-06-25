<template>
  <div class="min-h-screen p-0">
    <custom-header />
    <div class="flex flex-row p-4 w-full items-center">
      <div class="flex-row flex">
        <input
          type="search"
          v-model="searchString"
          class="form-control"
          placeholder="Поиск..."
          aria-label="Search"
        />
        <MDBBtn
          outline="primary"
          @click="
            {
              page = 1;
              executeSearch();
            }
          "
        >
          <MDBIcon iconStyle="fas" icon="search"></MDBIcon>
        </MDBBtn>
      </div>
    </div>
    <div class="grid grid-rows-1 grid-cols-5">
      <div class="col-span-4 col-sart-1 pl-2">
        <div v-if="resultsLoaded" class="border border-gray-200">
          <ul
            v-if="creations.length != 0"
            class="divide-y divide-gray-300 h-full list-none m-0 p-0"
          >
            <li
              v-for="creation in creations"
              :key="creation.id"
              class="hover:bg-gray-100"
            >
              <mini-creation-info
                :creation_id="creation.id"
                :img_height="30"
                :img_width="30"
                :isApproved="true"
              />
            </li>
          </ul>
          <label v-if="creations.length == 0"> Ничего не найдено </label>
        </div>

        <div class="flex flex-row justify-between pb-2">
          <MDBBtn
            outline="primary"
            class="
              relative
              inline-flex
              items-center
              px-2
              py-2
              border border-gray-300
              bg-white
              text-sm
              font-medium
              text-gray-500
              hover:bg-gray-100
            "
            v-if="resultsLoaded"
            :disabled="page == 1"
            @click="prevPage()"
          >
            <span class="">Предыдущая страница</span>
          </MDBBtn>
          <MDBBtn
            outline="primary"
            class="
              relative
              inline-flex
              items-center
              px-2
              py-2
              border border-gray-300
              bg-white
              text-sm
              font-medium
              text-gray-500
              hover:bg-gray-100
            "
            :disabled="
              creations.length < 1 ||
              creations === null ||
              creations === undefined
            "
            v-if="resultsLoaded"
            @click="nextPage()"
          >
            Следующая страница
          </MDBBtn>
        </div>
      </div>
      <div class="col-span-1 col-start-5 border border-gray-200">
        <div class="flex flex-col">
          <div class="flex flex-col items-left p-6">
            <label>Жанры</label>
            <ul class="">
              <li v-for="genre in genres" :key="genre.id">
                <input
                  type="checkbox"
                  :value="genre.name"
                  name="genre"
                  v-model="checkedGenres"
                />
                <label :title="genre.description">{{ genre.name }} </label>
              </li>
            </ul>
          </div>
          <div class="flex flex-col items-left p-6">
            <label>Тэги</label>
            <ul class="tags-list">
              <li v-for="tag in tags" :key="tag.id">
                <input
                  type="checkbox"
                  :value="tag.name"
                  name="tag"
                  v-model="checkedTags"
                />
                <label :title="tag.description">{{ tag.name }} </label>
              </li>
            </ul>
          </div>
        </div>
        <div class="flex flex-col items-left p-6">
          <div class="options">
            <div>
              <label>Сортировать по </label>
              <select v-model="selectedSortType" class="border border-gray-300">
                <option
                  v-for="sortType in sortTypes"
                  :value="sortType.name"
                  :key="sortType.id"
                >
                  {{ sortType.name }}
                </option>
              </select>
            </div>
            <div>
              <label>Отображать по </label>
              <select v-model="selectedPageSize" class="border border-gray-300">
                <option
                  v-for="pageSize in pageSizes"
                  :value="pageSize"
                  :key="pageSize"
                >
                  {{ pageSize }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";
import CustomHeader from "../components/CustomHeader";
import MiniCreationInfo from "../components/MiniCreationInfo.vue";
import { MDBBtn, MDBIcon } from "mdb-vue-ui-kit";
export default {
  components: {
    "mini-creation-info": MiniCreationInfo,
    "custom-header": CustomHeader,
    MDBBtn,
    MDBIcon,
  },
  data() {
    return {
      loading: false,
      creations: [],
      tags: null,
      genres: null,
      checkedTags: [],
      checkedGenres: [],
      sortTypes: [
        { name: "имени", id: 1 },
        { name: "популярности", id: 2 },
        { name: "рейтингу", id: 3 },
      ],
      resultsLoaded: false,
      pageSizes: [10, 20, 50, 100],
      selectedPageSize: 10,
      selectedSortType: "имени",
      searchString: "",
      page: 1,
    };
  },
  created() {
    this.fetchTags();
    this.fetchGenres();
  },
  methods: {
    fetchGenres() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/genres`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.genres = result.data.result;
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
    fetchTags() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/tags`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.tags = result.data.result;
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
    executeSearch() {
      const fetchedId = this.$route.params.id;
      this.resultsLoaded = false;
      var checkedTagsId = [];
      var checkedGenresId = [];
      var tag;
      var genre;
      for (tag of this.tags) {
        if (this.checkedTags.includes(tag.name)) {
          checkedTagsId.push(tag.id);
        }
      }
      for (genre of this.genres) {
        if (this.checkedGenres.includes(genre.name)) {
          checkedGenresId.push(genre.id);
        }
      }

      axios
        .get(`${APIURL}/ranking`, {
          params: {
            tags: checkedTagsId,
            genres: checkedGenresId,
            string: this.searchString,
            limit: this.selectedPageSize,
            page: this.page,
          },
        })
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          this.creations = result.data;
          this.resultsLoaded = true;
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
    },
    nextPage() {
      if (
        this.creations.length < 1 ||
        this.creations === null ||
        this.creations === undefined
      ) {
        return;
      }
      this.page++;
      this.executeSearch();
    },
    prevPage() {
      if (this.page < 2) {
        return;
      }
      this.page--;
      this.executeSearch();
    },
  },
};
</script>
<style scoped>
</style>
