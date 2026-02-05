"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "@/lib/uploadthing";
import { Image as ImageIcon, Loader2, Upload } from "lucide-react";

interface SimpleImageDropzoneProps {
    onUploadComplete: (url: string) => void;
}

export default function SimpleImageDropzone({
    onUploadComplete,
}: SimpleImageDropzoneProps) {
    const [isUploading, setIsUploading] = useState(false);
    const dropzoneRef = useRef<HTMLDivElement>(null);

    const { startUpload } = useUploadThing("imageUploader", {
        onClientUploadComplete: (res) => {
            if (res?.[0]) {
                onUploadComplete(res[0].url);
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

    const handleFilesUpload = useCallback(
        async (files: File[]) => {
            if (files.length === 0) return;
            await startUpload(files);
        },
        [startUpload]
    );

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            await handleFilesUpload(acceptedFiles);
        },
        [handleFilesUpload]
    );

    // Handle clipboard paste events
    const handlePaste = useCallback(
        async (event: ClipboardEvent) => {
            const items = event.clipboardData?.items;
            if (!items) return;

            const imageFiles: File[] = [];
            
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                
                // Check if the item is an image
                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    if (file) {
                        imageFiles.push(file);
                        break; // Only take the first image
                    }
                }
            }

            if (imageFiles.length > 0) {
                event.preventDefault();
                await handleFilesUpload(imageFiles);
            }
        },
        [handleFilesUpload]
    );

    // Add event listeners for paste when component mounts
    useEffect(() => {
        const handleGlobalPaste = (event: ClipboardEvent) => {
            // Only handle paste if we're specifically in the image upload modal
            const activeElement = document.activeElement;
            const isInputFocused = activeElement && (
                activeElement.tagName === 'INPUT' || 
                activeElement.tagName === 'TEXTAREA' || 
                (activeElement as HTMLElement).contentEditable === 'true'
            );

            // Check if we're in the image modal specifically
            const imageModal = document.querySelector('[data-modal="image"]');
            const isInImageModal = imageModal && (
                dropzoneRef.current?.contains(activeElement) ||
                imageModal.contains(activeElement) ||
                !isInputFocused
            );

            // Only handle if we're in the image modal and not focused on an input
            if (isInImageModal && !isInputFocused) {
                handlePaste(event);
            }
        };

        // Add paste event listener to document
        document.addEventListener('paste', handleGlobalPaste);
        
        return () => {
            document.removeEventListener('paste', handleGlobalPaste);
        };
    }, [handlePaste]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
        },
        maxFiles: 1,
        disabled: isUploading,
    });

    return (
        <div
            {...getRootProps()}
            ref={dropzoneRef}
            data-modal="image"
            className={`relative min-h-[200px] flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all cursor-pointer
                ${isDragActive
                    ? "border-primary bg-primary/5 scale-[0.99]"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }
                ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
            `}
            tabIndex={0}
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
                            {isDragActive ? "Drop image to insert" : "Click, drag, or paste image here"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF up to 4MB
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
