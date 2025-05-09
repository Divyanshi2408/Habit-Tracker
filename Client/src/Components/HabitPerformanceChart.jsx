import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css'; // Default styles
import '../index.css'; // Your custom styles (if any)

const HabitPerformanceChart = ({ habitData }) => {
  const values = habitData
    .filter(log => log.date && log.status)
    .map(log => ({
      date: log.date,
      count: log.status === 'completed' ? 1 : log.status === 'missed' ? -1 : 0,
    }));

  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  return (
    <div className="p-4">
      <CalendarHeatmap
        startDate={threeMonthsAgo}
        endDate={today}
        values={values}
        classForValue={(value) => {
          if (!value) return 'color-empty';
          return value.count > 0 ? 'color-github-4' : 'color-github-0';
        }}
        tooltipDataAttrs={(value) => {
          if (!value?.date) return {};
          return {
            'data-tip': `${value.date}: ${value.count > 0 ? 'Completed' : 'Missed'}`,
          };
        }}
        showWeekdayLabels
      />
    </div>
  );
};

export default HabitPerformanceChart;