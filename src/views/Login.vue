<template>
  <div class="min-h-screen bg-gray-100 p-0 sm:p-12">
    <div
      v-if="alertOpen"
      :class="{
        'text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-400': isError,
        'text-white px-6 py-4 border-0 rounded relative mb-4 bg-green-400': !isError,
      }"
    >
      <span class="text-xl inline-block mr-5 align-middle">
        <i class="fas fa-bell"></i>
      </span>
      <span class="inline-block align-middle mr-8">
        {{ alertText }}
      </span>
      <button
        class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
        v-on:click="closeAlert()"
      >
        <span>×</span>
      </button>
    </div>
    <div
      class="mx-auto max-w-md px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl"
    >
      <h1 class="text-2xl font-bold mb-8">Вход</h1>
      <form @submit.prevent="login">
        <div class="relative z-0 w-full mb-5">
          <input
            v-model="form.email"
            type="text"
            placeholder=" "
            class="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
            id="email"
          />
          <label
            for="email"
            class="absolute duration-300 top-3 -z-1 origin-0 text-gray-500"
            >Введите адрес электронной почты</label
          >
          <span class="text-sm text-red-600" id="error" v-if="noEmail"
            >Необходимо ввести адрес электронной почты</span
          >
        </div>
        <div class="relative z-0 w-full mb-5">
          <input
            v-model="form.password"
            type="password"
            placeholder=" "
            class="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
            id="password"
          />
          <label
            for="password"
            class="absolute duration-300 top-3 -z-1 origin-0 text-gray-500"
            >Введите пароль</label
          >
          <span class="text-sm text-red-600" id="error" v-if="noPassword"
            >Необходимо ввести пароль</span
          >
        </div>
        <button
          id="button"
          type="button"
          class="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-green-500 hover:bg-green-600 hover:shadow-lg focus:outline-none"
          @click="login()"
        >
          Войти
        </button>
        <button
          id="button"
          type="button"
          class="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-green-500 hover:bg-green-600 hover:shadow-lg focus:outline-none"
          @click="$router.push('/register')"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { APIURL } from "../constants";
export default {
  data() {
    return {
      form: { email: "", password: "" },
      noPassword: false,
      noEmail: false,
      alertOpen: false,
      isError: false,
      alertText: "",
    };
  },
  methods: {
    async login() {
      const { email, password } = this.form;
      var isOk = true;
      if (!email) {
        isOk = false;
        this.noEmail = true;
      } else {
        this.noEmail = false;
      }
      if (!password) {
        isOk = false;
        this.noPassword = true;
      } else {
        this.noPassword = false;
      }
      if (!isOk) {
        this.isError = true;
        this.alertText = "Не все поля введены";
        this.alertOpen = true;
        return;
      }
      try {
        const {
          data: { token, is_admin },
        } = await axios.post(`${APIURL}/login`, {
          email,
          password,
        });
        localStorage.setItem("token", token);
        localStorage.setItem("is_admin", is_admin);
        localStorage.setItem("email", email);
        this.isError = false;
        this.alertText = "Вход произведен успешно";
        this.alertOpen = true;
        this.$router.push("/main-list");
      } catch (error) {
        this.isError = true;
        this.alertText = "Произошла ошибка при входе";
        this.alertOpen = true;
      }
    },
    closeAlert: function () {
      this.alertOpen = false;
    },
  },
};
</script>

<style scoped>
input:focus ~ label,
input:not(:placeholder-shown) ~ label,
textarea:focus ~ label,
textarea:not(:placeholder-shown) ~ label,
select:focus ~ label,
select:not([value=""]):valid ~ label {
  /* @apply transform; scale-75; -translate-y-6; */
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y))
    rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
    scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  --tw-scale-x: 0.75;
  --tw-scale-y: 0.75;
  --tw-translate-y: -1.5rem;
}

input:focus ~ label,
select:focus ~ label {
  /* @apply text-black; left-0; */
  --tw-text-opacity: 1;
  color: rgba(0, 0, 0, var(--tw-text-opacity));
  left: 0px;
}
</style>