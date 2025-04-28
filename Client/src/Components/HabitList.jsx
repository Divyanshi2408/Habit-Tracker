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
      toast.success('Habit deleted successfully!');
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
      setEditingHabit(null);
    } catch (err) {
      console.error('Error editing habit:', err);
      toast.error('Error editing habit.');
    }
  };

  const renderTodayStatus = (habit) => {
    if (!habit.todayStatus) return 'Pending';
    if (habit.todayStatus === 'completed') return 'Completed';
    if (habit.todayStatus === 'missed') return 'Missed';
    return '⏳ Pending';
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {habits.length === 0 ? (
        <p className="text-center text-gray-500">No habits yet. Add a habit to get started!</p>
      ) : (
        habits.map((habit) => (
          <div
            key={habit._id}
            className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-blue-600">{habit.name}</h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                  onClick={async () => {
                    await onLog(habit._id, 'completed');
                    fetchHabits();
                  }}
                >
                  Mark Completed
                </button>
                <button
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                  onClick={async () => {
                    await onLog(habit._id, 'missed');
                    fetchHabits();
                  }}
                >
                  Mark Missed
                </button>
              </div>
            </div>

            <div className="space-y-2 text-gray-700">
              <p><strong>Target Days:</strong> {Array.isArray(habit.targetDays) ? habit.targetDays.join(', ') : habit.targetDays || 'Not set'}</p>
              <p><strong>Today's Status:</strong> {renderTodayStatus(habit)}</p>
              <p><strong>Current Streak:</strong> {habit.currentStreak ?? 0}</p>
              <p><strong>Longest Streak:</strong> {habit.longestStreak ?? 0}</p>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  setEditingHabit(habit._id);
                  setHabitName(habit.name);
                  setTargetDays(habit.targetDays.join(', '));
                  setStartDate(habit.startDate?.slice(0, 10)); // format date
                }}
              >
                Edit
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleDeleteHabit(habit._id)}
              >
                Delete
              </button>
            </div>

            {/* Edit Form */}
            {editingHabit === habit._id && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">Edit Habit</h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    placeholder="Habit Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="text"
                    value={targetDays}
                    onChange={(e) => setTargetDays(e.target.value)}
                    placeholder="Target Days (comma separated)"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="flex gap-4">
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => handleEditHabit(habit._id)}
                    >
                      Save
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                      onClick={() => setEditingHabit(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default HabitList;
