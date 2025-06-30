import React ,{useState,useEffect}from 'react';
import './Homepage.css';
import { FaMagic, FaClock } from 'react-icons/fa';
import { Container, Row, Col, Card, Button, InputGroup, FormControl, Nav } from 'react-bootstrap';
import Topbar from './Topbar';
import AddBookModal from './AddBookModal';
import { useNavigate } from 'react-router-dom';
import { IoAddCircleOutline } from "react-icons/io5";
import BookPreviewModal from './BookPreviewModal';
import { PiBooksLight } from "react-icons/pi";
import { BiCategoryAlt } from "react-icons/bi";
import defaultCover from '../images/defaultCover.png'
import {themes} from '../utils/theme'
import {
  FaCog,
  FaUser,
  FaRss,
  FaQuoteRight,
  FaGamepad,
  FaBookmark,
  FaSignOutAlt
} from 'react-icons/fa';

import { TbColorFilter } from "react-icons/tb";

import { Dropdown } from 'react-bootstrap';
import StreakTracker  from './StreakTracker';

const Homepage = () => {
    const navigate=useNavigate();
    const [allBooks, setAllBooks] = useState([]);
const [uniqueCategories, setUniqueCategories] = useState([]);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);

    const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
const [selectedBook, setSelectedBook] = useState(null);
const [previewOpen, setPreviewOpen] = useState(false);
  const [quote, setQuote] = useState(null);
 const fallbackQuote = `"The best way to get started is to quit talking and begin doing." — Walt Disney`;

  useEffect(() => {
    fetch("https://type.fit/api/quotes")
      .then((res) => res.json())
      .then((data) => {
        const random = data[Math.floor(Math.random() * data.length)];
        setQuote(`"${random.text}" — ${random.author || "Unknown"}`);
      })
      .catch((err) => {
        console.error("Quote fetch failed:", err);
        setQuote(fallbackQuote);
      });
  }, []);

useEffect(() => {
    fetch("https://api.quotable.io/random")
      .then((res) => res.json())
      .then((data) => {
        setQuote(`"${data.content}" — ${data.author}`);
      })
      .catch((err) => {
     /*    console.error("Failed to fetch quote:", err); */
        setQuote("“Inspiration failed to load.”");
      });
  }, []);
  const [metadata, setMetadata] = useState({

    title: '',
    author: '',
    category: '',
    coverImage:'',
    fileName:''
  });
  const [coverImageFile, setCoverImageFile] = useState(null);
const handleCoverImageChange = (e) => {
  const imageFile = e.target.files[0];
  setCoverImageFile(imageFile);
};

  const [s3Url,setS3Url]=useState('')
const [booksByCategory, setBooksByCategory] = useState({});


useEffect(() => {
  const getBooks = async () => {
    try {
      const res = await fetch('/api/books/getBookData', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await res.json();
      if (!data.error) {
        setAllBooks(data.books); // ✅ Fix 1

        // ✅ Group books by category
        const grouped = {};
        data.books.forEach(book => {
          const cat = book.category || 'Uncategorized';
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(book);
        });

        setBooksByCategory(grouped); // ✅ Fix 2

        // ✅ Extract and store unique category names
        const categories = Object.keys(grouped);  // ✅ Fix 3
        setUniqueCategories(categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  getBooks();
}, []);

const handleOpenBook = (bookUrl,bookId) => {
  setSelectedPdfUrl(bookUrl);
  console.log("book id paassed:--",bookId)
 navigate("/pdf-viewer", {
  state: {
    bookUrl: bookUrl,
    bookId: bookId
  }
})}
 const handleChooseFile = () => {
    document.getElementById('hiddenPdfInput').click();
  };
  const handleFileUpload = async () => {
    //sendJUST file to AWS using fetch..not array it was single...
       const formData=new FormData();
        formData.append('pdf', file);
    const res = await fetch('/api/books/upload', {
      method: 'POST',
      body: formData,
       credentials:'include',
    });
    const data=await res.json();
    console.log(data)
    if (res.ok) {
      alert('Book was uploaded!');
      setFormOpen(false);
    }
    // save the S3 URL for rendering later
    const s3Url = data.file.location;
/*     console.log("s3 url: ",s3Url) */
    setS3Url(s3Url);  // for example, store in state


     // ✅ Upload Cover Image to Cloudinary
let coverImageUrl = '';
  if (coverImageFile) {
    const imageFormData = new FormData();
    imageFormData.append('cover', coverImageFile);

    const imgRes = await fetch('/api/books/upload-cover', {
      method: 'POST',
      body: imageFormData,
    });

    const imgData = await imgRes.json();
    coverImageUrl = imgData.url;
  }
      const metadataRes = await fetch('/api/books/addBook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: metadata.title,
      author: metadata.author,
      category: metadata.category,
      fileName:s3Url,
      coverImage:coverImageUrl
    }),
  });
//SEND META DATA TO MONGODB SO THAT TITLE CAN APPEAR DYNAMICALY-----

  const metadataData = await metadataRes.json();
console.log(metadataData)
  if (metadataRes.ok) {
    alert('Book metadata saved successfully!');
    setFormOpen(false);
  } else {
    alert('Saving metadata failed');
  }


  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);



       setMetadata((prev) => ({
        ...prev,
        title: selectedFile.name.replace('.pdf', ''),
      }));
      setFormOpen(true); // show popup/modal to get metadata
    }
  };

  
    const handleDeleteBook = async (book) => {
    if (!window.confirm(`Are you sure you want to delete "${book.title}"?`)) return;
  
    try {
      const res = await fetch('/api/books/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fileName: book.fileName, // S3 key
          bookId: book._id,        // MongoDB id
        }),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert('Book deleted successfully');
        // Refresh UI
        setBooksByCategory(prev => {
          const updated = { ...prev };
          const cat = book?.category;
          updated[cat] = updated[cat]?.filter(b => b._id !== book._id);
          return updated;
        });
        setAllBooks(prev => prev.filter(b => b._id !== book._id));
        setShowModal(false);
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (error) {
      console.error('Failed to delete book', error);
      alert("Something went wrong while deleting the book.");
    }
  };
  
 /* ----------------------------------- */

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


