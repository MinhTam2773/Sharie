import React, { useRef, useState } from 'react';
import { FaPaperclip, FaTimes, FaPaperPlane, FaImage } from 'react-icons/fa';
import { useChatStore } from '../../store/chatStore';
import toast from 'react-hot-toast';

const ChatInput = () => {
    const { sendMessage } = useChatStore();
    const [text, setText] = useState('');
    const [mediaPreview, setMediaPreview] = useState([]);
    const fileInputRef = useRef(null);

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);
        let newMedia = [];

        files.forEach(file => {
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            if (!isImage && !isVideo) return toast.error('Please select image or video');

            const reader = new FileReader();
            reader.onloadend = () => {
                newMedia.push({
                    type: isImage ? 'image' : 'video',
                    preview: reader.result,
                    file
                });
                if (newMedia.length === files.length) setMediaPreview(prev => [...prev, ...newMedia]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeMedia = (index) => {
        setMediaPreview(prev => prev.filter((_, i) => i !== index));
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && mediaPreview.length === 0) return;

        for (const media of mediaPreview) {
            const { message} = await sendMessage({ media: media.preview, mediaType: media.type });
            console.log(message)
        }

        if (text.trim()) {
            const { message} = await sendMessage({ text: text.trim() });
            console.log(message)
        }

        setText('');
        setMediaPreview([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full p-4 bg-gradient-to-t from-purple-900/90 to-indigo-900/80 backdrop-blur-lg border-t border-purple-500/20 shadow-lg">
            {/* Media Preview */}
            {mediaPreview.length > 0 && (
                <div className="flex space-x-2 mb-3 overflow-x-auto pb-2">
                    {mediaPreview.map((media, index) => (
                        <div key={index} className="relative group">
                            {media.type === 'image' ? (
                                <img 
                                    src={media.preview} 
                                    className="h-20 w-20 object-cover rounded-lg border border-purple-400/30"
                                    alt="Preview"
                                />
                            ) : (
                                <video 
                                    src={media.preview}
                                    className="h-20 w-20 object-cover rounded-lg border border-purple-400/30"
                                />
                            )}
                            <button 
                                onClick={() => removeMedia(index)}
                                className="absolute -top-2 -right-2 bg-purple-600 rounded-full p-1 hover:bg-purple-500 transition-all group-hover:opacity-100 opacity-90"
                            >
                                <FaTimes className="h-3 w-3 text-white" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                {/* File Attachment Button */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-full bg-purple-700/50 text-purple-200 hover:bg-purple-600/70 hover:text-white transition-colors"
                    title="Attach media"
                >
                    <FaPaperclip className="h-5 w-5" />
                    <input 
                        className="hidden" 
                        type="file" 
                        multiple 
                        ref={fileInputRef} 
                        onChange={handleMediaChange}
                        accept="image/*,video/*"
                    />
                </button>

                {/* Message Input */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Send a cosmic message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full py-3 pl-4 pr-12 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-100 placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all backdrop-blur-sm"
                    />
                    {text && (
                        <button
                            type="button"
                            onClick={() => setText('')}
                            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-purple-300/60 hover:text-purple-100 transition-colors"
                        >
                            <FaTimes className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={!text.trim() && mediaPreview.length === 0}
                    className={`p-3 rounded-full ${(!text.trim() && mediaPreview.length === 0) ? 'bg-purple-900/30 text-purple-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600'} transition-all`}
                >
                    <FaPaperPlane className="h-5 w-5" />
                </button>
            </form>
        </div>
    );
};

export default ChatInput;