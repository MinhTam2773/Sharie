import { create } from "zustand";

export const useUIStore = create((set) => ({
    audioUploadModelOpen: false,
    mainScreen: 'Posts',
    isFocused: false,
    setMainScreen: (tabLabel) => set({mainScreen: tabLabel}),
    setAudioUploadModelOpen: (value) => set({audioUploadModelOpen: value}),
    setIsFocused: (val) => set({isFocused: val})
}))