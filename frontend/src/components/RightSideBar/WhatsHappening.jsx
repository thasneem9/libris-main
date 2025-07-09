import { Card } from "react-bootstrap";
import './whatshappening.css'
function WhatsHappening() {
    return ( <>
    <Card style={{ width: '16rem' }} className="mt-4 mb-4">
        <Card.Body>
            <Card.Title>What's Happening</Card.Title>
            <ul>
                <li> Diana just finished Atomic Habits</li>
                <li> Ali HIghlighted 3 quotes from The Alchemist</li>
                <li> You posted a reflection on Deep work</li>
            </ul>
        </Card.Body>
    </Card>
    
    </> );
}

export default WhatsHappening;