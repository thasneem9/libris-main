import React, { createContext, useState } from 'react';

export const S3UrlContext = createContext();

export function SharedS3UrlProvider({ children }) {
  const [s3Url, setS3Url] = useState('');

  return (
    <S3UrlContext.Provider value={{ s3Url, setS3Url }}>
      {children}
    </S3UrlContext.Provider>
  );
}

