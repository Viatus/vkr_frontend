<template>
  <div>
    <h1>Добавить произведение</h1>
    <form>
      <div class="input_container">
        <input
          v-model="form.name"
          type="text"
          placeholder="Название произведения"
          class="form-input"
        />
        <select v-model="form.type">
          <option>Выберите жанр</option>
          <option v-for="genre in genres" :value="genre.name" :key="genre.id">
            {{ genre.name }}
          </option>
        </select>
        <input
          v-model="form.description"
          type="text"
          placeholder="Описание"
          class="form-input"
        />
        <input
          v-model="form.country"
          type="text"
          placeholder="Страна"
          class="form-input"
        />
        <ul>
          <li v-for="choosenTag in choosenTags" :key="choosenTag.id">
            <label> {{ choosenTag.name }} </label>
          </li>
        </ul>
        <div>
        </div>
        <button v-on:click="sendCreation">Отправить</button>
        <h1>Чуть позже появятся авторы</h1>
        <button @click="$router.push('/main-list')">Назад</button>
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";

export default {

  data() {
    return {
      form: {
        name: "",
        description: "",
        country: "",
        type: "Выберите жанр",
        date: "2020",
      },
      genres: null,
      tags: null,
      choosenTags: ["Horror"],
    };
  },
  async created() {
    this.fetchGenres();
    this.fetchTags();
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
    tagSelected(tag) {
      if (!this.choosenTags.includes(tag)) {
        this.choosenTags.add(tag);
        this.toggleShow();
      }
    },
    sendCreation() {
      const token = localStorage.getItem("token");
      axios
        .post(
          `${APIURL}/creations`,
          {
            name: this.form.name,
            date_published: null,
            description: this.form.description,
            country: this.form.country,
            age_rating: "12+",
            creation_type: this.form.type,
            tags: this.choosenTags,
          },
          { headers: { authorization: token } }
        )
        .then((result) => {
          alert(result.status);
        })
        .catch((error) => {
          alert(error);
        });
    },
  },
};
</script>
<style scoped>
.input_container {
  display: grid;
}
</style>
