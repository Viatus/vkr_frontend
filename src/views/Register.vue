<template>
  <div class="wrapper">
    <h1>Регистрация</h1>
    <form @submit.prevent="register">
      <div class="input_container">
        <input v-model="form.email" type="text" placeholder="Электронная почта" class="form-input" />
        <input v-model="form.nickname" type="text" placeholder="Никнейм" class="form-input" />
        <input v-model="form.password" type="password" placeholder="Пароль" class="form-input" />
      </div>
      <div class="button_container">
        <input type="submit" value="Зарегистрироваться" class="custom_button" />
        <button type="button" @click="$router.push('/')" class="custom_button">
          Войти
        </button>
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
      form: { name: "", password: "" },
    };
  },
  methods: {
    async register() {
      const { email, nickname, password } = this.form;
      if ((!email, !nickname || !password)) {
        alert("Username, nickname and password are required");
      }
      try {
        await axios.post(`${APIURL}/register`, {
          email,
          nickname,
          password,
        });
        alert("Registration successful");
      } catch (error) {
        alert("Registration failed.");
      }
    },
  },
};
</script>

<style scoped>
.form-input {
  border: 2px solid #9e9e9e;
  border-radius: 12px;
  padding: 3px;
  margin-top: 2px;
  margin-bottom: 2px;
  font-size: 14px;
  font-family: Verdana;
  background: #fff;
  width: auto;
}

.form-input:focus {
  border: 2px solid rgb(100, 100, 100);
}

.custom_button {
  border-radius: 16px;
  padding: 8px;
  background-color: white;
  border-color: lightgray;
  transition-duration: 0.4s;
  margin: 10px;
}

.custom_button:hover {
  background-color: #bdfcb6;
  box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.24), 0 17px 50px 0 rgba(0, 0, 0, 0.19);
}

.wrapper {
  width: 300px;
  margin: auto;
  margin-top: 25%;
  text-align: center;
}

.button_container {
  display: grid;
}

.input_container {
  display: block;
  justify-content: center;
}
</style>