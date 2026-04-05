"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageDropzone from "@/app/components/ImageDropzone";
import SeasonIcon from "@/app/components/SeasonIcon";
import TiptapEditor from "@/app/components/blog/TiptapEditor";
import { parseTireSize } from "@/lib/utils";

interface UploadedImage {
    url: string;
    key: string;
}

export default function NewTirePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        barcode: "",
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
        efficiency: "",
        grip: "",
        noise: "",
        noiseDb: "",
    });

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
            const res = await fetch("/api/tires", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    stock: parseInt(formData.stock) || 0,
                    price: parseFloat(formData.price),
                    barcode: formData.barcode || null,
                    width: formData.width ? parseInt(formData.width) : null,
                    aspectRatio: formData.aspectRatio ? parseInt(formData.aspectRatio) : null,
                    rimSize: formData.rimSize ? parseInt(formData.rimSize) : null,
                    efficiency: formData.efficiency || null,
                    grip: formData.grip || null,
                    noise: formData.noise || null,
                    noiseDb: formData.noiseDb ? parseInt(formData.noiseDb) : null,
                    features: formData.features.filter((f) => f.trim() !== ""),
                    images,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create tire");
            }

            router.push("/admin/tires");
            router.refresh();
        } catch {
            setError("Failed to create tire");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/tires"
                    className="p-2 rounded-md hover:bg-muted transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </Link>
                <h1 className="text-3xl font-bold">Add New Tire</h1>
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
                            <label htmlFor="barcode" className="block text-sm font-medium mb-2">
                                Barcode (EAN/UPC)
                            </label>
                            <input
                                type="text"
                                id="barcode"
                                value={formData.barcode}
                                onChange={(e) => setFormData((prev) => ({ ...prev, barcode: e.target.value }))}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                placeholder="12345678"
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
                        <div className="col-span-full">
                            <label className="block text-sm font-medium mb-3">
                                Season *
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'summer', label: 'Summer' },
                                    { id: 'winter', label: 'Winter' },
                                    { id: 'all-season', label: 'All-Season' }
                                ].map((s) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, season: s.id }))}
                                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                                            formData.season === s.id
                                                ? s.id === 'summer' ? 'bg-amber-500/10 border-amber-500 text-amber-600 shadow-sm' :
                                                  s.id === 'winter' ? 'bg-blue-500/10 border-blue-500 text-blue-600 shadow-sm' :
                                                  'bg-green-500/10 border-green-500 text-green-600 shadow-sm'
                                                : 'bg-background border-muted hover:border-muted-foreground/30 text-muted-foreground'
                                        }`}
                                    >
                                        <SeasonIcon season={s.id} size="lg" />
                                        <span className="text-xs font-bold uppercase tracking-wider">{s.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="size" className="block text-sm font-medium mb-2">
                                Size *
                            </label>
                            <input
                                type="text"
                                id="size"
                                value={formData.size}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData((prev) => {
                                        const newFormData = { ...prev, size: value };
                                        
                                        // Auto-fill size details if they can be parsed
                                        const parsed = parseTireSize(value);
                                        if (parsed) {
                                            if (parsed.width) newFormData.width = parsed.width.toString();
                                            if (parsed.aspectRatio) newFormData.aspectRatio = parsed.aspectRatio.toString();
                                            if (parsed.rimSize) newFormData.rimSize = parsed.rimSize.toString();
                                        }
                                        
                                        return newFormData;
                                    });
                                }}
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

                {/* EU Labeling */}
                <div className="bg-background rounded-lg border border-muted p-6 space-y-4">
                    <h2 className="font-bold text-lg mb-4">EU Tire Label (Optional)</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="efficiency" className="block text-sm font-medium mb-2">
                                Fuel Efficiency
                            </label>
                            <select
                                id="efficiency"
                                value={formData.efficiency}
                                onChange={(e) => setFormData((prev) => ({ ...prev, efficiency: e.target.value }))}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                            >
                                <option value="">Select Grade</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="grip" className="block text-sm font-medium mb-2">
                                Wet Grip
                            </label>
                            <select
                                id="grip"
                                value={formData.grip}
                                onChange={(e) => setFormData((prev) => ({ ...prev, grip: e.target.value }))}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                            >
                                <option value="">Select Grade</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="noise" className="block text-sm font-medium mb-2">
                                Noise Level
                            </label>
                            <select
                                id="noise"
                                value={formData.noise}
                                onChange={(e) => setFormData((prev) => ({ ...prev, noise: e.target.value }))}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                            >
                                <option value="">Select Level</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="noiseDb" className="block text-sm font-medium mb-2">
                                Noise (dB)
                            </label>
                            <input
                                type="number"
                                id="noiseDb"
                                value={formData.noiseDb}
                                onChange={(e) => setFormData((prev) => ({ ...prev, noiseDb: e.target.value }))}
                                className="w-full px-4 py-3 rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                placeholder="e.g. 71"
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-background rounded-lg border border-muted p-6 space-y-4">
                    <h2 className="font-bold text-lg mb-4">Description (Optional)</h2>
                    <TiptapEditor
                        content={formData.description}
                        onChange={(content) => setFormData((prev) => ({ ...prev, description: content }))}
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
                        {loading ? "Creating..." : "Create Tire"}
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
