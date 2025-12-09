import { create } from "zustand";
import api from "../lib/fetchInterceptor.js";
import { useAuthStore } from "./authStore.js";

export const useAudioStore = create((set, get) => ({
    isUploadingAudio: false,
    isGettingAudios: false,
    isGettingComment: false,
    audios: [],

    uploadAudio: async (formData, collectionId) => {
        try {
            set({ isUploadingAudio: true })

            const res = await api.post(`/audios/upload/${collectionId}`, formData)

            console.log(res.data.message)
            return res.data.song
        } catch (e) {
            console.log(e)
        } finally {
            set({ isUploadingAudio: false })
        }
    },
    getAudios: async () => {
        try {
            set({ isGettingAudios: true })

            const res = await api.get('/audios/')
            console.log(get().audios)

            set({ audios: res.data.audios })
        } catch (e) {
            console.error(e)
        } finally {
            set({ isGettingAudios: false })
        }
    },
    getCollectionsByUser: async (userId) => {
        try {
            const res = await api.get(`/collections/${userId}`)

            return res.data.collections
        } catch (e) {
            console.error(e.message)
        }
    },
    likeAudio: async (audioId) => {
        const { user } = useAuthStore.getState()
        if (!audioId) return
        try {
            const res = await api.put(`/audios/like/${audioId}`)

            const updatedAudios = get().audios.map(audio => {
                if (audio._id === res.data.audio._id) {
                    return {
                        ...audio,
                        likes: [...audio.likes, user._id],
                        likeCount: audio.likeCount += 1
                    }
                }
                return audio
            })

            set({ audios: updatedAudios })

            console.log(res.data.message)
        } catch (e) {
            console.error(e)
        }
    },
    unlikeAudio: async (audioId) => {
        const { user } = useAuthStore.getState()
        if (!audioId) return
        try {
            const res = await api.put(`/audios/unlike/${audioId}`)

            const updatedAudios = get().audios.map(audio => {
                if (audio._id === res.data.audio._id) {
                    audio.likes = audio.likes.filter(userId => userId !== user._id)
                    audio.likeCount -= 1
                    return audio
                }
                return audio
            })

            set({ audios: updatedAudios })

            console.log(res.data.message)
        } catch (e) {
            console.error(e)
        }
    },
    uploadCommentAudio: async (audioId, formData) => {
        if (!audioId) return

        try {
            const res = await api.post(`/comments/${audioId}/upload`, formData)

            const updatedAudios = get().audios.map(audio => {
                console.log(audio._id)
                if (audio._id === audioId) {
                    audio.commentCount += 1
                    return audio
                }
                return audio
            })

            set({ audios: updatedAudios })

            console.log(res.data.message)
        } catch (e) {
            console.error(e)
        }
    },
    getComments: async (audioId) => {
        if (!audioId) return
        set({ isGettingComment: true })

        try {
            const res = await api.get(`/posts/${audioId}/comments`)

            return res.data.comments
        } catch (e) {
            console.error(e)
        } finally {
            set({ isGettingComment: false })
        }
    },
    shareAudio: async (audioId, collectionId) => {
        if (!audioId) return

        try {
            const res = await api.post(`/audios/share/${audioId}?collectionId=${collectionId}`)

            console.log(res.data.message)
            return res.data.newAudio
        } catch(e) {
            console.error(e)
        }
    }, 
    deleteAudio: async (audioId) => {
        if (audioId) return

        try {
             const res = await api.delete(`/audios/delete/${audioId}`)

             const updatedAudios = get().audios.filter(audio => audio._id !== audioId)

             set({audios: updatedAudios})
             console.log(res.data.message)
        } catch(e) {
            console.error(e)
        }
    },
    adjustAudio: async () => {
        console.log('adjust run')
    }
}))