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
const selectUserType = (selectedUserType: string) => {
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
  <v-card
      class="mx-auto pa-12 pb-8 panel"
      elevation="8"
      max-width="600"
      rounded="lg"
      
    >
    
  <div class="d-flex flex-column align-center" id="Flair" style="gap:.5em;" >
    <strong justify-center >USER TYPE </strong>
    
      <v-btn-toggle v-model="toggle_user_type" shaped block outlined mandatory class="buttons" id="Flair">
        <v-btn id="btn" variant="outlined" @click="selectUserType('Client')">Food Pantry Client</v-btn>
        <v-btn id="btn" variant="outlined" @click="selectUserType('Administrator')">Food Pantry Admin</v-btn>
      </v-btn-toggle>
    
  </div>
  <div v-show="hasSelected && userType == 'Client'">
    <v-card elevation ="5" hover style="padding:1em;margin-top: 1em;">
      <CreateClientForm></CreateClientForm>
    </v-card>
    
  </div>
  <div v-show="hasSelected && userType == 'Administrator'">
    <v-card elevation ="5" hover style="padding:1em;margin-top: 1em;">
      <PantryRegistration></PantryRegistration>
    </v-card>
    
  </div>
    </v-card>
  <!-- <h3>Register User</h3>
  <div class="d-flex flex-column" id="Flair">
    <v-col cols="12" class="py-2">
      <v-btn-toggle v-model="toggle_user_type" shaped outlined mandatory class="buttons" id="Flair">
        <v-btn id="btn" @click="selectUserType('Client')">Food Pantry Client</v-btn>
        <v-btn id="btn" @click="selectUserType('Administrator')">Food Pantry Admin</v-btn>
      </v-btn-toggle>
    </v-col>
  </div>
  <div v-show="hasSelected && userType == 'Client'">
    <CreateClientForm></CreateClientForm>
  </div>
  <div v-show="hasSelected && userType == 'Administrator'">
    <PantryRegistration></PantryRegistration>
  </div> -->
  <!-- <button type="submit" class="button default">Register</button> -->

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
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
}
.panel{
  margin-top: 1em;
  width: 40vw;
  gap:10px;
}
</style>
