import React from 'react';
import './StreakTracker.css';
import { BsCheckCircleFill } from 'react-icons/bs';

export default function StreakTracker({ userName = "Anna" }) {
  // 🔹 DUMMY DATA: always show a 3-day streak
  const weekStreak = 3;
  // First 3 days = checked, last 4 = unchecked
  const last7 = [true, true, true, false, false, false, false];

  return (
    <div className="streak-tracker-container text-center">
      <div className="fire-icon mb-2">🔥</div>
      <h4 className="mb-0">{weekStreak}</h4>
      <small className="fw-bold">Day Streak</small>
      <p className="text-muted small mb-2">You're doing great, {userName}!</p>

      <div className="d-flex justify-content-between px-1 mt-2">
        {last7.map((isChecked, idx) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - idx));
          const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' }); // eg: "Mon"

          return (
            <div key={idx} className="text-center">
              <div className={`day-circle-sm ${isChecked ? 'checked' : ''}`}>
                {isChecked && <BsCheckCircleFill color="white" size={12} />}
              </div>
              <div className="day-label-sm">{dayLabel}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
