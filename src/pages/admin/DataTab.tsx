import React from 'react';
import { Download, Upload, FileText, Trash2 } from 'lucide-react';

export default function DataTab({
  handleExportData,
  handleImportData,
  handleImportBookmarks,
  handleClearAllData,
}: {
  handleExportData: () => void;
  handleImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImportBookmarks: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearAllData: () => Promise<void> | void;
}) {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="p-4 bg-black/60 border border-green-500/30 rounded-lg">
        <h3 className="text-green-500 font-semibold mb-4">数据导出</h3>
        <button
          onClick={handleExportData}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors"
          aria-label="导出数据为 JSON"
        >
          <Download className="w-5 h-5" />
          <span>导出 JSON</span>
        </button>
      </div>

      <div className="p-4 bg-black/60 border border-green-500/30 rounded-lg">
        <h3 className="text-green-500 font-semibold mb-4">数据导入</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <Upload className="w-5 h-5 text-green-500" />
            <span className="text-green-400">导入 JSON 数据</span>
            <input
              type="file"
              accept="application/json"
              onChange={handleImportData}
              className="hidden"
              aria-label="选择 JSON 文件导入"
            />
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <FileText className="w-5 h-5 text-green-500" />
            <span className="text-green-400">导入浏览器书签（HTML）</span>
            <input
              type="file"
              accept=".html,.htm"
              onChange={handleImportBookmarks}
              className="hidden"
              aria-label="选择 HTML 文件导入"
            />
          </label>
        </div>
      </div>

      <div className="p-4 bg-black/60 border border-green-500/30 rounded-lg">
        <h3 className="text-red-500 font-semibold mb-4">危险操作</h3>
        <button
          onClick={handleClearAllData}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/30 rounded-lg transition-colors"
          aria-label="清除所有数据"
        >
          <Trash2 className="w-5 h-5" />
          <span>清除所有数据</span>
        </button>
      </div>
    </div>
  )
}
