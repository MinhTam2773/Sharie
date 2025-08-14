import { create } from "zustand";
import api from "../lib/fetchInterceptor";

export const useUserStore = create((set, get) => ({
    selectedUser: null,
    isGettingUser: false,
    followStatus: false,
    getTargetUser: async (username) => {
        try {
            set({ isGettingTargetUser: true })

            const res = await api.get(`/users/${username}`)

            if (!res.data.success) return { success: false, message: res.data.message }

            set({ selectedUser: res.data.user, followStatus: res.data.isFollowing })
            return { success: res.data.success, message: res.data.message }
        } catch (e) {
            console.error(e)
        } finally {
            set({ isGettingTargetUser: false })
        }
    },
    follow: async () => {
        try {
            const res = await api.post(`/users/follow/${get().selectedUser._id}`)

            if (!res.data.success) return { success: false, message: res.data.message }

            set({ followStatus: true })
            return { success: true, message: res.data.message }
        } catch (e) {
            console.error(e)
        }
    },
    unfollow: async () => {
        try {
            const res = await api.delete(`/users/unfollow/${get().selectedUser._id}`)

            if (!res.data.success) return { success: false, message: res.data.message }

            set({ followStatus: false })
            return { success: true, message: res.data.message }
        } catch (e) {
            console.error(e)
        }
    }
}))