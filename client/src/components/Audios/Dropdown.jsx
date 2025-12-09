import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { useAudioStore } from "../../store/audioStore";
import { FaRegPlusSquare } from "react-icons/fa";
import { MdOutlineCancelPresentation } from "react-icons/md";

const Dropdown = ({selectedCollection, setSelectedCollection}) => {
  const { user } = useAuthStore()
  const { getCollectionsByUser } = useAudioStore()

  //drop down list
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [collections, setCollections] = useState([])

  //adding new collection
  const [isAddingCollection, setIsAddingCollection] = useState(false)

  //get collections from db
  useEffect(() => {
    const getCollections = async () => {
      const collectionsFromDb = await getCollectionsByUser(user._id)
      if (collectionsFromDb?.length > 0) {
        setCollections(collectionsFromDb)
        setSelectedCollection(collectionsFromDb[0])
      }
    }
    getCollections()
  }, [])

  //make input field appear to add collection
  const handleCollectionInput = () => {
    if (!isAddingCollection) {
      setIsAddingCollection(true)
    } else {
      setIsAddingCollection(false)
    }
  }

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className=" relative flex gap-1" ref={dropdownRef}>
      {/* add collection button */}
      <button
        type='button'
        className=""
        onClick={handleCollectionInput}
      >
        {!isAddingCollection 
        ? (<FaRegPlusSquare className="size-5 fill-gray-400 hover:fill-gray-300 cursor-pointer" />)
        : (<MdOutlineCancelPresentation className="size-5 fill-gray-300 hover:fill-gray-200 cursor-pointer"/>)
      }
      </button>

      {/* Input new collection */}
      {isAddingCollection && (
        <div>
          <input 
            type='text'
            className="focus:outline-none py-1 text-sm"
            placeholder="new collection name"
          />
        </div>
      )}

      {!isAddingCollection && (
        <div className="flex flex-col">

          {/* label */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-gray-400  hover:text-gray-400 focus:outline-none 
                    font-medium rounded-lg text-sm py-1 text-center 
                   inline-flex items-center cursor-pointer
                   "
          >
            {selectedCollection?.name}
            {collections?.length > 0 && (
              <svg
                className="w-2.5 h-2.5 ms-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            )}
          </button>

          {/* dropdown list */}
          {isOpen && (
            <div className="absolute left-0 top-5 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 mt-2">
              <ul className=" text-sm text-gray-700 dark:text-gray-200">
                {collections.map((item, index) => (
                  <li key={index}>
                    <button
                      className="w-full text-left px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => {
                        setSelectedCollection(item);
                        setIsOpen(false);
                      }}
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
