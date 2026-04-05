"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import TireCard from "@/app/components/TireCard";

interface ProductTabsProps {
    description: string | null;
    features: string[];
    relatedTires: any[];
}

export default function ProductTabs({ description, features, relatedTires }: ProductTabsProps) {
    const t = useTranslations("Tires");
    const [activeTab, setActiveTab] = useState<"description" | "related">("description");

    return (
        <div className="bg-background border-t border-muted pt-8 pb-16">
            <div className="container mx-auto px-4">
                {/* Tabs Header */}
                <div className="flex items-center gap-6 border-b border-muted mb-8">
                    <button
                        onClick={() => setActiveTab("description")}
                        className={`pb-4 text-lg font-bold transition-all relative ${activeTab === "description"
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {t('description') || 'Description'}
                        {activeTab === "description" && (
                            <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                    </button>
                    {relatedTires.length > 0 && (
                        <button
                            onClick={() => setActiveTab("related")}
                            className={`pb-4 text-lg font-bold transition-all relative ${activeTab === "related"
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {t('relatedProducts')}
                            {activeTab === "related" && (
                                <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                            )}
                        </button>
                    )}
                </div>

                {/* Tab Content */}
                <div className="min-h-[300px]">
                    {/* Description Tab */}
                    {activeTab === "description" && (
                        <div className="grid md:grid-cols-3 gap-12">
                            {/* Main Description */}
                            <div className="md:col-span-2">
                                <div className="prose prose-lg dark:prose-invert max-w-none
                                    prose-headings:font-bold prose-headings:text-foreground
                                    prose-p:text-muted-foreground prose-p:leading-relaxed
                                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                    prose-img:rounded-lg prose-img:shadow-md prose-img:my-4
                                    prose-ul:list-disc prose-ul:pl-6
                                    prose-ol:list-decimal prose-ol:pl-6
                                    prose-li:text-muted-foreground">
                                    {description ? (
                                        <div dangerouslySetInnerHTML={{ __html: description }} />
                                    ) : (
                                        <p>{t('noDescription')}</p>
                                    )}
                                </div>
                            </div>

                            {/* Features Sidebar */}
                            {features.length > 0 && (
                                <div className="bg-muted/50 p-6 rounded-xl border border-muted h-fit">
                                    <h3 className="font-bold text-foreground mb-4 text-lg">{t('keyFeatures')}</h3>
                                    <ul className="space-y-3">
                                        {features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                <span className="leading-tight">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Related Products Tab */}
                    {activeTab === "related" && relatedTires.length > 0 && (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-300">
                            {relatedTires.map((relatedTire) => (
                                <TireCard
                                    key={relatedTire.id}
                                    {...relatedTire}
                                    features={JSON.parse(relatedTire.features)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
