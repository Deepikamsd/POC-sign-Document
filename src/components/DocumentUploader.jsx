
import React from "react";

const DocumentUploader = ({ onFileChange }) => {
  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          if (e.target.files.length > 0) {
            onFileChange(e.target.files[0]); 
          }
        }}
      />
    </div>
  );
};

export default DocumentUploader;
