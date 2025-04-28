import { useState } from 'react';

const HabitForm = ({ onCreate }) => {
  const [name, setName] = useState('');
  const [targetType, setTargetType] = useState(''); // Every Day, Weekdays, Custom
  const [customDays, setCustomDays] = useState([]); // for Custom selected days
  const [startDate, setStartDate] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleCustomDayChange = (day) => {
    if (customDays.includes(day)) {
      setCustomDays(customDays.filter(d => d !== day)); // remove if already selected
    } else {
      setCustomDays([...customDays, day]); // add if not selected
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetDays = targetType === 'Custom' ? customDays : targetType;
    onCreate({ name, targetDays, startDate });
    setName('');
    setTargetType('');
    setCustomDays([]);
    setStartDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        placeholder="Habit Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />

      <select value={targetType} onChange={(e) => setTargetType(e.target.value)}>
        <option value="">Select Target Days</option>
        <option value="Every Day">Every Day</option>
        <option value="Weekdays">Weekdays</option>
        <option value="Custom">Custom</option>
      </select>

      {targetType === 'Custom' && (
        <div style={{ marginTop: '10px' }}>
          <p>Select Custom Days:</p>
          {daysOfWeek.map(day => (
            <label key={day} style={{ marginRight: '10px' }}>
              <input 
                type="checkbox" 
                checked={customDays.includes(day)} 
                onChange={() => handleCustomDayChange(day)}
              />
              {day}
            </label>
          ))}
        </div>
      )}

      <input 
        type="date" 
        value={startDate} 
        onChange={(e) => setStartDate(e.target.value)} 
      />

      <button type="submit">Create Habit</button>
    </form>
  );
};

export default HabitForm;
