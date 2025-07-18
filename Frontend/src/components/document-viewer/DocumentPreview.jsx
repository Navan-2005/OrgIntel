// src/components/document-viewer/DocumentPreview.jsx
import React from 'react';
import { FileText } from 'lucide-react';

// You would likely import Document and Page from 'react-pdf' here
// import { Document, Page } from 'react-pdf';
// and potentially:
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';

function DocumentPreview({ selectedFile, previewContent }) {
  if (!selectedFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a document to preview</h3>
          <p className="text-sm text-gray-500">
            Choose a PDF from the sidebar to view its contents and start asking questions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          {/*
            In a real app, you would render the PDF here using react-pdf:
            <Document file={selectedFile.url || URL.createObjectURL(selectedFile.rawFile)}>
              <Page pageNumber={1} /> // Or dynamically render all pages
            </Document>
            You'd also need state for page number, zoom, etc.
          */}
          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
            {previewContent}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default DocumentPreview;