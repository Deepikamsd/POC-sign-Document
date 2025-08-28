import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";


pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const DocumentPreview = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);

     
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px" }}>
      {fileUrl ? (
        <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
      ) : (
        <p>No file chosen</p>
      )}
    </div>
  );
};

export default DocumentPreview;
