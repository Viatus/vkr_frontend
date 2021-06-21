<template>
  <custom-header />
  <h1>Добавить автора</h1>
  <div class="grid grid-cols-3 grid-rows-1 pt-4 w-full justify-center">
    <img
      v-if="url"
      :src="url"
      class="
        row-span-1
        rounded-none
        lg:rounded-lg
        shadow-xl
        hidden
        lg:block
        m-6
      "
    />
    <form class="flex flex-col items-stretch">
      <MDBInput
        label="Имя автора"
        v-model="form.name"
        type="text"
        class="pt-2"
      />
      <MDBInput
        label="Страна"
        v-model="form.country"
        type="text"
        class="pt-2"
      />
      <div class="flex flex-row pt-2">
        <label class="pr-4">День рождения</label>
        <datepicker v-model="form.date" :locale="locale" class="border" />
      </div>
      <MDBTextarea
        v-model="form.description"
        label="Описание"
        rows="4"
        class="pt-4"
      />
      <label> Добавить фотографию: </label>
      <input
        type="file"
        accept="image/*"
        @change="previewImage($event)"
        id="file-input"
      />
      <MDBBtn tag="a" color="light" @click="sendAuthor">Отправить</MDBBtn>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import FormData from "form-data";
import { APIURL } from "../constants";
import Datepicker from "vue3-datepicker";
import { ru } from "date-fns/locale";
import CustomHeader from "../components/CustomHeader";
import { MDBBtn, MDBInput, MDBTextarea } from "mdb-vue-ui-kit";

export default {
  components: {
    datepicker: Datepicker,
    "custom-header": CustomHeader,
    MDBInput,
    MDBBtn,
    MDBTextarea,
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
      url: require("@/assets/placeholder.png"),
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
          if (result.status == 201) {
            alert("Добавление прошло успешно");
          }
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