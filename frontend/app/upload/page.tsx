"use client"

import { useEffect, useState } from "react";
import { Trash2, Upload as UploadIcon, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

type FileData = [string, string, string]; // [id, path, filename]

export default function Upload() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/files/local", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }

      const data = await response.json();

      const fileArray: FileData[] = data.files.map(
        (file: { filename: string; path: string; size: number }) => [
          file.filename,
          file.path,
          file.filename,
        ]
      );

      setFiles(fileArray);

      setFiles(fileArray);
      setError(null);
    } catch (err) {
      setError("Failed to load files. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/files/local/${filename}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      setFiles(files.filter((file) => file[2] !== filename));
      setToast({ message: "File deleted successfully", type: "success" });
    } catch (err) {
      setToast({
        message: "Failed to delete file. Please try again.",
        type: "error",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setToast({
        message: "Please select a file to upload",
        type: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      setToast({ message: "File uploaded successfully", type: "success" });
      fetchFiles();
    } catch (err) {
      setToast({
        message: "Failed to upload file. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            File Manager
          </h1>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upload New File
            </h2>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="flex-grow text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                dark:file:bg-gray-700 dark:file:text-gray-200"
              />
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <UploadIcon className="inline-block mr-2 h-4 w-4" />
                Upload
              </button>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Uploaded Files
          </h2>
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Loading files...
              </p>
            </div>
          ) : error ? (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center">
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No files
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by uploading a file.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {files.map((file) => (
                <li
                  key={file[0]}
                  className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {file[2]}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {file[1]}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(file[2])}
                        className="ml-4 p-2 text-gray-400 hover:text-red-600 focus:outline-none"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      {toast && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded-md ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
