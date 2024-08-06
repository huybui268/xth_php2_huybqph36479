// plugins/vue3-toastify.js
import { defineNuxtPlugin } from "#app";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  const options = {
    autoClose: 5000,
    position: "top-right",
    newestOnTop: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: "light",
  };

  nuxtApp.vueApp.use(Vue3Toastify, options);
});
