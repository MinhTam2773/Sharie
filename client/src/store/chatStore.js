import { create } from "zustand";
import { useAuthStore } from "./authStore";

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
            const res = await fetch(`/api/messages/${get().selectedChat._id}/send-message`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    Authorization:`Bearer ${useAuthStore.getState().accessToken}`
                },
                body: JSON.stringify(newMessage)
            })

            if (!res.ok) {
                const error = await res.json()
                console.log(error.message)
                return {success: false, message: error.message}
            }

            const data = await res.json()
            return {success: data.success, message: data.message}
        } catch(e) {
            console.log(e)
        }   
    },
    getChats: async () => {
        try {
            set({ isLoadingChats: true })

            const res = await fetch('/api/chats/', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${useAuthStore.getState().accessToken}`
                }
            })

            if (!res.ok) {
                const error = await res.json()
                return { success: false, message: error.message }
            }

            const data = await res.json()
            set({chats: data.chats})
            return { success: true, message: data.message, chats: data.chats }
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

            const res = await fetch(`/api/messages/${chatId}?limit=20`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${useAuthStore.getState().accessToken}`
                }
            })

            if (!res.ok) {
                const error = await res.json()
                return { success: false, message: error.message }
            }

            const data = await res.json()
            set({ messages: data.messages })
            return { success: true, message: data.message }
        } catch (e) {
            console.error(e)
        }
    },
    loadMoreMessages: async(page) => {
        const {messages, selectedChat} = get()

        try {
            set({isLoadingMoreMessages: true})

            const res = await fetch(`/api/messages/${selectedChat._id}?p=${page}&limit=20`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${useAuthStore.getState().accessToken}`
                }
            })

            if (!res.ok) {
                const error = await res.json()
                return { success: false, message: error.message }
            }

            const data = await res.json()
            set({ messages: [...data.messages, ...messages] })
            return { success: true, message: data.message,messages: data.messages.map(message => message.text)  }
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