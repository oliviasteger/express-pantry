<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import CreateClientForm from "./CreateClientForm.vue";
import PantryRegistration from "./PantryRegistration.vue";

const userType = ref("");
const emit = defineEmits(["accountCreated"]);
const { createUser, loginUser, updateSession } = useUserStore();
const toggle_user_type = ref(null);
const hasSelected = ref(false);
const selectUserType = (selectedUserType:string) => {
  userType.value = selectedUserType; 
  hasSelected.value = true;

};

async function register() {
  void updateSession();
  emit("accountCreated");
  // void router.push({ name: "Home" });
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="register">
    <h3>Register User</h3>
    <div class="d-flex flex-column " id="Flair">
      <v-col
        cols="12"
        class="py-2"
      >

        <v-btn-toggle
          v-model="toggle_user_type"
          shaped
          outlined
          mandatory
          class="buttons"
          id="Flair"
        >
          <v-btn id="btn" @click="selectUserType('Adminstrator')">Food Pantry Client</v-btn>
          <v-btn id="btn" @click="selectUserType('Client')">Food Pantry Admin</v-btn>
          
        </v-btn-toggle>
      </v-col>
    </div>
    <div v-show="hasSelected && userType == 'Client'">
      <CreateClientForm></CreateClientForm>

    </div>
    <div v-show="hasSelected && userType == 'Adminstrator'">
      <PantryRegistration></PantryRegistration>

    </div>
    <button type="submit" class="button default">Register</button>
      

    <!-- <fieldset>
      <div class="pure-control-group">
        <h3 for="UserType">Account Type</h3>
        <div class="radio-container">
          <div>
            <input type="radio" value="Food Pantry Admin" v-model="userType" id="Food Pantry Admin" />
            <label for="foodPantryAdmin">Food Pantry Admin</label>
          </div>
          <div>
            <input type="radio" value="Client" v-model="userType" id="Client" />
            <label for="client">Client</label>
          </div>
        </div>
      </div>
      <br />
      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">Register</button>
      </div>
    </fieldset> -->
  </form>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
}
</style>
