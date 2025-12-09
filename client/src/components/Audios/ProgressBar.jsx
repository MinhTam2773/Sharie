import React from 'react'
import { Range } from "react-range";

const ProgressBar = ({ duration, setValues, audioRef,values}) => {
  return (
    <div className="mt-4 flex items-center gap-3"
     onClick={(e) => e.stopPropagation()}
     >
          <Range
          step={0.1}
          min={0}
          max={duration || 100}
          values={values}
          onChange={(vals) => {
            setValues(vals);
            audioRef.current.currentTime = vals[0];
          }}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="h-2 w-full bg-gray-600 rounded cursor-pointer"
              style={{ ...props.style }}
            >
              <div
                className="h-2 bg-gray-200 rounded"
                style={{
                  width: `${(values[0] / duration) * 100}%`,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="h-4 w-4 top-0 bg-gray-400 rounded-full shadow"
            />
          )}
        />
        </div>
  )
}

export default ProgressBar