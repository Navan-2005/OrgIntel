// src/components/file-explorer/FileList.jsx
import React from 'react';
import { FileText } from 'lucide-react';
import FileListItem from './FileListItem';

function FileList({ uploadedFiles, selectedFile, handleFileSelect, removeFile, formatFileSize }) {
  return (
    <div className="flex-1 overflow-y-auto">
      {uploadedFiles.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No documents uploaded yet</p>
          <p className="text-xs text-gray-400 mt-1">Upload PDFs to start analyzing</p>
        </div>
      ) : (
        <div className="p-2">
          {uploadedFiles.map((file) => (
            <FileListItem
              key={file.id}
              file={file}
              isSelected={selectedFile && selectedFile.id === file.id}
              onSelect={handleFileSelect}
              onRemove={removeFile}
              formatFileSize={formatFileSize}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FileList;