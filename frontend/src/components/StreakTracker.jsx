import React, { useEffect, useState } from 'react';
import './StreakTracker.css';
import { BsCheckCircleFill } from 'react-icons/bs';


  export default function StreakTracker({ userName = "Anna", checkedDays }) {
  const getTodayIndex = () => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
  };

  const calculateStreak = (daysArr) => {
    let streak = 0;
    const today = getTodayIndex();
    for (let i = 0; i < 7; i++) {
      const idx = (today - i + 7) % 7;
      if (daysArr[idx]) streak++;
      else break;
    }
    return streak;
  };

  const weekStreak = calculateStreak(checkedDays);

  return (
    <div className="streak-tracker-container text-center">
      <div className="fire-icon mb-2">🔥</div>
      <h4 className="mb-0">{weekStreak}</h4>
      <small className="fw-bold">Day Streak</small>
      <p className="text-muted small mb-2">You're doing great, {userName}!</p>

      <div className="d-flex justify-content-between px-1 mt-2">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
          <div key={idx} className="text-center">
            <div className={`day-circle-sm ${checkedDays[idx] ? 'checked' : ''}`}>
              {checkedDays[idx] && <BsCheckCircleFill color="white" size={12} />}
            </div>
            <div className="day-label-sm">{day}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
