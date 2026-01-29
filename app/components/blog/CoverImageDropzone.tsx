"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "@/lib/uploadthing";
import { Image as ImageIcon, Loader2, X, Upload } from "lucide-react";

interface CoverImageDropzoneProps {
    value: string;
    onChange: (url: string, key: string) => void;
    onRemove: () => void;
}

export default function CoverImageDropzone({
    value,
    onChange,
    onRemove,
}: CoverImageDropzoneProps) {
    const [isUploading, setIsUploading] = useState(false);

    const { startUpload } = useUploadThing("imageUploader", {
        onClientUploadComplete: (res) => {
            if (res?.[0]) {
                onChange(res[0].url, res[0].key);
            }
            setIsUploading(false);
        },
        onUploadError: (error: Error) => {
            alert(`Upload failed: ${error.message}`);
            setIsUploading(false);
        },
        onUploadBegin: () => {
            setIsUploading(true);
        },
    });

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;
            await startUpload(acceptedFiles);
        },
        [startUpload]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
        },
        maxFiles: 1,
        disabled: isUploading,
    });

    if (value) {
        return (
            <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group">
                <img src={value} alt="Cover" className="w-full h-full object-cover" />
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    aria-label="Remove image"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={`relative aspect-video flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all cursor-pointer
                ${isDragActive
                    ? "border-primary bg-primary/5 scale-[0.99]"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }
                ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
            `}
        >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center justify-center p-4 text-center">
                {isUploading ? (
                    <>
                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Uploading...</p>
                    </>
                ) : (
                    <>
                        <div className={`p-3 rounded-full mb-3 transition-colors ${isDragActive ? 'bg-primary/20 text-primary' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                            {isDragActive ? <Upload className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                        </div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {isDragActive ? "Drop to upload" : "Click or drag cover image"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Recommended: 1600x900px
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
