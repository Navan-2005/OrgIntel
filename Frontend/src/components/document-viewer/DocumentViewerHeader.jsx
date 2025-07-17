// src/components/document-viewer/DocumentViewerHeader.jsx
import React from 'react';
import { FileText, Download, Search } from 'lucide-react';

function DocumentViewerHeader({ selectedFile, formatFileSize }) {
  if (!selectedFile) return null; // Only render if a file is selected

  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="font-medium text-gray-900">{selectedFile.name}</h2>
            <p className="text-sm text-gray-500">
              {formatFileSize(selectedFile.size)} • {selectedFile.pages} pages
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-gray-500 hover:text-gray-700 p-1 rounded" title="Download">
            <Download className="w-4 h-4" />
          </button>
          <button className="text-gray-500 hover:text-gray-700 p-1 rounded" title="Search in document">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocumentViewerHeader;