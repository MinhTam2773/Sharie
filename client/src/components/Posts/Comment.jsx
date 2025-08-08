import React from 'react';

const Comment = ({ comment }) => {
  const { commentor, text, media = [] } = comment;

  return (
    <div className="flex m-2 gap-2">
      <img
        src={commentor.avatar || '/default-avatar.png'}
        alt={`${commentor.username}'s avatar`}
        className="rounded-full h-8 w-8 mt-1"
      />

      <div>
        <div
          className={`flex flex-col items-start rounded-xl p-1 px-3 gap-1 ${
            text?.trim() ? 'bg-gray-700' : ''
          }`}
        >
          <span className="font-semibold text-sm">
            {commentor.username || 'Unknown'}
          </span>

          {text?.trim() && (
            <p className="text-sm whitespace-pre-wrap">{text}</p>
          )}
        </div>

        {media.length > 0 && (
          <div className="flex m-1 gap-2 overflow-x-auto">
            {media.map((mediaItem, index) => (
              <div key={index} className="relative group">
                {mediaItem.mediaType === 'image' ? (
                  <img
                    src={mediaItem.mediaUrl}
                    alt="Comment media"
                    className="h-50 w-auto max-w-xs object-contain rounded-md"
                  />
                ) : (
                  <video
                    src={mediaItem.mediaUrl}
                    className="h-28 w-auto max-w-xs object-contain rounded-md"
                    controls
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
