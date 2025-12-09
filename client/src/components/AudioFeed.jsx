import React, { useEffect } from 'react'
import { useAudioStore } from '../store/audioStore'
import Audio from './Audios/Audio'

const AudioFeed = () => {
    const {getAudios, audios, isGettingAudios} = useAudioStore()

    useEffect(() => {
        getAudios()
    }, [])

    if (isGettingAudios) return <p>Loading...</p>
  return (
    <div className='w-full flex flex-col justify-center gap-5 mt-22'>
        {audios?.length > 0 && audios.map( audio => (
            <div key={audio._id}>
                
                <Audio 
                    audio={audio.sourceType === 'upload'
                        ? audio
                        : {
                            ...audio.originalAudio,
                            uploader: audio.uploadedBy,
                            sourceType: 'shared'
                        } 
                    }
                />
            </div>
        ))}
    </div>
  )
}

export default AudioFeed