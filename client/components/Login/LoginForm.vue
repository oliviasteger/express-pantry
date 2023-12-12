<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const emit = defineEmits(["register"]);
const { loginUser, updateSession, updateType } = useUserStore();
const visible = ref(false);
``;
async function login() {
  console.log("HERE");
  await loginUser(username.value, password.value);
  void updateSession();
  void updateType();
  await router.push({ name: "Home" });
}
</script>

<template>
    <v-card
      class="mx-auto pa-12 pb-8 panel"
      elevation="8"
      max-width="600"
      rounded="lg"
      @submit.prevent="login"
    >
    <form @submit.prevent="login">
    <h2>Login</h2>
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-text-field
        v-model.trim="username"
        density="compact"
        placeholder="Username"
        prepend-inner-icon="mdi-account"
        variant="outlined"
        required 
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password
      </div>

      <v-text-field
        v-model.trim="password"
        required
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-card
        class="mb-12"
        color="secondary"
        variant="tonal"
      >
        <v-card-text class="text-medium-emphasis text-caption">
          Username must be unique.
        </v-card-text>
      </v-card>

      <v-btn
        block
        class="mb-8"
        color="primary"
        size="large"
        variant="tonal"
        type="submit"
      >
        Log In
      </v-btn>

      <v-card-text class="text-center"  @click="emit('register')">
        <a
          class="text-blue text-decoration-none"
        >
          Register now <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>
    </form>
    </v-card>
  <!-- <form class="pure-form pure-form-aligned column" @submit.prevent="login">
    <h3>Login</h3>
    <fieldset>
      <div class="pure-control-group center">
        <label for="aligned-name">Username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <div class="pure-control-group center">
        <label for="aligned-password">Password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>
      <div class="pure-controls">
        <button type="submit" class="button default">Submit</button>
      </div>
      <div class="row">
        <h6>Don't have an account</h6>
        <label name="Register Here" class="small" @click="emit('register')"> Register Here </label>
      </div>
    </fieldset>
  </form> -->
</template>

<style>
h3,
h6 {
  display: flex;
  justify-content: center;
}
.panel{
  margin-top: 1em;
  width: 40vw;
  gap:10px;
}
.small {
  font-size: small;
  color: var(--lighter-header);
  text-decoration: underline;
}
.back {
  background-color: var(--light-grey);
  padding: 0.1em;
  border-radius: 0.5em;
}
.center {
  display: flex;
  align-self: center;
}
.row {
  margin: 0 auto;
  max-width: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}
</style>
