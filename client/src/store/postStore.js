import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const usePostStore = create((set, get) => ({
    posts: [],
    comments: [],
    selectedPost: null,
    isUploadingPost: false,
    loadingPosts: false,
    isGettingComments: false,
    isUploadingComment: false,

    uploadPost: async (formData) => {
        try {
            set({ isUploadingPost: true })

            const res = await fetch('/api/posts/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Beare ${useAuthStore.getState().accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (!res.ok) {
                const error = await res.json()
                return { success: false, message: error.message }
            }

            const data = await res.json()
            set({ posts: [data.post, ...get().posts] })
            return { success: true, message: data.message }
        } catch (e) {
            console.error(e)
        } finally {
            set({ isUploadingPost: false })
        }
    },
    getPostsFromFollowing: async () => {
        try {
            set({ loadingPosts: true })

            const res = await fetch('/api/posts/', {
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

            const newPosts = data.posts

            const uniquePosts = newPosts.filter(newPost =>
                !get().posts.some(existingPost => existingPost._id === newPost._id)
            )

            set({ posts: [...uniquePosts, ...get().posts] })

            return { success: true, message: data.message }
        } catch (e) {
            console.error(e)
        } finally {
            set({ loadingPosts: false })
        }
    },
    likePost: async (postId) => {
        try {
            const res = await fetch(`/api/posts/like/${postId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${useAuthStore.getState().accessToken}`
                }
            })

            if (!res.ok) {
                const error = await res.json()
                return { success: false, message: error.message }
            }

            const data = await res.json()
            return { success: data.success, message: data.message }
        } catch (e) {
            console.error(e)
        }
    },
    unlikePost: async (postId) => {
        try {
            const res = await fetch(`/api/posts/unlike/${postId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${useAuthStore.getState().accessToken}`
                }
            })

            if (!res.ok) {
                const error = await res.json()
                return { success: false, message: error.message }
            }

            const data = await res.json()
            return { success: data.success, message: data.message }
        } catch (e) {
            console.error(e)
        }
    },
    getCommentsByPost: async (postId) => {
        try {
            set({ isGettingComments: false })

            const res = await fetch(`/api/posts/${postId}/comments`, {
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
            return { success: data.success, message: data.message, comments: data.comments }
        } catch (e) {
            console.error(e)
        } finally {
            set({ isGettingComments: false })
        }
    },
    uploadComment: async (postId, formData) => {
        try {
            set({ isUploadingComment: true })

            const res = await fetch(`/api/comments/${postId}/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (!res.ok) {
                const error = await res.json()
                return { success: false, message: error.message }
            }

            const data = await res.json()
            return { success: data.success, message: data.message, comments: data.comments }

        } catch (e) {
            console.error(e)
        } finally {
            set({ isUploadingComment: false })
        }
    }
}))