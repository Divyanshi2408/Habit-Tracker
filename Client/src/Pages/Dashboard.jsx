import { useEffect, useState, useContext } from 'react';
import { createHabit, getHabits, logHabit } from '../api/habits';
import { AuthContext } from '../context/AuthContext';
import HabitForm from '../Components/HabitForm';
import HabitList from '../Components/HabitList';
import HabitPerformanceChart from '../Components/HabitPerformanceChart';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);

  const fetchHabits = async () => {
    const data = await getHabits(token);
    setHabits(data);
  };

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      fetchHabits();
    }
  }, [token]);

  const handleCreateHabit = async (habitData) => {
    await createHabit(token, habitData);
    fetchHabits();
  };

  const handleLogHabit = async (habitId, status) => {
    await logHabit(token, habitId, status);
    fetchHabits();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-stone-800 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-8">HabitVault</h2>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-10">&copy; 2025 HabitVault</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-4xl font-bold text-stone-800 mb-6">Your Dashboard</h1>

        {/* Habit Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4">Create New Habit</h2>
          <HabitForm onCreate={handleCreateHabit} />
        </div>

        {/* Habit List and Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {habits.length > 0 ? habits.map(habit => (
            <div key={habit._id} className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{habit.name}</h3>
              <HabitPerformanceChart habitData={habit.logs} />
              <div className="mt-4">
                <HabitList habits={[habit]} onLog={handleLogHabit} fetchHabits={fetchHabits} token={token} />
              </div>
            </div>
          )) : (
            <p className="text-gray-500 text-lg">No habits created yet. Start building your streaks!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
