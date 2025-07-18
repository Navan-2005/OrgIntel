// PDFViewer.js - Simplest solution that works everywhere
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Use Mozilla's official CDN (most reliable)
pdfjs.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

const PDFViewer = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setError(null);
      setPdfFile(file);
      setPageNumber(1);
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF. Please try a different file.');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Simple PDF Viewer</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileChange}
          style={{ marginRight: '10px' }}
        />
        {pdfFile && (
          <button onClick={() => {
            setPdfFile(null);
            setNumPages(null);
            setPageNumber(1);
            setError(null);
          }}>
            Clear
          </button>
        )}
      </div>

      {error && (
        <div style={{ 
          padding: '20px', 
          color: '#d32f2f', 
          backgroundColor: '#ffebee',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {pdfFile && !error && (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))} 
              disabled={pageNumber <= 1}
              style={{ marginRight: '10px' }}
            >
              Previous
            </button>
            
            <span style={{ margin: '0 10px', fontWeight: 'bold' }}>
              Page {pageNumber} of {numPages || '?'}
            </span>
            
            <button 
              onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))} 
              disabled={pageNumber >= numPages}
              style={{ marginLeft: '10px' }}
            >
              Next
            </button>
          </div>

          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '4px', 
            overflow: 'hidden',
            backgroundColor: '#f8f9fa'
          }}>
            <Document 
              file={pdfFile} 
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div style={{ padding: '40px' }}>Loading PDF...</div>}
              error={<div style={{ padding: '40px', color: '#d32f2f' }}>Error loading PDF</div>}
            >
              <Page 
                pageNumber={pageNumber} 
                width={Math.min(600, window.innerWidth - 40)}
                loading={<div style={{ padding: '40px' }}>Loading page...</div>}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;