import React from 'react';
import './Homepage.css';
import { FaMagic, FaClock } from 'react-icons/fa';
import { Container, Row, Col, Card, Button, InputGroup, FormControl, Nav } from 'react-bootstrap';
import Topbar from './Topbar';

const books = [
  "https://picsum.photos/120/180?random=1",
  "https://picsum.photos/120/180?random=2",
  "https://picsum.photos/120/180?random=3",
  "https://picsum.photos/120/180?random=4",
  "https://picsum.photos/120/180?random=5",
  "https://picsum.photos/120/180?random=6"
];

const ancientBooks = [
  "https://picsum.photos/120/180?random=7",
  "https://picsum.photos/120/180?random=8",
  "https://picsum.photos/120/180?random=9",
  "https://picsum.photos/120/180?random=10",
  "https://picsum.photos/120/180?random=11"
];

const categories = [
  "https://picsum.photos/70?random=12",
  "https://picsum.photos/70?random=13",
  "https://picsum.photos/70?random=14",
  "https://picsum.photos/70?random=15",
  "https://picsum.photos/70?random=16",
  "https://picsum.photos/70?random=17"
];

const Homepage = () => {
  return (
    <div className="d-flex homepage">
      <div className="sidebar p-3 d-flex flex-column justify-content-between">
        <div>
          <h4 className="logo mb-4">📚 Libris</h4>
          <Nav className="flex-column">
            <Nav.Link className="active-tab">Frosty ❄️</Nav.Link>
            <Nav.Link>Galaxy 🌌</Nav.Link>
            <Nav.Link>Coffee ☕</Nav.Link>
          </Nav>
        </div>
        <div>
          <ul className="sidebar-links">
            <li>Settings</li>
            <li>User Account</li>
            <li>Feed</li>
            <li>Quotes</li>
            <li>Game</li>
            <li>Highlights/Bookmarks</li>
          </ul>
          <Button variant="outline-secondary" size="sm">Logout</Button>
        </div>
      </div>
      <div className='d-flex flex-column'>
        <Topbar/>
      {/* Main */}
      <Container fluid className="main-content py-4 px-5">

        <h2 className="main-title">The Grand Library</h2>

        <section className="mb-4">
          <h5 className="section-title">✨ Fantasy Books</h5>
          <div className="book-row d-flex gap-3">
            {books.map((src, idx) => (
              <Card key={idx} className="book-card border-0 shadow-sm">
                <Card.Img src={src} className="rounded" />
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-4">
          <h5 className="section-title">📜 Ancient Books</h5>
          <div className="book-row d-flex gap-3">
            {ancientBooks.map((src, idx) => (
              <Card key={idx} className="book-card border-0 shadow-sm">
                <Card.Img src={src} className="rounded" />
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h5 className="section-title">🌍 Explore Other Categories</h5>
          <div className="d-flex gap-3">
            {categories.map((src, idx) => (
              <img key={idx} src={src} alt="Category" className="category-icon rounded-circle" />
            ))}
          </div>
        </section>
      </Container>
      </div>

      {/* Right Sidebar */}
      <div className="right-sidebar p-3">
        <Card className="mb-4 p-3 shadow-sm">
          <Card.Title>📖 Arcane Lore</Card.Title>
          <Card.Text className="fst-italic text-muted small">
            “True knowledge lies not in the pages, but in the echoes they stir within your soul.”
          </Card.Text>
          <a href="#" className="small">More Insights →</a>
        </Card>

        <Card className="p-3 shadow-sm">
          <Card.Title><FaClock /> Time Spent Reading</Card.Title>
          <div className="bar-graph d-flex gap-2 align-items-end mt-3 mb-2">
            {[80, 160, 120, 320, 240].map((h, i) => (
              <div key={i} className="bar" style={{ height: `${h / 2}px` }}></div>
            ))}
          </div>
          <div className="text-muted small">
            <p>Total Words: <b>1524</b></p>
            <p>Average Mastery: <b>84%</b></p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Homepage;
