"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ImageDropzone from "@/app/components/ImageDropzone";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UploadedImage {
    url: string;
    key: string;
}

interface TireData {
    id: string;
    name: string;
    brand: string;
    season: string;
    condition?: string;
    size: string;
    width: number | null;
    aspectRatio: number | null;
    rimSize: number | null;
    loadIndex: string | null;
    speedRating: string | null;
    dot: string | null;
    price: number;
    description: string | null;
    stock: number;
    inStock: boolean;
    features: string[];
    images: UploadedImage[];
}

export default function EditTirePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        season: "summer",
        condition: "new",
        size: "",
        width: "",
        aspectRatio: "",
        rimSize: "",
        loadIndex: "",
        speedRating: "",
        dot: "",
        price: "",
        description: "",
        stock: "0",
        inStock: true,
        features: [""],
    });

    useEffect(() => {
        const fetchTire = async () => {
            try {
                const res = await fetch(`/api/tires/${id}`);
                if (!res.ok) throw new Error("Failed to fetch tire");
                const data: TireData = await res.json();

                setFormData({
                    name: data.name,
                    brand: data.brand,
                    season: data.season,
                    condition: data.condition || "new",
                    size: data.size,
                    width: data.width?.toString() || "",
                    aspectRatio: data.aspectRatio?.toString() || "",
                    rimSize: data.rimSize?.toString() || "",
                    loadIndex: data.loadIndex || "",
                    speedRating: data.speedRating || "",
                    dot: data.dot || "",
                    price: data.price.toString(),
                    description: data.description || "",
                    stock: data.stock.toString(),
                    inStock: data.inStock,
                    features: data.features.length > 0 ? data.features : [""],
                });
                setImages(data.images);
            } catch {
                setError("Failed to load tire");
            } finally {
                setFetching(false);
            }
        };

        fetchTire();
    }, [id]);

    const addFeature = () => {
        setFormData((prev) => ({
            ...prev,
            features: [...prev.features, ""],
        }));
    };

    const removeFeature = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index),
        }));
    };

    const updateFeature = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.map((f, i) => (i === index ? value : f)),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/tires/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    width: formData.width ? parseInt(formData.width) : null,
                    aspectRatio: formData.aspectRatio ? parseInt(formData.aspectRatio) : null,
                    rimSize: formData.rimSize ? parseInt(formData.rimSize) : null,
                    stock: parseInt(formData.stock) || 0,
                    features: formData.features.filter((f) => f.trim() !== ""),
                    images,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update tire");
            }

            router.push("/admin/tires");
            router.refresh();
        } catch {
            setError("Failed to update tire");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {

        setDeleting(true);
        setError("");

        try {
            const res = await fetch(`/api/tires/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete tire");
            }

            router.push("/admin/tires");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to delete tire");
        } finally {
            setDeleting(false);
        }
    };

    if (fetching) {
        return (
            <div className="p-8 flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/tires"
                        className="p-2 rounded-md hover:bg-muted transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </Link>
                    <h1 className="text-3xl font-bold">Edit Tire</h1>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button
                            disabled={deleting}
                            className="inline-flex h-10 items-center justify-center rounded-md bg-red-500 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-red-600 disabled:opacity-50"
                        >
                            {deleting ? "Deleting..." : "Delete Tire"}
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the tire and remove its data from our servers.
                                If this tire is part of any existing orders, those orders will retain their historical data but will show "Deleted Product".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div className="bg-background rounded-lg border border-muted p-6 space-y-4">
                    <h2 className="font-bold text-lg mb-4">Basic Information</h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-2">
                                Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                placeholder="Pilot Sport 5"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="brand" className="block text-sm font-medium mb-2">
                                Brand *
                            </label>
                            <input
                                type="text"
                                id="brand"
                                value={formData.brand}
                                onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                placeholder="Michelin"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="condition" className="block text-sm font-medium mb-2">
                                Condition *
                            </label>
                            <select
                                id="condition"
                                value={formData.condition}
                                onChange={(e) => setFormData((prev) => ({ ...prev, condition: e.target.value }))}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                            >
                                <option value="new">New</option>
                                <option value="used">Used</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="season" className="block text-sm font-medium mb-2">
                                Season *
                            </label>
                            <select
                                id="season"
                                value={formData.season}
                                onChange={(e) => setFormData((prev) => ({ ...prev, season: e.target.value }))}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                            >
                                <option value="summer">Summer</option>
                                <option value="winter">Winter</option>
                                <option value="all-season">All-Season</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="size" className="block text-sm font-medium mb-2">
                                Size *
                            </label>
                            <input
                                type="text"
                                id="size"
                                value={formData.size}
                                onChange={(e) => setFormData((prev) => ({ ...prev, size: e.target.value }))}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                placeholder="225/45 R17"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium mb-2">
                                Price (€) *
                            </label>
                            <input
                                type="number"
                                id="price"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                placeholder="149.99"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Size Components */}
                <div className="bg-background rounded-lg border border-muted p-6 space-y-4">
                    <h2 className="font-bold text-lg mb-4">Size Details (Optional)</h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="width" className="block text-sm font-medium mb-2">
                                Width (mm)
                            </label>
                            <input
                                type="number"
                                id="width"
                                value={formData.width}
                                onChange={(e) => setFormData((prev) => ({ ...prev, width: e.target.value }))}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                placeholder="225"
                            />
                        </div>
                        <div>
                            <label htmlFor="aspectRatio" className="block text-sm font-medium mb-2">
                                Aspect Ratio (%)
                            </label>
                            <input
                                type="number"
                                id="aspectRatio"
                                value={formData.aspectRatio}
                                onChange={(e) => setFormData((prev) => ({ ...prev, aspectRatio: e.target.value }))}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                placeholder="45"
                            />
                        </div>
                        <div>
                            <label htmlFor="rimSize" className="block text-sm font-medium mb-2">
                                Rim Size (inches)
                            </label>
                            <input
                                type="number"
                                id="rimSize"
                                value={formData.rimSize}
                                onChange={(e) => setFormData((prev) => ({ ...prev, rimSize: e.target.value }))}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                placeholder="17"
                            />
                        </div>
                    </div>
                </div>

                {/* Specifications */}
                <div className="bg-background rounded-lg border border-muted p-6 space-y-4">
                    <h2 className="font-bold text-lg mb-4">Specifications (Optional)</h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="loadIndex" className="block text-sm font-medium mb-2">
                                Load Index
                            </label>
                            <input
                                type="text"
                                id="loadIndex"
                                value={formData.loadIndex}
                                onChange={(e) => setFormData((prev) => ({ ...prev, loadIndex: e.target.value }))}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                placeholder="91"
                            />
                        </div>
                        <div>
                            <label htmlFor="speedRating" className="block text-sm font-medium mb-2">
                                Speed Rating
                            </label>
                            <input
                                type="text"
                                id="speedRating"
                                value={formData.speedRating}
                                onChange={(e) => setFormData((prev) => ({ ...prev, speedRating: e.target.value }))}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                placeholder="W"
                            />
                        </div>
                        <div>
                            <label htmlFor="dot" className="block text-sm font-medium mb-2">
                                DOT Code
                            </label>
                            <input
                                type="text"
                                id="dot"
                                value={formData.dot}
                                onChange={(e) => setFormData((prev) => ({ ...prev, dot: e.target.value }))}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                placeholder="2324"
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-background rounded-lg border border-muted p-6 space-y-4">
                    <h2 className="font-bold text-lg mb-4">Description (Optional)</h2>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors min-h-[100px]"
                        placeholder="Enter a detailed description of the tire..."
                    />
                </div>

                {/* Inventory */}
                <div className="bg-background rounded-lg border border-muted p-6 space-y-4">
                    <h2 className="font-bold text-lg mb-4">Inventory</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium mb-2">
                                Stock Quantity
                            </label>
                            <input
                                type="number"
                                id="stock"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                placeholder="0"
                            />
                        </div>
                        <div className="flex items-center gap-3 pt-8">
                            <input
                                type="checkbox"
                                id="inStock"
                                checked={formData.inStock}
                                onChange={(e) => setFormData((prev) => ({ ...prev, inStock: e.target.checked }))}
                                className="w-5 h-5 rounded border-muted"
                            />
                            <label htmlFor="inStock" className="text-sm font-medium">
                                Available for purchase
                            </label>
                        </div>
                    </div>
                </div>

                <div className="bg-background rounded-lg border border-muted p-6">
                    <h2 className="font-bold text-lg mb-4">Features</h2>
                    <div className="space-y-3">
                        {formData.features.map((feature, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) => updateFeature(index, e.target.value)}
                                    className="flex-1 px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                    placeholder="e.g., High performance"
                                />
                                {formData.features.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(index)}
                                        className="p-3 rounded-md text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addFeature}
                            className="text-sm text-primary hover:underline"
                        >
                            + Add feature
                        </button>
                    </div>
                </div>

                <div className="bg-background rounded-lg border border-muted p-6">
                    <h2 className="font-bold text-lg mb-4">Images</h2>
                    <ImageDropzone
                        images={images}
                        onImagesChange={setImages}
                        uploading={uploading}
                        setUploading={setUploading}
                        onError={setError}
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="h-12 px-8 rounded-md bg-primary text-primary-foreground font-medium shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <Link
                        href="/admin/tires"
                        className="h-12 px-8 rounded-md border border-muted bg-background font-medium shadow-sm transition-colors hover:bg-muted flex items-center"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
