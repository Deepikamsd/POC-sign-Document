import React from "react";

const SignatureUploader = ({ onSave }) => {
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const reader = new FileReader();
          reader.onload = () => onSave(reader.result);
          reader.readAsDataURL(e.target.files[0]);
        }}
      />
    </div>
  );
};

export default SignatureUploader;
