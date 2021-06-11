<template>
  <div class="top-container">
    <custom-header />
    <div class="parent_container">
      <h1>Добавить автора</h1>
      <div class="outer_container">
        <img v-if="url" :src="url" class="image_preview" />
        <form class="input_container">
          <input
            v-model="form.name"
            type="text"
            placeholder="Полное имя"
            class="form-input"
          />
          <input
            v-model="form.country"
            type="text"
            placeholder="Страна"
            class="form-input"
          />
          <datepicker v-model="form.date" :locale="locale" />
          <textarea
            v-model="form.description"
            type="text"
            placeholder="Описание"
            class="form-textarea"
          />
          <label> Добавить фотографию: </label>
          <input
            type="file"
            accept="image/*"
            @change="previewImage($event)"
            id="file-input"
          />
          <button type="button" @click="sendAuthor">Отправить</button>
          <button type="button" @click="$router.push('/main-list')">
            Назад
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import FormData from "form-data";
import { APIURL } from "../constants";
import Datepicker from "vue3-datepicker";
import { ru } from "date-fns/locale";
import CustomHeader from "../components/CustomHeader";

export default {
  components: {
    datepicker: Datepicker,
    "custom-header": CustomHeader,
  },
  data() {
    return {
      form: {
        name: "",
        description: "",
        country: "",
        date: null,
      },
      authors: null,
      url: require("@/assets/logo.png"),
      locale: ru,
      image: null,
    };
  },
  async created() {
    this.fetchAuthors();
  },
  methods: {
    fetchAuthors() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/authors`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.authors = result.data.result;
          }
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    sendAuthor() {
      if (this.form.name == "") {
        alert("Не заполнено имя автора");
        return;
      }
      if (this.form.description == "") {
        alert("Не заполнено описание");
        return;
      }
      const token = localStorage.getItem("token");
      var bodyFormData = new FormData();
      bodyFormData.append("cover", this.image);
      bodyFormData.append("name", this.form.name);
      bodyFormData.append("birthday", this.form.date);
      bodyFormData.append("description", this.form.description);
      bodyFormData.append("country", this.form.country);
      axios
        .post(`${APIURL}/authors`, bodyFormData, {
          headers: {
            authorization: token,
          },
        })
        .then((result) => {
            alert(result.status);
        })
        .catch((error) => {
          alert(error.message);
        });
    },
    previewImage(event) {
      this.image = event.target.files[0];
      this.url = URL.createObjectURL(this.image);
    },
  },
};
</script>
<style scoped>
</style>