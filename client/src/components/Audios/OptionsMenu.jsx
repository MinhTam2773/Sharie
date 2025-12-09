import React, { useEffect, useRef } from 'react'
import { useAudioStore } from '../../store/audioStore'

const OptionsMenu = ({isOpenMenu, setIsOpenMenu, audioId }) => {
    const {deleteAudio, adjustAudio} = useAudioStore()

    // Close dropdown if click outside
    const dropdownRef = useRef(null)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpenMenu(!isOpenMenu);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
    <div
        ref={dropdownRef}
        className='absolute top-0 right-0 bg-gray-700 rounded-xl'
    >
        <ul>
            <li onClick={() => deleteAudio(audioId)}>Delete</li>
            <li onClick={() => adjustAudio(audioId)}>Adjust</li>
        </ul>
    </div>
  )
}

export default OptionsMenu