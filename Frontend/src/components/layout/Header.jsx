import React from 'react';
import { FileText } from 'lucide-react';

function Header({ uploadedFilesCount, sessionId }) {
  return (
    <div className="bg-white border-b border-gray-200 flex-shrink-0 shadow-sm">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">PDF Document Analyzer</h1>
              <p className="text-sm text-gray-500">Upload and analyze PDF documents with AI assistance</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {uploadedFilesCount} documents
            </div>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Session: {sessionId.slice(-6)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;