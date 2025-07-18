// src/components/file-explorer/FileUploader.jsx
import React from 'react';
import { Upload, FileText } from 'lucide-react';

function FileUploader({ files, dragActive, handleDrag, handleDrop, handleFileChange, handleUpload, loading, formatFileSize }) {
  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">Documents</h3>
        <span className="text-xs text-gray-500">{files.length} files to upload</span>
      </div>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 ${
          dragActive 
          ? 'border-blue-400 bg-blue-50 animate-pulse ring-2 ring-blue-300' 
          : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="application/pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">Drop PDFs here or click to browse</p>
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-1">
          {Array.from(files).map((file, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs text-gray-600 bg-white p-2 rounded border">
              <FileText className="w-3 h-3 text-blue-600" />
              <span className="truncate flex-1">{file.name}</span>
              <span className="text-gray-400">{formatFileSize(file.size)}</span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading || files.length === 0}
        className="w-full mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
      >
        {loading ? 'Processing...' : 'Upload & Process'}
      </button>
    </div>
  );
}

export default FileUploader;