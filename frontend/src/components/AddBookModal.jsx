import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { IoBookOutline } from 'react-icons/io5';
import './addbookmodal.css';

const AddBookModal = ({
  show,
  onHide,
  formOpen,
  handleChooseFile,
  handleFileChange,
  handleCoverImageChange,
  handleFileUpload,
  metadata,
  setMetadata
}) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="add-book-modal">
      <Modal.Body>
        <div className="upload-container">
          <div className="inner-box text-center p-4">
            <IoBookOutline size={120} className="book-icon mb-3" />
            <p className="mb-3">Drag and Drop a PDF File into this Box</p>
            <Button variant="outline-secondary" onClick={handleChooseFile}>
              Choose a File
            </Button>
            <input
              type="file"
              id="hiddenPdfInput"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          {formOpen && (
            <div className="popup-form mt-4">
              <h5 className="mb-3">📘 Book Info</h5>
              <input
                className="form-control mb-2"
                value={metadata.title}
                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                placeholder="Title"
              />
              <input
                className="form-control mb-2"
                value={metadata.author}
                onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
                placeholder="Author"
              />
              <input
                className="form-control mb-2"
                value={metadata.category}
                onChange={(e) => setMetadata({ ...metadata, category: e.target.value })}
                placeholder="Category"
              />
              <input
                type="file"
                accept="image/*"
                className="form-control mb-3"
                onChange={handleCoverImageChange}
              />
              <Button className="save-book-btn" onClick={handleFileUpload}>
                Save
              </Button>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddBookModal;
