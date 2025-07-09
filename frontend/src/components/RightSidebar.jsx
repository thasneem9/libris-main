import'./rightsidebar.css'
import { useState,useEffect } from 'react';
import { Card } from 'react-bootstrap';
import StreakTracker from './StreakTracker';
import WhatsHappening from './RightSideBar/WhatsHappening';
function RightSidebar() {
    
  const [quote, setQuote] = useState(null);
 const fallbackQuote = `"The best way to get started is to quit talking and begin doing." — Walt Disney`;

      
      
    return (<>
     {/* Right sidebar */}
  <div className="right-sidebar p-3">
    <Card className="mb-4 p-3 shadow-sm">
      <Card.Title>Daily Quote 📖</Card.Title>
      <Card.Text className="fst-italic text-muted small">
        {quote || "Loading..."}
      </Card.Text>
    </Card>
     <WhatsHappening/>

    <Card className="p-3 shadow-sm">
      <StreakTracker />
    </Card>
  </div></>  );
}

export default RightSidebar;