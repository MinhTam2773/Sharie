import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Pause } from "lucide-react"; // optional icons, `lucide-react` package
import ProgressBar from "./ProgressBar";
import InteractiveButtons from "./InteractiveButtons";
import AudioModal from "./AudioModal";
import { Backdrop } from "../Backdrop";
import OptionsMenu from "./OptionsMenu";
import { BiMenuAltRight } from "react-icons/bi";

const Audio = ({ audio }) => {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  //audio Modal
  const [isOpen, setIsOpen] = useState(false)

  //options dropdown
  const [isOpenMenu, setIsOpenMenu] = useState(false)

  //audio player
  const [isPlaying, setIsPlaying] = useState(false);
  const [values, setValues] = useState([0]);
  const [duration, setDuration] = useState(0);
  // Load metadata (duration)
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const loaded = () => {
      setDuration(el.duration);
    };

    const timeUpdate = () => {
      setValues([el.currentTime]);
      if (el.currentTime === el.duration) {
        el.currentTime = 0
        setValues([0])
        el.play()
        setIsPlaying(true)
      }
    };

    el.addEventListener("loadedmetadata", loaded);
    el.addEventListener("timeupdate", timeUpdate);

    return () => {
      el.removeEventListener("loadedmetadata", loaded);
      el.removeEventListener("timeupdate", timeUpdate);
    };
  }, []);

  // Toggle play/pause
  const togglePlay = (e) => {
    e.stopPropagation()
    const el = audioRef.current;
    if (!el) return;

    if (isPlaying) {
      el.pause();
    } else {
      el.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className="relative w-5/6 mx-auto bg-black rounded-2xl overflow-hidden"
      onClick={() => setIsOpen(true)}
    >
      {/* <!-- Top shadow --> */}
      <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-black/60 z-20 to-transparent pointer-events-none"></div>

      {/* <!-- Bottom shadow --> */}
      <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-black/60 z-20 to-transparent pointer-events-none"></div>

      {/* Cover image as background */}
      <img
        src={audio.coverImage}
        alt="cover"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      {/* Overlay content */}
      <div className="relative flex flex-col p-4">

        {/* uploader info */}
        <div className="flex gap-3 w-full ">
          <img
            src={audio.uploadedBy?.avatar}
            alt={`${audio.uploadedBy?.username}'s avatar`}
            className="h-10 w-10 rounded-full cursor-pointer"
            onClick={() => navigate(`/${audio.uploadedBy?.username}`)}
          />

          <div className="flex flex-col">
            <p
              className="font-semibold cursor-pointer hover:underline"
              onClick={() => navigate(`/${audio.uploadedBy?.username}`)}
            >
              {audio.uploadedBy?.nickname}
            </p>
          </div>

          {/* Menu icon fixed to top-right */}
          <BiMenuAltRight
            className="absolute top-3 right-3 size-7 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpenMenu(!isOpenMenu)
            }}
          />
          {isOpenMenu && (
            <OptionsMenu
              audioId={audio._id}
              isOpenMenu={isOpenMenu}
              setIsOpenMenu={setIsOpenMenu}
            />
          )}
        </div>

        {/* audio info */}
        <div className="flex gap-5 mt-4">
          <img
            src={audio.coverImage}
            className="h-30 w-30 rounded-xl"
          />
          <div className="flex flex-col w-full">
            {/* title */}
            <h2 className="text-white text-center font-bold text-lg mt-2">{audio.title}</h2>

            {/* player controls */}
            <ProgressBar
              duration={duration}
              audioRef={audioRef}
              values={values}
              setValues={setValues}
            />

            {/* play pause button */}
            <button
              onClick={togglePlay}
              className="cursor-pointer self-center h-9 mt-5 w-9 flex justify-center items-center bg-gray-600 rounded-full text-white"
            >
              {isPlaying
                ? <Pause className="fill-white " />
                : <Play className="fill-white" />}
            </button>
          </div>
        </div>
        {/* hidden audio element */}
        <audio ref={audioRef} src={audio.fileUrl} />

        {/* Interactive buttons */}
        <InteractiveButtons audioId={audio._id} />

        {isOpen && (
          <>
            <Backdrop className='z-0' />
            <AudioModal
              audio={audio}
              audioRef={audioRef}
              duration={duration}
              values={values}
              setValues={setValues}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              setIsOpen={setIsOpen}
            />
          </>
        )}
      </div>

    </div>
  );
};

export default Audio;
