<template>
  <div class="parent_container">
    <custom-header />
    <div>
      <div v-if="loading" class="loading">Loading...</div>

      <div v-if="!loading">
        <ul list-style="">
          <li v-for="creation in creations" :key="creation.id">
            <div class="list-item">
              <h5 v-if="creation.CreationTypeId == 2" class="creation_type">
                Книга
              </h5>
              <h5 v-if="creation.CreationTypeId == 3" class="creation_type">
                Фильм
              </h5>
              <h5 v-if="creation.CreationTypeId == 4" class="creation_type">
                Сериал
              </h5>
              <h4
                v-if="approved"
                class="creation_name"
                @click="$router.push(`/creations/${creation.id}`)"
              >
                {{ creation.name }}
              </h4>
              <h4
                v-if="!approved"
                class="creation_name"
                @click="$router.push(`/unapproved-creations/${creation.id}`)"
              >
                {{ creation.name }}
              </h4>
            </div>
          </li>
        </ul>

        <button v-if="approved" @click="$router.push(`/add-creation`)">
          Добавить произведение
        </button>
        <button @click="logout">Выйти</button>
        <button v-if="isAdmin && approved" @click="fetchUnapprovedCreations">
          Список ожидающих одобрения
        </button>
        <button v-if="isAdmin && !approved" @click="fetchCreations">
          Список одобренных
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";
import CustomHeader from "../components/CustomHeader";

export default {
  components: {
    "custom-header": CustomHeader,
  },
  data() {
    return {
      loading: false,
      creations: null,
      optionsCreations: null,
      isAdmin: false,
      approved: true,
      form: {
        searchText: "",
      },
      optionsShow: false,
    };
  },
  created() {
    if (localStorage.getItem("is_admin")) {
      this.isAdmin = true;
    }
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
    fetchUnapprovedCreations() {
      this.loading = true;
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creations-unapproved`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          this.loading = false;
          if (result.data.result !== undefined) {
            this.creations = result.data.result;
            this.approved = false;
          }
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    logout() {
      localStorage.setItem("token", "");
      this.$router.push("/");
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
    setOptions() {
      this.optionsShow = true;
    },
    hideOptions() {
      this.optionsShow = false;
    },
  },
};
</script>
<style scoped>
.list-item {
  display: grid;
}

.creation_type {
  opacity: 0.5;
}

.parent_container {
  display: flex;
  flex-direction: column;
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
</style>
