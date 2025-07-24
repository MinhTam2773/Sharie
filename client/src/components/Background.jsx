import React from 'react'

const Background = () => {
    return (
        <>
            {/* Left-Side Doodles */}
            <div className="absolute top-10 left-5 text-6xl opacity-10 rotate-12">✏️</div>
            <div className="absolute top-1/4 left-10 text-7xl opacity-10 rotate-45">🎨</div>
            <div className="absolute top-1/2 left-15 text-8xl opacity-5 rotate-25">🖍️</div>
            <div className="absolute bottom-10 left-1/4 text-6xl opacity-10 -rotate-45">📍</div>
            <div className="absolute top-3/4 left-15 text-7xl opacity-10">🖊️</div>
            <div className="absolute top-1/5 left-1/5 text-6xl opacity-10 rotate-15">📎</div>

            {/* Right-Side Doodles (existing) */}
            <div className="absolute bottom-20 right-20 text-7xl opacity-10 -rotate-12">🎨</div>
            <div className="absolute top-1/3 right-1/4 text-5xl opacity-10">💭</div>
            <div className="absolute top-1/4 right-10 text-5xl opacity-10 rotate-45">✨</div>
            <div className="absolute top-3/4 left-1/5 text-5xl opacity-10">🌈</div>
            <div className="absolute bottom-10 left-1/2 text-6xl opacity-10 rotate-12">🔗</div>
            <div className="absolute top-20 right-1/3 text-4xl opacity-10 -rotate-15">📸</div>
            <div className="absolute bottom-1/3 right-1/5 text-5xl opacity-10">💬</div>
            <div className="absolute top-1/5 left-3/4 text-7xl opacity-10 rotate-25">🎯</div>
            <div className="absolute bottom-2/3 right-2/3 text-6xl opacity-10">🤳</div>
        </>
    )
}

export default Background