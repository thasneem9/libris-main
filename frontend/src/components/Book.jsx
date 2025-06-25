import { useNavigate } from 'react-router-dom';

import './book.css'
import book1 from '../images/book1.png'
import book2 from '../images/book2.png'
import book3 from '../images/book3.png'
import defaultCover from '../images/defaultCover.png'
import { S3UrlContext } from '../contexts/s3urlContext'

import { useContext, useEffect,useState } from 'react'

const Book = () => {
  const navigate = useNavigate();

  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);

  const [books,setBooks]=useState([])//CONTAINS ALL MY BOOK DATA-INCLDUING URL, ID
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

const handleOpenBook = (bookUrl,bookId) => {
  setSelectedPdfUrl(bookUrl);
  console.log("book id paassed:--",bookId)
 navigate("/pdf-viewer", {
  state: {
    bookUrl: bookUrl,
    bookId: bookId
  }
});

};

  
  console.log("selectedpdfurl-",selectedPdfUrl) 
  return (
    <>
    <div className='book-container'>
      {
        books.map((book,index)=>(
        <>
        <div    key={index}  className='book'  style={{ backgroundImage: `url(${book?.coverImage || defaultCover})` }}  onClick={() => handleOpenBook(book?.fileName,book?._id)}>  {book?.title || ''}</div>
        </>
        ))
      } 
   
    <div className='book'       style={{ backgroundImage: `url(${book1})` }}></div>
    <div className='book'       style={{ backgroundImage: `url(${book3})` }}></div>
    <div className='book'       style={{ backgroundImage: `url(${book1})` }}></div>
   </div>

    
    
    </>
  )
}

export default Book