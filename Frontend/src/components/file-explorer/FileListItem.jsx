// src/components/file-explorer/FileListItem.jsx
import React from 'react';
import { FileText, Eye, X } from 'lucide-react';

function FileListItem({ file, isSelected, onSelect, onRemove, formatFileSize }) {
  return (
    <div
      className={`p-3 mb-2 rounded-lg border cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-sm'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
      onClick={() => onSelect(file)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{file.pages} pages</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {file.uploadTime.toLocaleDateString()}
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent parent div's onClick
              onSelect(file); // Ensure file is selected on preview click
            }}
            className="text-gray-400 hover:text-blue-600 transition-colors"
            title="Preview document"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent parent div's onClick
              onRemove(file.id);
            }}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Remove document"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileListItem;