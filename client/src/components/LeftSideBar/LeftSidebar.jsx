import React from 'react'
import CurrentUserCard from './CurrentUserCard'
import { useUIStore } from '../../store/UIstore'

const LeftSidebar = () => {
  const { mainScreen, setMainScreen } = useUIStore()
  const tabs = [
    'Posts',
    'Audio'
  ]
  return (
    <aside className='fixed'>
      <CurrentUserCard />

      <ul className='pl-4 py-2 flex flex-col gap-2'>
        {tabs.map(tab => (
          <li
            key={tab}
            onClick={() => setMainScreen(tab)}
            className={`${mainScreen === tab? 'font-semibold':''} w-10/13 hover:bg-gray-800 py-3 px-2 rounded-xl`}
          >
            {tab}
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default LeftSidebar