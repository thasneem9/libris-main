// hooks/useBookUploader.js

import { useState } from 'react';
import { addBook } from '../utils/addBook';

export function useBookUploader() {
  const [file, setFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [metadata, setMetadata] = useState({
    title: '',
    author: '',
    category: '',
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setMetadata((prev) => ({
        ...prev,
        title: selectedFile.name.replace('.pdf', ''),
      }));
    }
  };

  const handleCoverImageChange = (e) => {
    const imageFile = e.target.files[0];
    setCoverImageFile(imageFile);
  };

  const handleChooseFile = () => {
    document.getElementById('hiddenPdfInput')?.click();
  };

  const upload = async () => {
    return await addBook({ file, metadata, coverImageFile });
  };

  return {
    file,
    metadata,
    setMetadata,
    handleFileChange,
    handleCoverImageChange,
    handleChooseFile,
    upload,
  };
}
