import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useSearchStore = create((set) => ({
    isSearching: false,
    search: async (query) => {
        try {
            set({isSearching: true})

            const res = await fetch(`/api/search/${query}`, {
                method:'GET', 
                headers: {
                    Authorization: `Bearer ${useAuthStore.getState().accessToken}`
                }
            })

            if (!res.ok) {
                const error = await res.json()
                return {success: false, message: error.message}
            }

            const data = await res.json()
            return {success: true, message: data.message, users: data.users, posts: data.posts}
        } catch(e) {
            console.error(e)
        } finally {
            set({isSearching: false})
        }
    }
}))