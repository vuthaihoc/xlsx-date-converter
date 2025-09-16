import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFile(e.dataTransfer.files);
  }, [handleFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files);
  };

  const onBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors duration-300 ${
        isDragging ? 'border-brand-secondary bg-green-50 dark:bg-green-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-brand-primary dark:hover:border-brand-secondary'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="text-center">
        <UploadIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
        <p className="mt-4 text-lg font-medium text-slate-700 dark:text-slate-300">
          Drag and drop your XLSX file here
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">or</p>
        <button
          type="button"
          onClick={onBrowseClick}
          className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-slate-800 transition-colors"
        >
          Browse File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".xlsx, .xls, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
          Supported formats: .xlsx, .xls
        </p>
      </div>
    </div>
  );
};

export default FileUpload;