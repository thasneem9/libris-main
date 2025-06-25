import React ,{useState,useEffect}from 'react';
import './Homepage.css';
import { FaMagic, FaClock } from 'react-icons/fa';
import { Container, Row, Col, Card, Button, InputGroup, FormControl, Nav } from 'react-bootstrap';
import Topbar from './Topbar';
import AddBookModal from './AddBookModal';
import { useNavigate } from 'react-router-dom';
const ancientBooks = [
  "https://picsum.photos/120/180?random=7",
  "https://picsum.photos/120/180?random=8",
  "https://picsum.photos/120/180?random=9",
  "https://picsum.photos/120/180?random=10",
  "https://picsum.photos/120/180?random=11"
];



const Homepage = () => {
    const navigate=useNavigate();
    const [allBooks, setAllBooks] = useState([]);
const [uniqueCategories, setUniqueCategories] = useState([]);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);

    const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
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


  return (
    <>
    <div className="d-flex homepage">
      <div className="sidebar p-3 d-flex flex-column justify-content-between">
        <div>
          <h4 className="logo mb-4">📚 Libris</h4>
          <Nav className="flex-column">
            <Nav.Link onClick={() => setShowModal(true)}>Add Book ❄️</Nav.Link>
            <Nav.Link>Frosty ❄️</Nav.Link>
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

     {Object.entries(booksByCategory).map(([category, books]) => (
  <section className="mb-4" key={category}>
    <h5 className="section-title">📚 {category}</h5>
    <div className="book-row d-flex gap-3 flex-wrap">
      {books.map((book, idx) => (
        <Card key={idx} className="book-card border-0 shadow-sm">
          <Card.Img
            src={book.coverImage || defaultCover}
            className="rounded"
            onClick={() => handleOpenBook(book.fileName, book._id)}
            style={{ cursor: 'pointer' }}
          />
          <Card.Body className="p-2">
            <Card.Title className="fs-6">{book.title}</Card.Title>
          </Card.Body>
        </Card>
      ))}
    </div>
  </section>
))}


       

        <section>
         <h5 className="section-title">🌍 Categories</h5>
<div className="d-flex gap-3 flex-wrap">
  {uniqueCategories.map((cat, idx) => (
    <div key={idx} className="category-pill px-3 py-1 rounded bg-light border">
      {cat}
    </div>
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
</>
  );
};

export default Homepage;
