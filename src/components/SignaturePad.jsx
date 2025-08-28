import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

const SignaturePad = ({ onSave }) => {
  const sigRef = useRef();

  const saveSignature = () => {
    const dataURL = sigRef.current.getCanvas().toDataURL("image/png");
    onSave(dataURL);
  };

  return (
    <div>
      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
      />
      <button onClick={saveSignature}>Save Signature</button>
      <button onClick={() => sigRef.current.clear()}>Clear</button>
    </div>
  );
};

export default SignaturePad;
