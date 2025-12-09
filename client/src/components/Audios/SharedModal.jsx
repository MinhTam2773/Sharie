import React, { useEffect, useRef, useState } from 'react'
import Dropdown from './Dropdown'
import { useAudioStore } from '../../store/audioStore'

const SharedModal = ({audioId ,setIsOpen }) => {
    const {shareAudio} = useAudioStore()
    const [selectedCollection, setSelectedCollection] = useState(null)

    //click outside
    const modalRef = useRef(null)
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current?.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleShareAudio = async (e) => {
        e.preventDefault()
        await shareAudio(audioId, selectedCollection._id)
        setIsOpen(false)
    }
    return (
        <div className='bg-black/60 blur-drop-sm fixed inset-0 flex justify-center items-center' onClick={(e) => e.stopPropagation()}>
            <form
                onSubmit={handleShareAudio}
                ref={modalRef}
                className='bg-gray-800 rounded-xl flex flex-col px-3 py-2'
            >
                <p className='text-sm mb-2 font-semibold'>Add to your collections</p>
                
                <Dropdown selectedCollection={selectedCollection} setSelectedCollection={setSelectedCollection}/>
                
                <div
                    className='px-2 py-1 mt-2 bg-blue-400 cursor-pointer self-center rounded-md hover:bg-blue-300'
                >
                    <button 
                        type='submit'
                        className='cursor-pointer font-semibold'
                    >
                        Share
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SharedModal