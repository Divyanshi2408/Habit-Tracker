// Updated Dashboard.jsx
import { useEffect, useState, useContext } from 'react';
import { createHabit, getHabits, logHabit, deleteHabitLog, editHabit } from '../api/habits';
import { AuthContext } from '../context/AuthContext';
import HabitForm from '../Components/HabitForm';
import HabitList from '../Components/HabitList';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { token, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);

  const fetchHabits = async () => {
    try {
      const data = await getHabits(token);
      setHabits(data);
    } catch (error) {
      console.error('Failed to fetch habits:', error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      fetchHabits();
    }
  }, [token, navigate]);

  const handleCreateHabit = async (habitData) => {
    try {
      await createHabit(token, habitData);
      fetchHabits();
    } catch (error) {
      console.error('Failed to create habit:', error);
    }
  };

  const handleLogHabit = async (habitId, status) => {
    try {
      await logHabit(token, habitId, status);
      fetchHabits();
    } catch (error) {
      console.error('Failed to log habit:', error);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      await deleteHabitLog(token, habitId);
      fetchHabits();
    } catch (error) {
      console.error('Failed to delete habit:', error);
    }
  };

  const handleUpdateHabit = async (habitId, updatedData) => {
    try {
      await editHabit(token, habitId, updatedData);
      fetchHabits();
    } catch (error) {
      console.error('Failed to update habit:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 max-md:flex-col">
      {/* Sidebar */}
      <div className="w-64 bg-stone-800 text-white p-6 flex flex-col justify-start items-center max-md:justify-between max-md:flex-row max-md:w-full max-md:p-2">
        {/* <div className='flex flex-col max-md:flex-row max-md:justify-around gap-15 max-md:gap-12 max-sm:gap-5 sm:justify-around'> */}
          <h2 className="text-3xl font-bold mb-8 max-md:mb-0">HabitVault</h2>
          <button
            onClick={handleLogout}
            className="w-fit bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded"
          >
            Logout
          </button>
        {/* </div> */}
        {/* <p className="text-sm text-gray-400 mt-10 max-md:mt-0">&copy; 2025 HabitVault</p> */}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-4xl font-bold text-stone-800 mb-6">
          {user?.name ? `${user.name}'s Dashboard` : 'Dashboard'}
        </h1>

        {/* Habit Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4">Create New Habit</h2>
          <HabitForm onCreate={handleCreateHabit} />
        </div>

        {/* Habit List */}
        <HabitList
          habits={habits}
          onLog={handleLogHabit}
          onDelete={handleDeleteHabit}
          onUpdate={handleUpdateHabit}
        />
      </div>
    </div>
  );
};

export default Dashboard;
