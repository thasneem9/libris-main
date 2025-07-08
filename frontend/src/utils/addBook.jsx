// utils/addBook.js

export async function addBook({ file, metadata, coverImageFile }) {
  try {
    if (!file || !metadata?.title) {
      throw new Error("Missing file or metadata");
    }

    // 1. Upload PDF to S3
    const formData = new FormData();
    formData.append('pdf', file);

    const pdfRes = await fetch('/api/books/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const pdfData = await pdfRes.json();
    if (!pdfRes.ok || !pdfData.file?.location) {
      throw new Error('PDF upload failed');
    }

    const s3Url = pdfData.file.location;

    // 2. Upload Cover (optional)
    let coverImageUrl = '';
    if (coverImageFile) {
      const imgFormData = new FormData();
      imgFormData.append('cover', coverImageFile);

      const imgRes = await fetch('/api/books/upload-cover', {
        method: 'POST',
        body: imgFormData,
      });

      const imgData = await imgRes.json();
      if (!imgRes.ok || !imgData.url) {
        throw new Error('Cover upload failed');
      }

      coverImageUrl = imgData.url;
    }

    // 3. Save Metadata to MongoDB
    const metaRes = await fetch('/api/books/addBook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: metadata.title,
        author: metadata.author,
        category: metadata.category,
        fileName: s3Url,
        coverImage: coverImageUrl,
      }),
    });

    const metaData = await metaRes.json();
    if (!metaRes.ok) {
      throw new Error(metaData.error || 'Metadata save failed');
    }

    return {
      success: true,
      message: 'Book uploaded successfully!',
      s3Url,
      coverImageUrl,
      bookId: metaData.book?.id || null,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || 'Unknown error occurred',
    };
  }
}
