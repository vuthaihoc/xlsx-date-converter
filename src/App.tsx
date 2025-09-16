import React, { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import FileProcessor from './components/FileProcessor';
import { convertDatesInXlsx } from './services/dateConverter';

const App: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [processedFileBlob, setProcessedFileBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = useCallback((selectedFile: File) => {
        if (selectedFile) {
            const validTypes = [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ];
            const validExtensions = ['.xlsx', '.xls'];
            const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

            if (validTypes.includes(selectedFile.type) || validExtensions.includes(fileExtension)) {
                setFile(selectedFile);
                setError(null);
                setProcessedFileBlob(null);
            } else {
                setError('Invalid file type. Please upload an XLSX or XLS file.');
            }
        }
    }, []);

    const handleProcessFile = useCallback(async () => {
        if (!file) return;
        setIsProcessing(true);
        setError(null);
        try {
            const blob = await convertDatesInXlsx(file);
            setProcessedFileBlob(blob);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    }, [file]);

    const handleReset = useCallback(() => {
        setFile(null);
        setProcessedFileBlob(null);
        setError(null);
        setIsProcessing(false);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
            <div className="w-full max-w-2xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-brand-primary dark:text-brand-secondary">XLSX Date Converter</h1>
                    <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Convert date formats in your spreadsheets effortlessly.</p>
                </header>
                
                <main className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl transition-all duration-300">
                    <div className="p-6 sm:p-10">
                        {!file ? (
                            <FileUpload onFileSelect={handleFileSelect} />
                        ) : (
                            <FileProcessor
                                file={file}
                                isProcessing={isProcessing}
                                processedFileBlob={processedFileBlob}
                                onProcess={handleProcessFile}
                                onReset={handleReset}
                            />
                        )}

                        {error && (
                            <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-md">
                                <p className="font-semibold">Error</p>
                                <p>{error}</p>
                            </div>
                        )}
                    </div>
                </main>

                <footer className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
                    <p>&copy; {new Date().getFullYear()} XLSX Date Converter. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;