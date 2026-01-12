
import { defineStore } from 'pinia'

interface UserState {
  id: string | null
}

export const useResultStore = defineStore('user_result', {
  state: (): UserState => ({
    id: sessionStorage.getItem("user_id"),
  }),
  actions: {
    setUser(id: string) {
      this.id = id
      sessionStorage.setItem("user_id", id)
    },
    clear() {
      this.id = null
      sessionStorage.removeItem("user_id") // ✅ hapus
    }
  },
  getters: {
    getId: (state) => state.id,
  },
})
