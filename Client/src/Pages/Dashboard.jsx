import { useEffect, useState, useContext } from 'react';
import { createHabit, getHabits, logHabit } from '../api/habits';
import { AuthContext } from '../context/AuthContext';
import HabitForm from '../Components/HabitForm';
import HabitList from '../Components/HabitList';
import HabitPerformanceChart from '../Components/HabitPerformanceChart'; // Import chart
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
    <div className='flex flex-col justify-center items-center gap-10'>
      <button className='px-3 py-1 max-w-fit bg-stone-800 text-white hover:bg-stone-600' onClick={() => { logout(); navigate('/'); }}>Logout</button>
      <h1 className='text-5xl font-bold'>Dashboard</h1>

      <HabitForm onCreate={handleCreateHabit} />

      {/* Render the chart for each habit */}
      {habits.length > 0 && habits.map(habit => (
        <div key={habit._id} className="habit-chart-container">
          <h3>{habit.name} - Performance Chart</h3>
          <HabitPerformanceChart habitData={habit.logs} />
        </div>
      ))}

      <HabitList habits={habits} onLog={handleLogHabit} fetchHabits={fetchHabits} token={token} />
    </div>
  );
};

export default Dashboard;
