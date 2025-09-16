import React, { useMemo } from 'react';
import { ExcelIcon } from './icons/ExcelIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import Loader from './Loader';

interface FileProcessorProps {
  file: File;
  isProcessing: boolean;
  processedFileBlob: Blob | null;
  onProcess: () => void;
  onReset: () => void;
}

const FileProcessor: React.FC<FileProcessorProps> = ({
  file,
  isProcessing,
  processedFileBlob,
  onProcess,
  onReset,
}) => {
  const processedFileUrl = useMemo(() => {
    if (processedFileBlob) {
      return URL.createObjectURL(processedFileBlob);
    }
    return null;
  }, [processedFileBlob]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getProcessedFileName = (): string => {
    const nameParts = file.name.split('.');
    const extension = nameParts.pop();
    return `${nameParts.join('.')}_converted.${extension}`;
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center p-6 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
        <ExcelIcon className="h-10 w-10 text-brand-primary dark:text-brand-secondary" />
        <div className="ml-4 text-left">
          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs sm:max-w-md">{file.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{formatFileSize(file.size)}</p>
        </div>
      </div>

      <div className="mt-8">
        {isProcessing ? (
          <div className="flex flex-col items-center">
            <Loader />
            <p className="mt-2 text-slate-600 dark:text-slate-400">Converting dates, please wait...</p>
          </div>
        ) : processedFileUrl ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={processedFileUrl}
              download={getProcessedFileName()}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-slate-800 transition-colors"
            >
              <DownloadIcon className="h-5 w-5 mr-2" />
              Download Converted File
            </a>
            <button
              onClick={onReset}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-base font-medium rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-800 transition-colors"
            >
              Convert Another File
            </button>
          </div>
        ) : (
          <button
            onClick={onProcess}
            disabled={isProcessing}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-slate-800 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            Convert Dates
          </button>
        )}
      </div>
    </div>
  );
};

export default FileProcessor;