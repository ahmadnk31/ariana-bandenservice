"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

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
    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;

            setUploading(true);
            onError("");

            try {
                const newImages: UploadedImage[] = [];

                for (const file of acceptedFiles) {
                    const formData = new FormData();
                    formData.append("file", file);

                    const res = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                    });

                    if (!res.ok) {
                        throw new Error("Failed to upload image");
                    }

                    const data = await res.json();
                    newImages.push({ url: data.url, key: data.key });
                }

                onImagesChange([...images, ...newImages]);
            } catch {
                onError("Failed to upload image");
            } finally {
                setUploading(false);
            }
        },
        [images, onImagesChange, setUploading, onError]
    );

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
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:bg-muted/50"
                    } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
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
                                <span className="font-medium text-primary">Click to upload</span> or drag and drop
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
