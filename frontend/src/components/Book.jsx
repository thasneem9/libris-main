import { useNavigate } from 'react-router-dom';

import './book.css'
import book1 from '../images/book1.png'
import book2 from '../images/book2.png'
import book3 from '../images/book3.png'
import defaultCover from '../images/defaultCover.png'
import { S3UrlContext } from '../contexts/s3urlContext'

import { useContext, useEffect,useState } from 'react'
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

// Set worker source to public path
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';


const Book = () => {
  const navigate = useNavigate();

  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);

  const [books,setBooks]=useState([])
/*   const {s3Url}=useContext(S3UrlContext) */
  const [openPdf,setOpenPdf]=useState(false)
   const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

 useEffect(()=>{
  const getBooks=async()=>{
    try {
       const res=await fetch('/api/books/getBookData',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials:'include'
    })

    const data=await res.json()
    if (data.error){
      console.log(data.error)
    }else{
     setBooks(data.books)
     console.log("books----",data.books)
    }

    } catch (error) {
      console.log(error)
    }
  }
  getBooks();
 },[])

const handleOpenBook = (bookUrl) => {
  setSelectedPdfUrl(bookUrl);
  navigate('/view-pdf', { state: { bookUrl } });
};

  
  console.log("selectedpdfurl-",selectedPdfUrl) 
  return (
    <>
    <div className='book-container'>
      {
        books.map((book,index)=>(
        <>
        <div    key={index}  className='book'  style={{ backgroundImage: `url(${book?.imageUrl || defaultCover})` }}  onClick={() => handleOpenBook(book?.fileName)}>  {book?.title || ''}</div>
        </>
        ))
      } 
   
    <div className='book'       style={{ backgroundImage: `url(${book1})` }}></div>
    <div className='book'       style={{ backgroundImage: `url(${book3})` }}></div>
    <div className='book'       style={{ backgroundImage: `url(${book1})` }}></div>
   </div>
{/*   {selectedPdfUrl && (
  <div className="pdf-viewer">
    <Document
      file={selectedPdfUrl}
      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      loading="Loading PDF..."
    >
      {Array.from(new Array(numPages), (el, index) => (
        <Page
          key={`page_${index + 1}`}
          pageNumber={index + 1}
          width={600}
        />
      ))}
    </Document>
  </div>
)} */}
    
    
    </>
  )
}

export default Book