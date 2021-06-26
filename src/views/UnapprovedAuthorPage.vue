<template>
  <custom-header />
  <h1>Одобрить участника</h1>
  <div v-if="isLoading">Загрузка</div>
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
        disabled
        label="Имя участника"
        v-model="info.name"
        type="text"
        class="pt-2"
      />
      <MDBInput label="Страна" v-model="country" type="text" class="pt-2" />
      <div class="flex flex-row pt-2">
        <label class="pr-4">День рождения</label>
        <datepicker v-model="birthday" :locale="locale" class="border" />
      </div>
      <MDBTextarea
        v-model="description"
        label="Описание"
        rows="4"
        class="pt-4"
      />
      <MDBBtn tag="a" color="light" @click="approveAuthor()">Одобрить</MDBBtn>
      <MDBBtn tag="a" color="light" @click="deleteAuthor()">Удалить</MDBBtn>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";
import Datepicker from "vue3-datepicker";
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
      info: {
        name: "",
        birthday: "",
        description: "",
        country: "",
      },
      description: "",
      country: "",
      birthday: "",
      url: require("@/assets/placeholder.png"),
      isLoading: true,
    };
  },
  async created() {
    this.fetchAuthorInfo();
  },
  methods: {
    fetchAuthorInfo() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/authors/${this.$route.params.id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.info.country = result.data.result.country
              ? result.data.result.country
              : "";
            this.info.description = result.data.result.description
              ? result.data.result.description
              : "";
            this.info.birthday = result.data.result.birthday
              ? result.data.result.birthday
              : "";
            this.info.name = result.data.result.name
              ? result.data.result.name
              : "";
            this.description = this.info.description;
            this.country = this.info.country;
            this.birthday = this.info.birthday;
            if (result.data.result.image !== undefined) {
              this.url = "data:image/jpg;base64," + result.data.result.image;
            }
            this.isLoading = false;
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
    approveAuthor() {
      const token = localStorage.getItem("token");
      let body = {};
      if (this.country != this.info.country) {
        body.country = this.country;
      }
      if (this.description != this.info.description) {
        body.description = this.description;
      }
      if (this.birthday != this.info.birthday) {
        body.birthday = this.birthday;
      }
      axios
        .put(`${APIURL}/unapproved-authors/${this.$route.params.id}`, body, {
          headers: { authorization: token },
        })
        .then(() => {
          this.$router.push("/profile");
        })
        .catch((error) => {
          this.$notify({
            title: "Произошла ошибка",
            text: error.response.data.error,
            type: "error",
          });
        });
    },
    deleteAuthor() {
      const token = localStorage.getItem("token");
      axios
        .delete(
          `${APIURL}/authors/${this.$route.params.id}`,
          {
            new_record_id: this.$route.params.id,
          },
          { headers: { authorization: token } }
        )
        .then(() => {
          this.$router.push("/profile");
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