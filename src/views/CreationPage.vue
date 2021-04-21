<template>
  <div class="wrapper">
    <div>
      <h1>{{ info.name }}</h1>
      <h2>{{ info.creation_type }}</h2>
      <h3>{{ info.date_published }}</h3>
      <h3>{{ info.description }}</h3>
      <h3>{{ info.country }}</h3>
      <h3>{{ info.age_rating }}</h3>
    </div>
    <div>
      <ul>
        <h2>Похожие на основе тэгов</h2>
        <li v-for="creation in similar" :key="creation.id">
          <label> {{ creation.name }} </label>
        </li>
      </ul>
    </div>
    <button @Click="deleteCreation">Удалить</button>
    <button @Click="this.$router.go(-1)">Назад</button>
  </div>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";
export default {
  data() {
    return {
      info: null,
      similar: null,
    };
  },
  async created() {
    this.fetchCreationInfo();
    this.fetchSimilar();
  },
  methods: {
    fetchCreationInfo() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creations/${this.$route.params.id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.info = result.data.result;
          }
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    fetchSimilar() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creations-similar`, { headers: { creation_id: fetchedId } })
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.similar = result.data.result;
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },
    deleteCreation() {
      const token = localStorage.getItem("token");
      axios
        .delete(
          `${APIURL}/creations/${this.$route.params.id}`,
          {
            new_record_id: this.$route.params.id,
          },
          { headers: { authorization: token } }
        )
        .then(() => {
          this.$router.push("/main-list");
        })
        .catch((error) => {
          alert(error);
        });
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: grid;
}
</style>