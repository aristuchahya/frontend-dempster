import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => {
    const token = sessionStorage.getItem("token") || "";
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    return {
      user_id: user.id || null,
      role: user.role || null,
      token,
      user,
    };
  },
  actions: {
    setAuth(token: string, user: any) {
      this.token = token;
      this.user = user;
      this.user_id = user.id;
      this.role = user.role;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
    },
    logout() {
      this.token = "";
      this.user = {};
      this.user_id = null;
      this.role = null;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    },
  },
  getters: {
    getUserId: (state) => state.user_id,
    getRole: (state) => state.role,
    getUsername: (state) => state.user.username,
    isAuthenticated: (state) => !!state.token,
  },
});
