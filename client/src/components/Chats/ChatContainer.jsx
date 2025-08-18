import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/chatStore';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';
import Spinner from '../loadings/Spinner';

const ChatContainer = () => {
  const {
    getRecentMessages,
    messages,
    subcribeToMessage,
    unSubscribeToMessage,
    loadMoreMessages,
    isGettingMessages,
    selectedChat
  } = useChatStore();
  const { user } = useAuthStore()

  const messageEndRef = useRef(null);
  const messageContainerRef = useRef(null)
  const pageRef = useRef(1)
  const shouldScrollRef = useRef(true)
  const [suppressLoading, setSuppressLoading] = useState(true)

  useEffect(() => {
    getRecentMessages(selectedChat._id);
    subcribeToMessage();
    return () => unSubscribeToMessage();
  }, [selectedChat]);

  useEffect(() => {
    if (shouldScrollRef.current) messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleScroll = async () => {

    const container = messageContainerRef.current;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 10;

    if (isNearBottom) {
      setSuppressLoading(false)
    }

    if (!container || suppressLoading) return;

    if (container.scrollTop < 10) {
      shouldScrollRef.current = false
      const { messages: newMessages } = await loadMoreMessages(pageRef.current);
      if (newMessages?.length > 0) {
        pageRef.current += 1;
      }
      shouldScrollRef.current = true
    }
  };


  return (
    <div className=" bg-gradient-to-b from-purple-950 to-indigo-950 border-l border-purple-500/20 shadow-xl flex flex-col">
      {/* header */}
      <ChatHeader />

      {/* Messages */}
      <div
        ref={messageContainerRef}
        onScroll={handleScroll}
        className="h-135 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-purple-500/40 scrollbar-track-purple-900/20"
      >
        {messages.map((message, index) => {
          const isSelf = message.sender._id === user._id;
          const prevMessage = index > 0 ? messages[index - 1] : null;
          const isSameSenderAsPrev = prevMessage?.sender._id === message.sender._id;

          return (
            <React.Fragment key={message._id} >
              {!isSameSenderAsPrev && (
                <div className="w-full border-t border-purple-700/40 my-2"></div>
              )}

              <div
                className={`flex w-full ${isSelf ? 'justify-end' : 'justify-start'} ${isSameSenderAsPrev ? 'mt-0.5' : 'mt-6'
                  }`}
              >
                <div ref={messageEndRef}
                  className={`
            max-w-[65%] text-sm sm:text-base break-words px-4 py-2 shadow-md
            ${isSelf ? 'bg-indigo-600 text-white' : 'bg-purple-800 text-purple-100'}
            ${isSameSenderAsPrev ? 'rounded-tl-md rounded-tr-md rounded-b-md' : 'rounded-2xl'}
          `}
                >
                  {message.text && (
                    <div className="whitespace-pre-line">{message.text}</div>
                  )}
                  {message.mediaUrl && (
                    <>
                      {message.mediaType === 'image' ? (
                        <img
                          src={message.mediaUrl}
                          alt="chat media"
                          className="mt-2 rounded-lg max-h-60 object-cover"
                        />
                      ) : (
                        <video
                          src={message.mediaUrl}
                          controls
                          className="mt-2 rounded-lg max-h-60"
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* loadingMessages */}
        {isGettingMessages && (<Spinner />)}

        {/* if no message */}
        {messages.length == 0 && !isGettingMessages && (
          <div className='flex justify-center'>
            <p className='text-sm text-gray-500 font-semibold'>Start the chat with 'HALOOO'</p>
          </div>
        )}

      </div>

      {/* Input */}
      <ChatInput />
    </div>
  );
};

export default ChatContainer;
