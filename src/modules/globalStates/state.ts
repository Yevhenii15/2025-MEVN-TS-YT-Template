import { reactive, watch } from "vue";

// initial isLoggedin from localStorage or false
const isLoggedInFromLocalStorage =
  localStorage.getItem("isLoggedIn") === "true";

export const state = reactive({
  isLoggedin: isLoggedInFromLocalStorage,
});

// watch for changes and update localStorage
watch(
  () => state.isLoggedin,
  (newValue) => {
    localStorage.setItem("isLoggedIn", String(newValue));
  }
);
