import React, { useState,useEffect } from 'react';
import AddBookModal from '../AddBookModal.jsx';
import { useBookUploader } from '../../hooks/useBookUploader.js';
import Topbar from '../Topbar.jsx';
import Sidebar from '../Sidebar.jsx'
import StreakTracker from '../StreakTracker.jsx';
import { Card } from 'react-bootstrap';
import './defaultlayout.css'
import RightSidebar from '../RightSidebar.jsx';

export default function DefaultLayout({children}) {
  /* contains topbar and sidebars with working buttonslike addbook */
  const fallbackQuote = `"The best way to get started is to quit talking and begin doing." — Walt Disney`;
  const [formOpen, setFormOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [quote, setQuote] = useState(null);
  const [file, setFile] = useState(null);
  const [s3Url,setS3Url]=useState('')
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

  /* FEED  */
    setCoverImageFile(imageFile);
    };
   
    
    useEffect(() => {
        fetch("https://api.quotable.io/random")
          .then((res) => res.json())
          .then((data) => {
            setQuote(`"${data.content}" — ${data.author}`);
          })
          .catch((err) => {
         /*    console.error("Failed to fetch quote:", err); */
            setQuote("Science is not about removing mysteries but turning unkown mysteries into better mysteries");
          });
      }, []);

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
  <Topbar />
<div className="feed-layout d-flex">
  {/* Left sidebar */}
  <Sidebar setShowModal={setShowModal} />
  {/* Main feed (optional center content) */}
  <div className="feed-main p-3 flex-grow-1">
   {children}
  </div>
  <div>
  </div>
 <RightSidebar></RightSidebar>
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
}


