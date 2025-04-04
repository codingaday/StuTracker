import { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  FiDownload,
  FiX,
  FiFile,
  FiImage,
  FiUploadCloud,
} from "react-icons/fi";

const FileViewer = ({ file, onClose, onFileChange }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "text/plain": [".txt"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0]);
      }
    },
  });

  const handleDownload = () => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name || "document";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderFilePreview = () => {
    if (!file) return null;

    const fileType = file.type.split("/")[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (fileType === "image") {
      return (
        <div className="flex flex-col items-center">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="max-h-96 max-w-full rounded-lg object-contain shadow-md"
          />
          <p className="mt-4 text-sm text-gray-600">{file.name}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center p-6">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          {fileType === "application" && fileExtension === "pdf" ? (
            <FiFile className="text-blue-500 text-3xl" />
          ) : (
            <FiFile className="text-gray-500 text-3xl" />
          )}
        </div>
        <h4 className="font-medium text-gray-900">{file.name}</h4>
        <p className="text-sm text-gray-500 mt-1">
          {Math.round(file.size / 1024)} KB • {fileExtension.toUpperCase()}
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {file ? file.name : "File Preview"}
          </h3>
          <div className="flex gap-2">
            {file && (
              <button
                onClick={handleDownload}
                className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-full"
                title="Download"
              >
                <FiDownload size={20} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-full"
              title="Close"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {file ? (
            renderFilePreview()
          ) : (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-blue-300"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-4">
                <FiUploadCloud className="text-gray-400 text-4xl" />
                <h4 className="text-lg font-medium text-gray-700">
                  {isDragActive ? "Drop file here" : "Drag & drop files here"}
                </h4>
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, Images, Text, Word
                </p>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Select File
                </button>
              </div>
            </div>
          )}
        </div>

        {file && (
          <div className="p-4 border-t bg-gray-50">
            <button
              {...getRootProps()}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              <input {...getInputProps()} />
              Replace File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileViewer;
