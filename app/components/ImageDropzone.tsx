"use client";

import { useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "@/lib/uploadthing";

interface UploadedImage {
    url: string;
    key: string;
}

interface ImageDropzoneProps {
    images: UploadedImage[];
    onImagesChange: (images: UploadedImage[]) => void;
    uploading: boolean;
    setUploading: (uploading: boolean) => void;
    onError: (error: string) => void;
}

export default function ImageDropzone({
    images,
    onImagesChange,
    uploading,
    setUploading,
    onError,
}: ImageDropzoneProps) {
    const dropzoneRef = useRef<HTMLDivElement>(null);
    
    const { startUpload } = useUploadThing("imageUploader", {
        onClientUploadComplete: (res) => {
            const newImages = res.map((file) => ({
                url: file.url,
                key: file.key,
            }));
            onImagesChange([...images, ...newImages]);
            setUploading(false);
        },
        onUploadError: (error: Error) => {
            onError(`Upload failed: ${error.message}`);
            setUploading(false);
        },
        onUploadBegin: () => {
            setUploading(true);
            onError("");
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
            // Only handle paste if the dropzone is focused or if no input element is focused
            const activeElement = document.activeElement;
            const isInputFocused = activeElement && (
                activeElement.tagName === 'INPUT' || 
                activeElement.tagName === 'TEXTAREA' || 
                (activeElement as HTMLElement).contentEditable === 'true'
            );

            if (!isInputFocused || dropzoneRef.current?.contains(activeElement)) {
                handlePaste(event);
            }
        };

        // Add paste event listener to document
        document.addEventListener('paste', handleGlobalPaste);
        
        return () => {
            document.removeEventListener('paste', handleGlobalPaste);
        };
    }, [handlePaste]);

    const removeImage = (index: number) => {
        onImagesChange(images.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
        },
        disabled: uploading,
    });

    return (
        <div className="space-y-4">
            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden border border-muted"
                        >
                            <img
                                src={image.url}
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div
                {...getRootProps()}
                ref={dropzoneRef}
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:bg-muted/50"
                    } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                tabIndex={0} // Make dropzone focusable for paste events
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center">
                    {uploading ? (
                        <div className="flex items-center gap-2">
                            <svg
                                className="animate-spin h-5 w-5 text-primary"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                        </div>
                    ) : isDragActive ? (
                        <p className="text-sm text-primary font-medium">Drop the images here...</p>
                    ) : (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-muted-foreground mb-2"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-primary">Click to upload</span>, drag and drop, or <span className="font-medium text-primary">paste</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG, GIF, WEBP
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
