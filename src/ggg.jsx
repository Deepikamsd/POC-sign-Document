// import React, { useState, useRef, useEffect } from "react";
// import DocumentUploader from "./components/DocumentUploader";
// import DocumentPreview from "./components/DocumentPreview";
// import { PDFDocument } from "pdf-lib";
// import { saveAs } from "file-saver";
// import SignaturePadLib from "signature_pad";

// function App() {
//   const [file, setFile] = useState(null);
//   const [signature, setSignature] = useState(null);
//   const [signaturePosition, setSignaturePosition] = useState({ x: 50, y: 50 });

//   const canvasRef = useRef(null);
//   const sigPadRef = useRef(null);

//   // Initialize signature pad
//   useEffect(() => {
//     if (canvasRef.current) {
//       sigPadRef.current = new SignaturePadLib(canvasRef.current, {
//         backgroundColor: "white",
//         penColor: "black",
//       });
//     }
//   }, []);

//   // Save signature from canvas
//   const saveSignature = () => {
//     if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
//       const data = sigPadRef.current.toDataURL("image/png");
//       setSignature(data);
//     }
//   };

//   // Clear signature pad
//   const clearSignature = () => {
//     if (sigPadRef.current) {
//       sigPadRef.current.clear();
//     }
//   };

//   // Download signed PDF
//   const handleDownload = async () => {
//     if (!file || !signature) return;

//     const existingPdfBytes = await file.arrayBuffer();
//     const pdfDoc = await PDFDocument.load(existingPdfBytes);

//     const pages = pdfDoc.getPages();
//     const firstPage = pages[0];

//     const pngImage = await pdfDoc.embedPng(signature);
//     firstPage.drawImage(pngImage, {
//       x: signaturePosition.x,
//       y: firstPage.getHeight() - signaturePosition.y - 50,
//       width: 150,
//       height: 50,
//     });

//     const pdfBytes = await pdfDoc.save();
//     saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "signed.pdf");
//   };

//   return (
//     <div>
//       <h2>Sign Document POC</h2>

//       {/* Upload Document */}
//       <DocumentUploader onFileChange={setFile} />

//       {/* Preview Document */}
//       <DocumentPreview file={file} />

//       {/* Signature Drawing */}
//       <h3>Draw Signature</h3>
//       <canvas
//         ref={canvasRef}
//         width={400}
//         height={150}
//         style={{ border: "1px solid #000" }}
//       />
//       <div>
//         <button onClick={saveSignature}>Save Signature</button>
//         <button onClick={clearSignature}>Clear</button>
//       </div>

//       {/* Show saved signature preview and make draggable */}
//       {signature && (
//         <img
//           src={signature}
//           alt="signature"
//           draggable
//           onDragEnd={(e) =>
//             setSignaturePosition({
//               x: e.nativeEvent.offsetX,
//               y: e.nativeEvent.offsetY,
//             })
//           }
//           style={{
//             position: "absolute",
//             width: "150px",
//             cursor: "move",
//             top: 0,
//             left: 0,
//           }}
//         />
//       )}

//       {/* Save/Download */}
//       <button onClick={handleDownload}>Download Signed Document</button>
//     </div>
//   );
// }

// export default App;
