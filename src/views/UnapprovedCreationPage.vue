<template>
  <custom-header />
  <h1>Добавить произведение</h1>
  <div v-if="isLoading">Загрузка</div>
  <div
    v-if="!isLoading"
    class="grid grid-cols-3 grid-rows-1 pt-4 w-full justify-center"
  >
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
        col-sapn-1 col-start-1

      "
    />
    <form class="flex flex-col items-stretch">
      <MDBInput
        disabled
        label="Название произведения"
        v-model="info.name"
        type="text"
        class="pt-2"
      />
      <MDBInput
        disabled
        label="жанр"
        v-model="info.creation_type"
        type="text"
        class="pt-2"
      />
      <MDBInput label="Страна" v-model="country" type="text" class="pt-2" />
      <MDBInput
        label="Возрастной рейтниг"
        v-model="ageRating"
        type="text"
        class="pt-2"
      />
      <div class="flex flex-row pt-2">
        <label class="pr-4">Дата</label>
        <datepicker v-model="date_published" :locale="locale" class="border" />
      </div>
      <MDBTextarea
        v-model="description"
        label="Описание"
        rows="4"
        class="pt-4"
      />
      <MDBBtn tag="a" color="light" @click="approveCreation">Одобрить</MDBBtn>
      <MDBBtn tag="a" color="light" @click="deleteCreation">Удалить</MDBBtn>
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
        creation_type: "",
        date_published: "",
        description: "",
        country: "",
        age_rating: "",
      },
      description: "",
      country: "",
      age_rating: "",
      date_published: "",
      url: require("@/assets/placeholder.png"),
      isLoading: true,
    };
  },
  async created() {
    this.fetchCreationInfo();
  },
  methods: {
    fetchCreationInfo() {
      const fetchedId = this.$route.params.id;
      axios
        .get(`${APIURL}/creations/${this.$route.params.id}`)
        .then((result) => {
          if (this.$route.params.id !== fetchedId) return;
          if (result.data.result !== undefined) {
            this.info.country = result.data.result.country
              ? result.data.result.country
              : "";
            this.info.age_rating = result.data.result.age_rating
              ? result.data.result.age_rating
              : "";
            this.info.description = result.data.result.description
              ? result.data.result.description
              : "";
            this.info.date_published = result.data.result.date_published
              ? result.data.result.date_published
              : "";
            this.info.name = result.data.result.Creation_Names[0].name
              ? result.data.result.Creation_Names[0].name
              : "";
            this.description = this.info.description;
            this.country = this.info.country;
            this.age_rating = this.info.age_rating;
            this.date_published = this.info.date_published;
            if (result.data.result.image !== undefined) {
              this.url = "data:image/jpg;base64," + result.data.result.image;
            }
            axios
              .get(`${APIURL}/genres/${result.data.result.CreationTypeId}`)
              .then((resultGenre) => {
                this.info.creation_type = resultGenre.data.result.name;
                this.isLoading = false;
              })
              .catch((error) => {
                this.$notify({
                  title: "Произошла ошибка",
                  text: error.response.data.error,
                  type: "error",
                });
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
    approveCreation() {
      const token = localStorage.getItem("token");
      let body = {};
      if (this.country != this.info.country) {
        body.country = this.country;
      }
      if (this.age_rating != this.info.age_rating) {
        body.age_rating = this.age_rating;
      }
      if (this.description != this.info.description) {
        body.description = this.description;
      }
      if (this.date_published != this.info.date_published) {
        body.date_published = this.date_published;
      }
      axios
        .put(`${APIURL}/creations-unapproved/${this.$route.params.id}`, body, {
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
.wrapper {
  display: grid;
}
</style>