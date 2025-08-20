import { create } from "zustand";
import api from "../lib/fetchInterceptor.js";

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

            const res = await api.post('/posts/upload', formData)
            if (!res.data.success) return {success: false, message: res.data.message}

            set({ posts: [res.data.newPost, ...get().posts] })
            return { success: true, message: res.data.message }
        } catch (e) {
            console.error(e)
        } finally {
            set({ isUploadingPost: false })
        }
    },
    getPostsFromFollowing: async () => {
        try {
            set({ loadingPosts: true })

            const res = await api.get('/posts/')

            if (!res.data.success) return {success: false, message: res.data.message}

            const newPosts = res.data.posts

            const uniquePosts = newPosts.filter(newPost =>
                !get().posts.some(existingPost => existingPost._id === newPost._id)
            )

            set({ posts: [...uniquePosts, ...get().posts] })

            return { success: true, message: res.data.message }
        } catch (e) {
            console.error(e)
        } finally {
            set({ loadingPosts: false })
        }
    },
    likePost: async (postId) => {
        try {
            const res = await api.post(`/posts/like/${postId}`)

            if (!res.data.success) return {success: false, message: res.data.message}

            console.log(res.data.message)

            return { success: res.data.success, message: res.data.message }
        } catch (e) {
            console.error(e)
        }
    },
    unlikePost: async (postId) => {
        try {
            const res = await api.post(`/posts/unlike/${postId}`)

            if (!res.data.success) return {success: false, message: res.data.message}

            console.log(res.data.message)

            return { success: res.data.success, message: res.data.message }
        } catch (e) {
            console.error(e)
        }
    },
    getCommentsByPost: async (postId) => {
        try {
            set({ isGettingComments: false })

            const res = await api.get(`/posts/${postId}/comments`)

            if (!res.data.success) return {success: false, message: res.data.message}

            return { success: res.data.success, message: res.data.message, comments: res.data.comments }
        } catch (e) {
            console.error(e)
        } finally {
            set({ isGettingComments: false })
        }
    },
    uploadComment: async (postId, formData) => {
        try {
            set({ isUploadingComment: true })

            const res = await api.post(`/comments/${postId}/upload`,formData)

            if (!res.data.success) return {success: false, message: res.data.message}

            return { success: res.data.success, message: res.data.message, comments: res.data.comments }

        } catch (e) {
            console.error(e)
        } finally {
            set({ isUploadingComment: false })
        }
    },
    sharePost: async (postId, formData) => {
        try {
            const res = await api.post(`/posts/share/${postId}`, formData)

            if (!res.data.success) return {success: false, message: res.data.message}

            set({ posts: [res.data.newPost, ...get().posts] })
            return { success: true, message: res.data.message }
        } catch (e) {
            console.error(e)
        }
    },
    repost: async (postId) => {
        try {
            const res =  await api.post(`/posts/repost/${postId}`)

            if (!res.data.success) {
                console.log(res.data.message)
                return
            }

            console.log(res.data.message)

            return {success: true, message: res.data.message}
        } catch(e) {
            console.error(e)
        }
    },
    unRepost: async (postId) => {
        try {
            const res = await api.delete(`/posts/unrepost/${postId}`)

            if (!res.data.success) {
                console.log(res.data.message)
                return
            }

            console.log(res.data.message)
            return {success: true}
        } catch(e) {
            console.log(e.message)
        }
    }
}))