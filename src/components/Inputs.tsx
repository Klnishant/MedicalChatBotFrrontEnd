"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

export default function DragDropInput() {
  const [file, setFile] = useState<File | null>(null);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  return (
    <div className="flex items-center justify-center w-full bg-gray-900 text-white">
      <motion.div
        {...getRootProps()}
        className={`w-40 h-22 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          isDragActive ? "border-blue-500 bg-gray-800" : "border-gray-600"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0.8 }}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
        {file ? (
          <p className="text-blue-400 text-sm">{file.name}</p>
        ) : (
          <p className="text-gray-400 text-sm">Click or drag & drop a file</p>
        )}
      </motion.div>
    </div>
  );
} 