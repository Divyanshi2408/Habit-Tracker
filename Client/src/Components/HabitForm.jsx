import { useState } from 'react';

const HabitForm = ({ onCreate }) => {
  const [name, setName] = useState('');
  const [targetType, setTargetType] = useState(''); // Every Day, Weekdays, Custom
  const [customDays, setCustomDays] = useState([]); // For Custom selected days
  const [startDate, setStartDate] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleCustomDayChange = (day) => {
    if (customDays.includes(day)) {
      setCustomDays(customDays.filter(d => d !== day));
    } else {
      setCustomDays([...customDays, day]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let targetDays;
    
    if (targetType === 'Custom') {
      targetDays = customDays;
    } else if (targetType === 'Every Day') {
      targetDays = [...daysOfWeek]; // All 7 days
    } else if (targetType === 'Weekdays') {
      targetDays = daysOfWeek.slice(0, 5); // Monday to Friday
    } else {
      targetDays = [];
    }
  
    onCreate({ name, targetDays, startDate });
  
    setName('');
    setTargetType('');
    setCustomDays([]);
    setStartDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Habit Name */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Habit Name</label>
        <input 
          type="text"
          placeholder="Enter habit name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-600"
          required
        />
      </div>

      {/* Target Type */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Target Days</label>
        <select 
          value={targetType}
          onChange={(e) => setTargetType(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-600"
          required
        >
          <option value="">Select Target Days</option>
          <option value="Every Day">Every Day</option>
          <option value="Weekdays">Weekdays</option>
          <option value="Custom">Custom</option>
        </select>
      </div>

      {/* Custom Days Selection */}
      {targetType === 'Custom' && (
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">Select Custom Days:</label>
          <div className="flex flex-wrap gap-3">
            {daysOfWeek.map(day => (
              <label key={day} className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  checked={customDays.includes(day)}
                  onChange={() => handleCustomDayChange(day)}
                  className="accent-stone-600"
                />
                <span className="text-sm">{day}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Start Date */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Start Date</label>
        <input 
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-600"
          required
        />
      </div>

      {/* Submit Button */}
      <button 
        type="submit"
        className="w-full bg-stone-800 text-white py-2 rounded-md hover:bg-stone-600 transition-all font-semibold"
      >
        Create Habit
      </button>
    </form>
  );
};

export default HabitForm;