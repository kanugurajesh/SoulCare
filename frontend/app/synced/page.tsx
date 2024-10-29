"use client";

import { useEffect, useState } from "react";
import { Trash2, Upload as UploadIcon, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";

type FileData = [string, string, string]; // [id, path, filename]

const Upload = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/files", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }

        const data = await response.json();
        setFiles(data);
        setError(null);
      } catch (err) {
        setError("Failed to load files. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteFile = async (id: string) => {
    toast.loading("Deleting file...");
    try {
      const response = await fetch(`http://localhost:8000/files/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.dismiss();
      if (response.ok) {
        toast.success("File deleted successfully");
        setFiles(files.filter((file) => file[0] !== id));
      } else {
        toast.error("Failed to delete file");
        throw new Error("Failed to delete file");
      }
    } catch (err) {
      toast.error("Failed to delete file");
      setError("Failed to delete file. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Toaster />
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Uploaded Files
          </h1>
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
                      <button
                        onClick={() => {}} // This button doesn't have any action, it's just for visual purposes
                        className="text-sm font-medium text-gray-900 dark:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {file[2]}
                      </button>
                      <button
                        onClick={() => deleteFile(file[0])}
                        className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {file[1]}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default Upload;
