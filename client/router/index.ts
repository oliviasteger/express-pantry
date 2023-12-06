import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import FoodListComponent from "../components/Food/FoodListComponent.vue";
import EditProfileForm from "../components/Profile/EditProfileForm.vue";
import AccountView from "../views/AccountView.vue";
import AdminOrdersView from "../views/AdminOrdersView.vue";
import AdminSettingView from "../views/AdminSettingView.vue";
import ClientOrdersView from "../views/ClientOrdersView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import MapView from "../views/MapView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import ProfileView from "../views/ProfileView.vue";
import SettingView from "../views/SettingView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/",
      name: "Map",
      component: MapView,
      meta: { requiresAuth: true },
    },
    {
      path: "/account",
      name: "Account",
      component: AccountView,
      meta: { requiresAuth: true },
    },
    {
      path: "/adminorders",
      name: "Admin Orders",
      component: AdminOrdersView,
      meta: { requiresAuth: true },
    },

    {
      path: "/clientorders",
      name: "Client Orders",
      component: ClientOrdersView,
      meta: { requiresAuth: true },
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/adminsetting",
      name: "Admin Settings",
      component: AdminSettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/adminprofile",
      name: "Profile",
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/editProfile",
      name: "Edit Profile",
      component: EditProfileForm,
      meta: { requiresAuth: true },
    },
    {
      path: "/inventory",
      name: "Inventory",
      component: FoodListComponent,
      meta: { requiresAuth: true },
    },

    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
