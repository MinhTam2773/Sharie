import { useUIStore } from "../store/UIstore";

export const Backdrop = () => {
    const {isFocused} = useUIStore()
    
    if (isFocused) {
        return (
          <div
            className="fixed inset-0 bg-black/60 blur-drop-sm"
          />
        );
    }
};