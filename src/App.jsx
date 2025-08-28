
import React, { useRef, useState } from "react";
import DocumentUploader from "./components/DocumentUploader";
import DocumentPreview from "./components/DocumentPreview";
import SignatureUploader from "./components/SignatureUploader";
import SignaturePadLib from "signature_pad";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

function App() {
  const [file, setFile] = useState(null);
  const [signature, setSignature] = useState(null);
  const [signaturePosition, setSignaturePosition] = useState({ x: 50, y: 50 });
  const [dragging, setDragging] = useState(false);
  const signaturePadRef = useRef(null);
  const canvasRef = useRef(null);

  const initSignaturePad = (canvas) => {
    if (canvas && !signaturePadRef.current) {
      signaturePadRef.current = new SignaturePadLib(canvas, {
        backgroundColor: "rgba(255,255,255,0)",
        penColor: "#2c3e50",
      });
    }
  };

  const handleSaveSignature = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const dataURL = signaturePadRef.current.toDataURL("image/png");
      setSignature(dataURL);
    } else {
      alert("Please draw your signature first!");
    }
  };

  const handleDownload = async () => {
    if (!file || !signature) {
      alert("Upload document and add signature first!");
      return;
    }

    const existingPdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const pngImage = await pdfDoc.embedPng(signature);
    firstPage.drawImage(pngImage, {
      x: signaturePosition.x,
      y: firstPage.getHeight() - signaturePosition.y - 50,
      width: 150,
      height: 50,
    });

    const pdfBytes = await pdfDoc.save();
    saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "signed.pdf");
  };

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);
  const handleMouseMove = (e) => {
    if (dragging) {
      const rect = e.target.parentNode.getBoundingClientRect();
      setSignaturePosition({
        x: e.clientX - rect.left - 75,
        y: e.clientY - rect.top - 25,
      });
    }
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#f5f7fa", minHeight: "100vh", padding: "40px" }}>
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        background: "#ffffff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "40px", color: "#1f2a37", fontWeight: "700" }}>
          Digital Document Signing
        </h1>

        {/* Upload Document */}
        <section style={{ marginBottom: "30px" }}>
          <h3 style={{ color: "#1f2a37", marginBottom: "12px", fontWeight: "600" }}>Upload Document</h3>
          <DocumentUploader onFileChange={setFile} />
        </section>

        {/* Document Preview */}
        {file && (
          <section style={{ marginBottom: "30px" }}>
            <h3 style={{ color: "#1f2a37", marginBottom: "12px", fontWeight: "600" }}>Document Preview</h3>
            <div style={{ border: "1px solid #e0e0e0", borderRadius: "10px", padding: "15px", background: "#fafafa" }}>
              <DocumentPreview file={file} />
            </div>
          </section>
        )}

        {/* Draw Signature */}
        <section style={{ marginBottom: "30px" }}>
          <h3 style={{ color: "#1f2a37", marginBottom: "12px", fontWeight: "600" }}>Draw Signature</h3>
          <canvas
            ref={(canvas) => {
              canvasRef.current = canvas;
              initSignaturePad(canvas);
            }}
            style={{
              border: "2px dashed #d1d5db",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "400px",
              height: "150px",
              marginBottom: "12px",
              display: "block"
            }}
          />
          <button
            onClick={handleSaveSignature}
            style={{
              padding: "10px 18px",
              background: "#3b82f6",
              color: "#fff",
              fontWeight: "600",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#2563eb")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#3b82f6")}
          >
            Save Signature
          </button>
        </section>

        {/* Upload Signature */}
        <section style={{ marginBottom: "30px" }}>
          <h3 style={{ color: "#1f2a37", marginBottom: "12px", fontWeight: "600" }}>Upload Signature</h3>
          <SignatureUploader onSave={setSignature} />
        </section>

        {/* Signature Placement */}
        {signature && (
          <section style={{ marginBottom: "30px" }}>
            <h3 style={{ color: "#1f2a37", marginBottom: "12px", fontWeight: "600" }}>Signature Placement</h3>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "10px" }}>Drag the signature to position it on the document.</p>
            <div style={{
              position: "relative",
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              background: "#f9fafb",
              minHeight: "200px",
              padding: "15px"
            }}>
              <img
                src={signature}
                alt="signature"
                style={{
                  position: "absolute",
                  top: signaturePosition.y,
                  left: signaturePosition.x,
                  width: "150px",
                  cursor: "grab",
                  transition: "top 0.05s, left 0.05s"
                }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                onTouchMove={(e) => {
                  if (dragging) {
                    const touch = e.touches[0];
                    const rect = e.target.parentNode.getBoundingClientRect();
                    setSignaturePosition({
                      x: touch.clientX - rect.left - 75,
                      y: touch.clientY - rect.top - 25,
                    });
                  }
                }}
              />
            </div>
          </section>
        )}

        {/* Download Button */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleDownload}
            style={{
              padding: "14px 28px",
              background: "#10b981",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "700",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transition: "background 0.3s, transform 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#059669")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#10b981")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Download Signed Document
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
