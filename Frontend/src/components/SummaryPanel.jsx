import React from 'react';
import { BookOpen, RefreshCw, Loader2 } from 'lucide-react';

function SummaryPanel({ summary, onGenerate, loading, hasFiles }) {
  return (
    <div className="h-full flex flex-col">
      {!hasFiles ? (
        <div className="text-center text-gray-500 py-10">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Upload PDFs to generate a summary</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <button
              onClick={onGenerate}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors w-full"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>{loading ? 'Generating...' : 'Generate Summary'}</span>
            </button>
          </div>
          
          <div className="flex-1 bg-white rounded-xl p-4 shadow-sm overflow-y-auto">
            {summary ? (
              <div className="prose prose-sm max-w-none">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                  Document Summary
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic text-center py-8">
                Click "Generate Summary" to create a summary of your documents.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SummaryPanel;