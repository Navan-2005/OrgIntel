// src/components/layout/MainLayout.jsx
import React from 'react';

function MainLayout({ fileExplorer, documentViewer, chatPanel }) {
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Panel - File Explorer */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {fileExplorer}
      </div>

      {/* Middle Panel - Document Preview */}
      <div className="flex-1 bg-white flex flex-col">
        {documentViewer}
      </div>

      {/* Right Panel - AI Chat (Copilot Style) */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {chatPanel}
      </div>
    </div>
  );
}

export default MainLayout;