import React from "react";
import { Range } from "react-range";

const AudioTrimSlider = ({ duration, start, end, onChange }) => {
  return (
    <div 
    className="mt-4"
    onClick={(e) => e.stopPropagation()}
    >
      <Range
        step={1}
        min={0}
        max={duration}
        values={[start, end]}
        onChange={(values) => onChange(values)}
        renderTrack={({ props, children }) => {
          const { key, ...restProps } = props; // 🟢 extract key
          return (
            <div
              key={key}
              {...restProps}
              className="h-2 w-full bg-gray-200 rounded relative"
            >
              {/* highlight between thumbs */}
              <div
                className="absolute h-2 bg-purple-500 rounded"
                style={{
                  left: `${(start / duration) * 100}%`,
                  width: `${((end - start) / duration) * 100}%`,
                }}
              />
              {children}
            </div>
          );
        }}
        renderThumb={({ props, index }) => {
          const { key, ...restProps } = props; // 🟢 extract key
          return (
            <div
              key={key}
              {...restProps}
              className="w-4 h-4 bg-purple-600 rounded-full shadow relative"
            >
              <div className="absolute top-6 text-xs text-gray-700">
                {index === 0 ? `${Math.floor(start)}s` : `${Math.floor(end)}s`}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default AudioTrimSlider;
