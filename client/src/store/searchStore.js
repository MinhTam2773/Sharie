import { create } from "zustand";
import api from "../lib/fetchInterceptor.js";

export const useSearchStore = create((set) => ({
    isSearching: false,
    search: async (query) => {
        try {
            set({isSearching: true})

            const res = await api.get(`/search/${query}`)

            if (!res.data.success) return {success: false, message: res.data.message}

            return {success: true, message: res.data.message, users: res.data.users, posts: res.data.posts}
        } catch(e) {
            console.error(e)
        } finally {
            set({isSearching: false})
        }
    }
}))