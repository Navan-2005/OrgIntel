// src/components/document-viewer/DocumentPreview.jsx
import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';

function DocumentPreview({ selectedFile }) {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (selectedFile?.rawFile) {
      const url = URL.createObjectURL(selectedFile.rawFile);
      setPdfUrl(url);

      return () => {
        URL.revokeObjectURL(url); // Clean up blob URL
      };
    } else {
      setPdfUrl(null);
    }
  }, [selectedFile]);

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
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="PDF Viewer"
              className="w-full h-[80vh] rounded border"
            />
          ) : (
            <p className="text-sm text-gray-500">Unable to preview PDF.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentPreview;
