import'./rightsidebar.css'
import { useState,useEffect } from 'react';
import { Card } from 'react-bootstrap';
import StreakTracker from './StreakTracker';
function RightSidebar() {
    
  const [quote, setQuote] = useState(null);
 const fallbackQuote = `"The best way to get started is to quit talking and begin doing." — Walt Disney`;

       
      function getTodayIndex() {
        const day = new Date().getDay();
        return day === 0 ? 6 : day - 1;
      }
      
      const [checkedDays, setCheckedDays] = useState(() => {
          const saved = localStorage.getItem('checkedDays');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed) && parsed.length === 7) return parsed;
            } catch {}
          }
          return [false, false, false, false, false, false, false];
        });
      
        useEffect(() => {
          localStorage.setItem('checkedDays', JSON.stringify(checkedDays));
        }, [checkedDays]);
      
        useEffect(() => {
          const startTime = Date.now();
          const interval = setInterval(() => {
            const now = Date.now();
            const minutesSpent = (now - startTime) / 60000;
            console.log("⏳ Minutes spent:", minutesSpent.toFixed(2));
      
            if (minutesSpent >= 0.1) {
              const todayIdx = getTodayIndex();
              console.log("✅ Reached threshold! Attempting to mark day:", todayIdx);
      
              setCheckedDays((prev) => {
                if (prev[todayIdx]) {
                  console.log("🟡 Already marked today.");
                  clearInterval(interval);
                  return prev;
                }
                const updated = [...prev];
                updated[todayIdx] = true;
                console.log("🟢 Updated checkedDays:", updated);
                clearInterval(interval);
                return updated;
              });
            }
          }, 1000);
          return () => clearInterval(interval);
        }, []);
    return (<>
     {/* Right sidebar */}
  <div className="right-sidebar p-3">
    <Card className="mb-4 p-3 shadow-sm">
      <Card.Title>Daily Quote 📖</Card.Title>
      <Card.Text className="fst-italic text-muted small">
        {quote || "Loading..."}
      </Card.Text>
    </Card>

    <Card className="p-3 shadow-sm">
      <StreakTracker checkedDays={checkedDays} />
    </Card>
  </div></>  );
}

export default RightSidebar;