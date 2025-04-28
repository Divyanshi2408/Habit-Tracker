import { useState } from 'react';
import { deleteHabitLog, editHabit } from '../api/habits';
import { toast } from 'react-hot-toast';

const HabitList = ({ habits, onLog, fetchHabits, token }) => {
  const [editingHabit, setEditingHabit] = useState(null);
  const [habitName, setHabitName] = useState('');
  const [targetDays, setTargetDays] = useState('');
  const [startDate, setStartDate] = useState('');

  const handleDeleteHabit = async (habitId) => {
    try {
      if (!habitId) {
        console.error('Habit ID is missing!');
        return;
      }
      await deleteHabitLog(token, habitId);
      toast.success("Habit deleted successfully!");
      fetchHabits();
    } catch (err) {
      console.error('Error deleting habit:', err);
      toast.error('Error deleting habit.');
    }
  };

  const handleEditHabit = async (habitId) => {
    try {
      const habitData = { name: habitName, targetDays: targetDays.split(','), startDate };
      await editHabit(token, habitId, habitData);
      toast.success('Habit updated successfully!');
      fetchHabits();
      setEditingHabit(null); // Hide the form after successful update
    } catch (err) {
      console.error('Error editing habit:', err);
      toast.error('Error editing habit.');
    }
  };

  const renderTodayStatus = (habit) => {
    if (!habit.todayStatus) {
      return '⏳ Pending';
    }
    if (habit.todayStatus === 'completed') {
      return '✅ Completed';
    }
    if (habit.todayStatus === 'missed') {
      return '❌ Missed';
    }
    return '⏳ Pending';
  };

  return (
    <div>
      {habits.length === 0 ? (
        <p>No habits yet. Add a habit to get started!</p>
      ) : (
        habits.map(habit => (
          <div 
            key={habit._id} 
            style={{ border: '1px solid black', margin: '10px', padding: '10px' }}
          >
            <h3>{habit.name}</h3>
            <p><strong>Target Days:</strong> {Array.isArray(habit.targetDays) ? habit.targetDays.join(', ') : habit.targetDays || 'Not set'}</p>
            <p><strong>Today's Status:</strong> {renderTodayStatus(habit)}</p>
            <p><strong>Current Streak:</strong> {habit.currentStreak ?? 0}</p>
            <p><strong>Longest Streak:</strong> {habit.longestStreak ?? 0}</p>

            {/* Buttons for marking status */}
            <button onClick={async () => { 
              await onLog(habit._id, 'completed');
              fetchHabits(); 
            }}>
              Mark Completed
            </button>

            <button onClick={async () => { 
              await onLog(habit._id, 'missed');
              fetchHabits(); 
            }}>
              Mark Missed
            </button>

            {/* Edit Button */}
            <button className="p-2 m-2 bg-red-300" onClick={() => {
              setEditingHabit(habit._id);
              setHabitName(habit.name);
              setTargetDays(habit.targetDays.join(', '));
              setStartDate(habit.startDate);
            }}>
              Edit
            </button>

            {/* Delete Button */}
            <button className="p-2 m-2 bg-red-300" onClick={() => handleDeleteHabit(habit._id)}>Delete</button>

            {/* Edit Form */}
            {editingHabit === habit._id && (
              <div>
                <h4>Edit Habit</h4>
                <input 
                  type="text" 
                  value={habitName} 
                  onChange={(e) => setHabitName(e.target.value)} 
                  placeholder="Habit Name" 
                />
                <input 
                  type="text" 
                  value={targetDays} 
                  onChange={(e) => setTargetDays(e.target.value)} 
                  placeholder="Target Days (comma separated)" 
                />
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                />
                <button className="p-2 m-2 bg-red-300" onClick={() => handleEditHabit(habit._id)}>Save</button>
                <button className="p-2 m-2 bg-red-300" onClick={() => setEditingHabit(null)}>Cancel</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default HabitList;