const applyTheme = (themeName) => {
  const theme = themes[themeName];
  if (!theme) return;

  Object.keys(theme).forEach((key) => {
    document.documentElement.style.setProperty(key, theme[key]);
  });
};


const handleThemeChange = (themeName) => {
  applyTheme(themeName);
  localStorage.setItem('theme', themeName);
};


useEffect(() => {
    const saved = localStorage.getItem('theme') || 'frosty';
    applyTheme(saved);
  }, []);
return(
    <>
  <Topbar />

  <div className="homepage-layout">
    {/* Sidebar */}
   <div className="sidebar p-3 d-flex flex-column justify-content-between">
  <div>
    <h4 className="logo mb-4">📚 Libris</h4>
        <Nav className="flex-column gap-2">
          <Button variant="primary" className="rounded-pill shadow-sm" onClick={() => setShowModal(true)}>
            Add Book ❄️
          </Button>
 <Dropdown>
      <Dropdown.Toggle variant="outline-primary" className="rounded-pill longer">
        <TbColorFilter size={20} className="me-2" /> Themes
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => applyTheme('frosty')}>❄️ Frosty</Dropdown.Item>
{/*         <Dropdown.Item onClick={() => applyTheme('galaxy')}>🌌 Galaxy</Dropdown.Item>
 */}        <Dropdown.Item onClick={() => applyTheme('coffee')}>☕ Coffee</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>


        
        </Nav>
      </div>

   <div className="sidebar-links-wrapper">
    <ul className="sidebar-links">
      <li><FaCog className="me-2" /> Settings</li>
      <li><FaUser className="me-2" /> User Account</li>
      <li><FaRss className="me-2" /> Feed</li>
      <li><FaQuoteRight className="me-2" /> Quotes</li>
      <li><FaGamepad className="me-2" /> Game</li>
      <li><FaBookmark className="me-2" /> Highlights/Bookmarks</li>
    </ul>
    <Button variant="outline-secondary" size="sm" className="mt-2">
      <FaSignOutAlt className="me-2" />
      Logout
    </Button>
  </div>
</div>

    {/* Main + Right section grouped tightly */}
    <div className="main-right-wrapper d-flex">
      {/* Main content */}
      <div className="main-content p-3">
        <h2 className="main-title">The Grand Library</h2>

        {Object.entries(booksByCategory).map(([category, books]) => (
          <section className="mb-4" key={category}>
            <h5 className="section-title"> <PiBooksLight size={30}/> {category}</h5>
            <div className="book-row ">
            {books.map((book, idx) => (
  <Card key={idx} className="book-card border-0 shadow-sm">
   <Card.Img
  src={book?.coverImage || defaultCover}
  className="rounded"
  onClick={() => {
    setSelectedBook(book);
    setPreviewOpen(true);
  }}
  style={{ cursor: 'pointer' }}
/>

    <Card.Body className="p-2">
      <Card.Title className="fs-6">{book.title}</Card.Title>
    </Card.Body>
  </Card>
))}

{/* Plus card at the end */}

{/* <Card
  onClick={() => setShowModal(true)}
  className="book-card add-book-card d-flex flex-column align-items-center justify-content-center"

>
  <IoAddCircleOutline size={50} className="add-icon mb-2" />
  <div className="add-text">Add Book</div>
</Card>
 */}

            </div>
          </section>
        ))}

        <section>
          <h5 className="section-title"><BiCategoryAlt size={30} /> Categories</h5>
          <div className="d-flex gap-3 flex-wrap">
            {uniqueCategories.map((cat, idx) => (
              <div key={idx} className="category-pill px-3 py-1 rounded bg-light border">
                {cat}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Sidebar */}
      <div className="right-sidebar p-3">
       <Card className="mb-4 p-3 shadow-sm">
      <Card.Title>Daily Quote 📖</Card.Title>
      <Card.Text className="fst-italic text-muted small">
        {quote || "Loading..."}
      </Card.Text>
{/*       <a href="#" className="small">More Insights →</a>
 */}    </Card>

        <Card className="p-3 shadow-sm">
       
             <StreakTracker checkedDays={checkedDays} />

        </Card>
      </div>
    </div>
  </div>

  {/* Modal */}
  <AddBookModal
    show={showModal}
    onHide={() => setShowModal(false)}
    formOpen={formOpen}
    handleChooseFile={handleChooseFile}
    handleFileChange={handleFileChange}
    handleCoverImageChange={handleCoverImageChange}
    handleFileUpload={handleFileUpload}
    metadata={metadata}
    setMetadata={setMetadata}
  />
  <BookPreviewModal
  show={previewOpen}
  onHide={() => setPreviewOpen(false)}
  book={selectedBook}
  handleOpenBook={() => handleOpenBook(selectedBook.fileName, selectedBook._id)}
  handleDeleteBook={handleDeleteBook}
/>

</>


)
}
export default Homepage