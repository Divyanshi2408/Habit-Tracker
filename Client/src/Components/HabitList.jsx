import { useState, useEffect } from "react";
import HabitPerformanceChart from "./HabitPerformanceChart";

const HabitList = ({ habits, onLog, onDelete, onUpdate }) => {
  const [today, setToday] = useState("");
  const [todaysHabits, setTodaysHabits] = useState([]);
  const [upcomingHabits, setUpcomingHabits] = useState([]);
  const [expandedHabitId, setExpandedHabitId] = useState(null);
  const [editHabitId, setEditHabitId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    targetDays: [],
    startDate: "",
  });

  const [editTargetType, setEditTargetType] = useState("");
  const [editCustomDays, setEditCustomDays] = useState([]);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const currentDate = new Date();
    setToday(currentDate.toLocaleDateString("en-US", { weekday: "long" }));

    const todays = [];
    const upcoming = [];

    habits.forEach((habit) => {
      const habitStartDate = new Date(habit.startDate);
      const isStarted =
        habitStartDate.toDateString() <= currentDate.toDateString();
      const isTodayTarget = habit.targetDays.includes(
        currentDate.toLocaleDateString("en-US", { weekday: "long" })
      );

      if (isStarted && isTodayTarget) {
        todays.push(habit);
      } else if (!isStarted || !isTodayTarget) {
        upcoming.push(habit);
      }
    });

    setTodaysHabits(todays);
    setUpcomingHabits(upcoming);
  }, [habits]);

  const handleLog = async (habitId, status, e) => {
    e.stopPropagation();
    try {
      await onLog(habitId, status); // <<< use the prop
    } catch (error) {
      console.error("Failed to log habit:", error);
    }
  };

  const handleDelete = async (habitId) => {
    // e.stopPropagation();
    try {
      await onDelete(habitId); // <<< use the prop
      setExpandedHabitId(null);
    } catch (error) {
      console.error("Failed to delete habit:", error);
    }
  };

  // const handleEditClick = (habit, e) => {
  //   e.stopPropagation();
  //   setEditHabitId(habit._id);
  //   setEditFormData({
  //     name: habit.name,
  //     targetDays: habit.targetDays,
  //     startDate: habit.startDate.split("T")[0],
  //   });
  // };

  const handleEditClick = (habit, e) => {
    e.stopPropagation();
    setEditHabitId(habit._id);
    setEditFormData({
      name: habit.name,
      targetDays: habit.targetDays,
      startDate: habit.startDate.split("T")[0],
    });

    if (habit.targetDays.length === 7) {
      setEditTargetType("Every Day");
      setEditCustomDays([]);
    } else if (
      habit.targetDays.length === 5 &&
      !habit.targetDays.includes("Saturday") &&
      !habit.targetDays.includes("Sunday")
    ) {
      setEditTargetType("Weekdays");
      setEditCustomDays([]);
    } else {
      setEditTargetType("Custom");
      setEditCustomDays(habit.targetDays);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditTargetTypeChange = (e) => {
    setEditTargetType(e.target.value);
    if (e.target.value !== "Custom") {
      setEditCustomDays([]);
    }
  };

  const handleEditCustomDayChange = (day) => {
    if (editCustomDays.includes(day)) {
      setEditCustomDays(editCustomDays.filter((d) => d !== day));
    } else {
      setEditCustomDays([...editCustomDays, day]);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
  
    let updatedTargetDays = [];
    if (editTargetType === 'Every Day') {
      updatedTargetDays = daysOfWeek;
    } else if (editTargetType === 'Weekdays') {
      updatedTargetDays = daysOfWeek.slice(0, 5); // Monday to Friday
    } else {
      updatedTargetDays = editCustomDays;
    }
  
    try {
      await onUpdate(editHabitId, {
        ...editFormData,
        targetDays: updatedTargetDays,
      });
      setEditHabitId(null);
      setEditFormData({ name: "", targetDays: [], startDate: "" });
      setEditTargetType('');
      setEditCustomDays([]);
    } catch (error) {
      console.error("Failed to update habit:", error);
    }
  };
  

  const toggleAccordion = (habitId) => {
    setExpandedHabitId((prevId) => (prevId === habitId ? null : habitId));
  };

  const renderHabitItem = (habit, isToday) => (
    <li key={habit._id} className="border-b p-4 hover:bg-gray-50 relative ">
      <div className="flex items-center justify-between">
        <span className="font-semibold">{habit.name}</span>

        <div className="flex space-x-3 items-center">
          {/* Toggle Accordion Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleAccordion(habit._id);
            }}
            className="text-gray-600 hover:text-black focus:outline-none cursor-pointer"
          >
            {expandedHabitId === habit._id ? "🔼" : "🔽"}
          </button>

          {isToday && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLog(habit._id, "completed", e);
                }}
                className="text-green-600 hover:text-green-800 cursor-pointer"
              >
                ✅
              </button>
              <button
                onClick={(e) => handleLog(habit._id, "missed", e)}
                className="text-red-600 hover:text-red-800 cursor-pointer"
              >
                ❌
              </button>
            </>
          )}
          <button
            onClick={(e) => handleEditClick(habit, e)}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(habit._id);
            }}
            className="text-gray-600 hover:text-black cursor-pointer"
          >
            🗑️
          </button>
        </div>
      </div>

      {expandedHabitId === habit._id && (
        <div className="mt-4 p-2 border-t">
          {editHabitId === habit._id ? (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                  placeholder="Habit Name"
                />
              </div>
              <div>
                {/* <label className="block text-gray-700 mb-1">Target Days:</label>
                <input
                  type="text"
                  name="targetDays"
                  value={editFormData.targetDays.join(', ')}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                  placeholder="e.g. Monday, Wednesday, Friday"
                /> */}

                <label className="block text-gray-700 mb-1">Target Days:</label>
                <select
                  value={editTargetType}
                  onChange={handleEditTargetTypeChange}
                  className="w-full p-2 border rounded mb-2"
                  required
                >
                  <option value="">Select Target Days</option>
                  <option value="Every Day">Every Day</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Custom">Custom</option>
                </select>

                {editTargetType === "Custom" && (
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <label key={day} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editCustomDays.includes(day)}
                          onChange={() => handleEditCustomDayChange(day)}
                          className="accent-stone-600"
                        />
                        <span className="text-sm">{day}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Start Date:</label>
                <input
                  type="date"
                  name="startDate"
                  value={editFormData.startDate}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
              >
                Save
              </button>
            </form>
          ) : (
            <>
              <p>
                <strong>Target Days:</strong> {habit.targetDays.join(", ")}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(habit.startDate).toDateString()}
              </p>
              <p>
                <strong>Current Streak:</strong> {habit.currentStreak}
              </p>
              <p>
                <strong>Longest Streak:</strong> {habit.longestStreak}
              </p>
              <div className="mt-2">
                <HabitPerformanceChart habitData={habit.logs} />
              </div>
            </>
          )}
        </div>
      )}
    </li>
  );

  return (
    <div className="grid grid-cols-2 max-md:grid-cols-1 gap-8">
      {/* Today's Tasks */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-green-700">
          Today's Tasks
        </h2>
        <ul>
          {todaysHabits.length > 0 ? (
            todaysHabits.map((habit) => renderHabitItem(habit, true))
          ) : (
            <p className="text-gray-500">No tasks for today!</p>
          )}
        </ul>
      </div>

      {/* Upcoming Tasks */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Upcoming Tasks
        </h2>
        <ul>
          {upcomingHabits.length > 0 ? (
            upcomingHabits.map((habit) => renderHabitItem(habit, false))
          ) : (
            <p className="text-gray-500">No upcoming tasks!</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HabitList;
