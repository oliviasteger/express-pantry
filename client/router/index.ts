import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import FoodListComponent from "../components/Food/FoodListComponent.vue";
import EditProfileForm from "../components/Profile/EditProfileForm.vue";
import AccountView from "../views/AccountView.vue";
import CartView from "../views/CartView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import MapView from "../views/MapView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import OrderConfirmationView from "../views/OrderConfirmationView.vue";
import OrdersView from "../views/OrdersView.vue";
import ProfileView from "../views/ProfileView.vue";
import RequestViewVue from "../views/RequestView.vue";
import SettingView from "../views/SettingView.vue";
import ShopView from "../views/ShopView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/map",
      name: "Map",
      component: MapView,
      meta: { requiresAuth: true },
    },
    {
      path: "/shop/:shopId",
      name: "Shop",
      component: ShopView,
      props: (route) => ({
        order: JSON.parse(route.query.order ? (route.query.order as unknown as string) : "{}"),
      }),
      meta: { requiresAuth: true },
    },
    {
      path: "/cart/:shopId",
      name: "Cart",
      component: CartView,
      props: (route) => ({
        order: JSON.parse(route.query.order as unknown as string),
      }),
      meta: { requiresAuth: true },
    },
    {
      path: "/order/:shopId",
      name: "OrderConfirmation",
      component: OrderConfirmationView,
      props: (route) => ({
        order: JSON.parse(route.query.order as unknown as string),
      }),
      meta: { requiresAuth: true },
    },
    {
      path: "/account",
      name: "Account",
      component: AccountView,
      meta: { requiresAuth: true },
    },
    {
      path: "/orders",
      name: "Orders",
      component: OrdersView,
      meta: { requiresAuth: true },
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
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
      path: "/requests",
      name: "Requests",
      component: RequestViewVue,
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
