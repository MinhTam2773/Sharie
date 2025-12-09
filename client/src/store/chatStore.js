import { create } from "zustand";
import { useAuthStore } from "./authStore";
import api from "../lib/fetchInterceptor.js";

export const useChatStore = create((set, get) => ({
    isLoadingChats: false,
    isGettingMessages: false,
    isLoadingMoreMessages: false,
    messages: [],
    onlineUsers: [],
    chats: [],
    selectedChat: null,

    sendMessage: async (newMessage) => {
        try {
            const res = await api.post(`/messages/${get().selectedChat._id}/send-message`, newMessage)
            if (!res.data.success) return { success: false, message: res.data.message }

            return { success: res.data.success, message: res.data.message }
        } catch (e) {
            console.log(e)
        }
    },
    startMessage: async (userId, newMessage) => {
        try {
            const res = await api.post(`/messages/${userId}/start-message`, newMessage)

            if (!res.data.success) return { success: false, message: res.data.message }

            set({ selectedChat: { ...get().selectedChat, _id: res.data.chatId } })

            return { success: true, message: res.data.message }
        } catch (e) {
            console.error(e)
            return { message: e.message }
        }
    },
    getChats: async () => {
        try {
            set({ isLoadingChats: true })

            const res = await api.get('/chats/')

            if (!res.data.success) return { success: false, message: res.data.message }

            set({ chats: res.data.chats })
            return { success: true, message: res.data.message, chats: res.data.chats }
        } catch (e) {
            console.error(e.message)
        } finally {
            set({ isLoadingChats: false })
        }
    },
    getRecentMessages: async (chatId) => {
        const { user } = useAuthStore.getState()
        if (!chatId) {
            set({ messages: [] })
            return
        }
        try {
            set({ isGettingMessages: true })

            const res = await api.get(`/messages/${chatId}?limit=20`)
            if (!res.data.success) return { success: false, message: res.data.message }

            set({ messages: res.data.messages })

            //update seen message in main screen
            const updatedChats = get().chats.map(chat => {
                if (chat._id === chatId) {
                    chat.lastMessage?.seenBy.push(user._id)
                    return chat
                }
                return chat
            })
            set({ chats: updatedChats })

            return { success: true, message: res.data.message }
        } catch (e) {
            console.error(e)
        } finally {
            set({ isGettingMessages: false })
        }
    },
    loadMoreMessages: async (page) => {
        const { messages, selectedChat } = get()

        try {
            set({ isLoadingMoreMessages: true })

            const res = await api.get(`/messages/${selectedChat._id}?p=${page}&limit=20`)
            if (!res.data.success) return { success: false, message: res.data.message }

            set({ messages: [...res.data.messages, ...messages] })
            return { success: true, message: res.data.message, messages: res.data.messages.map(message => message.text) }
        } catch (e) {
            console.error(e)
        } finally {
            set({ isLoadingMoreMessages: false })
        }
    },
    subcribeToMessage: () => {
        try {
            useAuthStore.getState().socket.on('newMessage', async (newMessage) => {
                const { user } = useAuthStore.getState()

                // check if chat exists
                const existingChats = get().chats
                const chatExists = existingChats.some(chat => chat._id.toString() === newMessage.chatId.toString())

                if (!chatExists) {
                    const res = await api.post(`/chats/${newMessage.chatId}`)
                    set({ chats: [res.data.chat, ...existingChats] })
                } else {
                    const updatedChats = existingChats.map(chat =>
                        chat._id.toString() === newMessage.chatId.toString()
                            ? { ...chat, lastMessage: newMessage }
                            : chat
                    )
                    set({ chats: updatedChats })
                }
                
                // update messages if chat is open
                if (get().selectedChat?._id?.toString() === newMessage.chatId.toString()) {
                    const res = await api.put(`/messages/adjust/${newMessage._id}`, { ...newMessage, seenBy: [...newMessage.seenBy, user._id] })

                    //mark as seen
                    const updatedChats = get().chats.map(chat => {
                        if (chat._id === newMessage.chatId) {
                            return {
                                ...chat,
                                lastMessage: {
                                    ...chat.lastMessage,
                                    seenBy: [...chat.lastMessage.seenBy, user._id]
                                }
                            }
                        }
                        return chat
                    })

                    set({ chats: updatedChats })
                    set({ messages: [...get().messages, res.data.newMessage] })
                }

            })

        } catch (e) {
            console.error(e)
        }
    },
    unSubscribeToMessage: () => {
        try {
            useAuthStore.getState().socket?.off("newMessage")
        } catch (e) {
            console.error(e)
        }
    },
    findChat: async (user) => {
        try {
            const res = await api.get(`/chats/find/${user._id}`)

            if (!res.data.isExistingChat) {
                set({
                    selectedChat: {
                        participants: [user._id, useAuthStore.getState().user._id],
                        chatImage: user.avatar,
                        chatName: user.nickname
                    }
                })
                return
            }

            set({ selectedChat: { ...res.data.chat, chatImage: user.avatar, chatName: user.nickname } })

            return { success: true, message: res.data.message }
        } catch (e) {
            console.error(e)
        }
    },
    setSelectedChat: (chat, chatImage, chatName) => {
        if (!chat) {
            set({ selectedChat: null, messages: [] })
        }
        else set({ selectedChat: { ...chat, chatImage, chatName } })
    },
}))

export const getOtherUser = (chat) => {
    if (!chat || chat.isGroup) return
    const { participants } = chat
    const currentUserId = useAuthStore.getState().user._id
    const otherUser = participants.find((p) => p._id !== currentUserId)
    return otherUser
}