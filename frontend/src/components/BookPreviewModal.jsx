import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaBookOpen, FaEdit, FaTrash, FaHeart } from 'react-icons/fa';
import './bookpreviewmodal.css'
const BookPreviewModal = ({ show, onHide, book,handleOpenBook }) => {
  if (!book) return null;

  const { title, author, coverImage } = book;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="frosty-modal">
      <div className="d-flex" style={{ minHeight: '400px' }}>
        {/* Left Sidebar */}
        <div className="bg-light p-3 border-end" style={{ width: '160px' }}>
          <Button variant="outline-primary" className="w-100 mb-2">Notes</Button>
          <Button variant="outline-info" className="w-100 mb-2">Quotes</Button>
          <Button variant="outline-secondary" className="w-100">Vocab Box</Button>
        </div>

        {/* Main Content */}
        <div className="p-4 d-flex flex-grow-1">
          <img src={coverImage} alt="cover" className="rounded shadow" style={{ width: '140px', height: '210px', objectFit: 'cover' }} />

          <div className="ms-4 d-flex flex-column justify-content-between">
            <div>
              <h4 className="fw-bold">{title}</h4>
              <p className="text-muted mb-1">by {author}</p>
              <p className="fst-italic mb-2">Genre: Fantasy</p>
              <p style={{ maxWidth: '400px' }}>
                In a world of forgotten scrolls and silent ruins, this book whispers tales of forgotten wisdom and lost magic.
              </p>
            </div>

            <div className="d-flex gap-3 mt-3">
              <Button variant="primary" onClick={handleOpenBook}><FaBookOpen className="me-2" /> Read</Button>
              <Button variant="warning"><FaEdit className="me-2" /> Edit</Button>
              <Button variant="danger"><FaTrash className="me-2" /> Delete</Button>
              <Button variant="outline-danger"><FaHeart className="me-2" /> Favorite</Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BookPreviewModal;
