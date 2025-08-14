import { create } from "zustand";
import { useAuthStore } from "./authStore";
import api from "../lib/fetchInterceptor.js";

export const useChatStore = create((set, get) => ({
    isLoadingChats: false,
    isGettingMessages: false,
    isLoadingMoreMessages: false,
    messages: [],
    onlineUsers: [],
    selectedChat: null,
    chats: [],

    sendMessage: async (newMessage) => {
        try {
            const res = await api.post(`/messages/${get().selectedChat._id}/send-message`, newMessage)
            if (!res.data.success) return {success: false, message: res.data.message}
            
            return {success: res.data.success, message: res.data.message}
        } catch(e) {
            console.log(e)
        }   
    },
    getChats: async () => {
        try {
            set({ isLoadingChats: true })

            const res = await api.get('/chats/')

            if (!res.data.success) return {success: false, message: res.data.message}

            set({chats: res.data.chats})
            return { success: true, message: res.data.message, chats: res.data.chats }
        } catch (e) {
            console.error(e.message)
        } finally {
            set({ isLoadingChats: false })
        }
    },
    getRecentMessages: async (chatId) => {
        const {selectedChat} = get()
        if (!selectedChat || !selectedChat._id) return;

        try {
            set({ isGettingMessages: true })

            const res = await api.get(`/messages/${chatId}?limit=20`)
            if (!res.data.success) return {success: false, message: res.data.message}

            set({ messages: res.data.messages })
            return { success: true, message: res.data.message }
        } catch (e) {
            console.error(e)
        }
    },
    loadMoreMessages: async(page) => {
        const {messages, selectedChat} = get()

        try {
            set({isLoadingMoreMessages: true})

            const res = await api.get(`/api/messages/${selectedChat._id}?p=${page}&limit=20`)
            if (!res.data.success) return {success: false, message: res.data.message}

            set({ messages: [...res.data.messages, ...messages] })
            return { success: true, message: res.data.message,messages: res.data.messages.map(message => message.text)  }
        } catch(e) {
            console.error(e)
        } finally {
            set({isLoadingMoreMessages: false})
        }
    },
    subcribeToMessage: () => {
        try {
            if (!get().selectedChat) return

            useAuthStore.getState().socket.on('newMessage', (newMessage) => {
                if (get().selectedChat._id !== newMessage.chatId) return

                set({ messages: [...get().messages, newMessage] })
            })
        } catch (e) {
            console.error(e)
        }
    },
    unSubscribeToMessage: () => {
        try {
            useAuthStore.getState().socket.off("newMessage")
        } catch (e) {
            console.error(e)
        }
    },
    setSelectedChat: (chat) => set({ selectedChat: chat })
}))