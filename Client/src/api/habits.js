import axios from 'axios';

const API_URL = 'https://habitvault-backend.onrender.com/api/habits';

export const createHabit = async (token, habitData) => {
  const res = await axios.post(API_URL, habitData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getHabits = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const logHabit = async (token, habitId, status) => {
  const res = await axios.post(`${API_URL}/${habitId}/log`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// DELETE today's log
export const deleteHabitLog = async (token, habitId) => {
  const res = await axios.delete(`${API_URL}/${habitId}/delete`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Edit Habit
export const editHabit = async (token, habitId, habitData) => {
  const res = await axios.put(`${API_URL}/${habitId}`, habitData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
