<template>
  <custom-header />
  <h1>Добавить участника</h1>
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
        p-2
        col-sapn-1
        col-start-1
      "
    />
    <form class="flex flex-col items-stretch col-span-2 col-start-2 p-4">
      <MDBInput
        label="Имя участника"
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
      <MDBFile
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
import { MDBBtn, MDBInput, MDBTextarea,MDBFile } from "mdb-vue-ui-kit";

export default {
  components: {
    datepicker: Datepicker,
    "custom-header": CustomHeader,
    MDBInput,
    MDBBtn,
    MDBTextarea,
    MDBFile,
  },
  data() {
    return {
      form: {
        name: "",
        description: "",
        country: "",
        date: null,
      },
      url: require("@/assets/placeholder.png"),
      locale: ru,
      image: null,
    };
  },
  methods: {
    sendAuthor() {
      if (this.form.name == "") {
        this.$notify({
          title: "Ошибка при вводе",
          text: "Не заполнено имя участника",
          type: "error",
        });
        return;
      }
      if (this.form.description == "") {
        this.$notify({
          title: "Ошибка при вводе",
          text: "Не заполнено описание",
          type: "error",
        });

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
            this.$notify({
              title: "Успех",
              text: "Запись добавлена",
              type: "success",
            });
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
    previewImage(event) {
      this.image = event.target.files[0];
      this.url = URL.createObjectURL(this.image);
    },
  },
};
</script>
<style scoped>
</style>