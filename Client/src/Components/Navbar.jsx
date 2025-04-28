import React from 'react'

const Navbar = () => {
  return (
    <div className='flex flex-col w-[20vw] bg-gray-500 h-[100vh] text-white'>
        <div className="logo text-4xl font-extrabold">HabitVault</div>
        <div className="functions">
            <div className="task">Add Task +</div>
            {/* <div className="list">Add Task list ...</div> */}
            <div className="habits">Add a Habit</div>
        </div>

    </div>
  )
}

export default Navbar