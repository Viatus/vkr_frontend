<template>
  <div class="bar-container">
    <div>
      <label class="top-label"> Лучшие по жанрам(плэйсхолдер) </label>
    </div>
    <div>
      <label class="tags-label"> Лучшие по тэгам(плэйсхолдер) </label>
    </div>
    <form class="searchbar">
      <input
        type="text"
        placeholder="Интересное произведение"
        v-model="form.searchText"
        @input="searchTextChanged()"
        @focus="setSearchOptions(true)"
        @blur="setSearchOptions(false)"
      />
      <button type="button">Поиск</button>
      <div v-if="searchOptionsShow" class="options-container">
        <ul v-if="optionsCreations.length != 0" class="options-list">
          <li
            v-for="creation in optionsCreations"
            :key="creation.id"
            class="options-li"
            @click="this.$router.go(`/creations/${creation.id}`)"
          >
            <img src="@/assets/logo.png" />
            <label>{{ creation.name }}</label>
          </li>
        </ul>
        <label v-if="optionsCreations.length == 0"> Ничего не найдено </label>
      </div>
    </form>
    <div class="profile-container">
      <label
        class="porfile-label"
        @mouseenter="setProfileShown(true)"
        @mouseleave="setProfileShown(false)"
      >
        {{ email }}</label
      >
      <div v-if="profileShown">
        <label> А тут будет разное</label>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";
export default {
  data() {
    return {
      loading: false,
      optionsCreations: [],
      isAdmin: false,
      form: {
        searchText: "",
      },
      searchOptionsShow: false,
      topOptions: false,
      profileShown: false,
      creationsTypes: [],
      email: "",
    };
  },
  created() {
    if (localStorage.getItem("is_admin")) {
      this.isAdmin = true;
    }
    this.email = localStorage.getItem("email");
    this.fetchCreations();
  },
  watch: {
    $route: "fetchCreations",
  },
  methods: {
    fetchCreations() {
      this.loading = true;
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creations`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          this.loading = false;
          if (result.data.result !== undefined) {
            this.creations = result.data.result;
            this.approved = true;
          }
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
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
          alert(`${error}`);
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
          alert(`${error}`);
        });
    },
    searchTextChanged() {
      if (this.form.searchText == "") {
        this.form.optionsCreations = null;
        return;
      }
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creations-search`, {
          params: { string: this.form.searchText },
        })
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.optionsCreations = result.data.result;
          }
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    setSearchOptions(flag) {
      this.searchOptionsShow = flag;
    },
    setTopOptions(flag) {
      this.topOptionsShow = flag;
    },
    setProfileShown(flag) {
      this.profileShown = flag;
    },
  },
};
</script>
<style scoped>
.bar-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}

.options-container {
  border: 1px solid #e7ecf5;
  max-width: 500px;
}

.options-list {
  list-style-type: none;
}

.options-li {
  display: flex;
  flex-direction: row;
  border: none;
  border-bottom: 1px solid gray;
  border-top: 1px solid gray;
  max-height: 60px;
}
</style>>