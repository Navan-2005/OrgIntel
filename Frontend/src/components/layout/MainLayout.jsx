// src/components/layout/MainLayout.jsx
import React, { useState, useRef } from 'react';

function MainLayout({ fileExplorer, documentViewer, chatPanel }) {
  const [chatWidth, setChatWidth] = useState(384); // 96 * 4 = 384px
  const dragging = useRef(false);

  const handleDrag = (e) => {
    if (!dragging.current) return;
    setChatWidth(prev => {
      const newWidth = prev - e.movementX;
      return Math.max(240, Math.min(newWidth, 600)); // min/max width
    });
  };

  const handleMouseDown = () => {
    dragging.current = true;
    document.body.style.cursor = 'col-resize';
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseUp = () => {
    dragging.current = false;
    document.body.style.cursor = '';
    window.removeEventListener('mousemove', handleDrag);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Panel - File Explorer */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {fileExplorer}
      </div>

      {/* Middle Panel - Document Preview */}
      <div className="flex-1 bg-white flex flex-col relative">
        {documentViewer}
        {/* Slider */}
        <div
          className="absolute top-0 right-0 h-full w-2 bg-gray-200 cursor-col-resize z-10"
          onMouseDown={handleMouseDown}
          style={{ userSelect: 'none' }}
        />
      </div>

      {/* Right Panel - AI Chat (Copilot Style) */}
      <div
        className="bg-white border-l border-gray-200 flex flex-col"
        style={{ width: chatWidth, minWidth: 240, maxWidth: 600 }}
      >
        {chatPanel}
      </div>
    </div>
  );
}

export default MainLayout;