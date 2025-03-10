import { ref } from "vue";
import type { User } from "../../interfaces/interfaces";
import { state } from "../globalStates/state";

export const useUsers = () => {
  const token = ref<string | null>(null);
  /* const isLoggedIn = ref<boolean>(false); */
  const error = ref<string | null>(null);
  const user = ref<User | null>(null);

  const name = ref<string>("");
  const email = ref<string>("");
  const password = ref<string>("");

  const fetchToken = async (email: string, password: string): Promise<void> => {
    try {
      const apiBaseUrl = import.meta.env.VITE_LOCAL_HOST_API;
      console.log("API Base URL:", apiBaseUrl);
      const response = await fetch(`${apiBaseUrl}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("lstoken") || "",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        console.log(errorResponse.error || "Error");
        throw new Error("No data available");
      }

      const authResponse = await response.json();
      token.value = authResponse.data.token;
      user.value = authResponse.data.user;
      state.isLoggedin = true;

      localStorage.setItem("lstoken", authResponse.data.token);
      localStorage.setItem("userID", authResponse.data.userId);
      console.log("User is logged in:", authResponse);
      console.log("Token:", token.value);
    } catch (err) {
      error.value = (err as Error).message || "An error occurred";
      state.isLoggedin = false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      const apiBaseUrl = import.meta.env.VITE_LOCAL_HOST_API;
      const response = await fetch(`${apiBaseUrl}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      if (!response.ok) {
        throw new Error("No data available");
      }

      const authResponse = await response.json();
      token.value = authResponse.data.token;
      user.value = authResponse.data.user;

      localStorage.setItem("lstoken", authResponse.data.token);
      console.log("User is registered in:", authResponse);
    } catch (err) {
      error.value = (err as Error).message || "An error occurred";
      state.isLoggedin = false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    state.isLoggedin = false;
    localStorage.removeItem("lstoken");
    console.log("User is logged out");
  };

  return {
    token,
    isLoggedIn: state.isLoggedin,
    error,
    user,
    name,
    email,
    password,
    fetchToken,
    registerUser,
    logout,
  };
};
