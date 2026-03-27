"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

interface ExpandableDescriptionProps {
    description: string;
    maxLines?: number;
}

export default function ExpandableDescription({ description, maxLines = 3 }: ExpandableDescriptionProps) {
    const t = useTranslations("Tires");
    const [isExpanded, setIsExpanded] = useState(false);
    const [needsTruncation, setNeedsTruncation] = useState(false);
    const contentRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const el = contentRef.current;
        if (el) {
            // Check if content overflows the clamped height
            const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
            const maxHeight = lineHeight * maxLines;
            setNeedsTruncation(el.scrollHeight > maxHeight + 2);
        }
    }, [description, maxLines]);

    return (
        <div>
            <p
                ref={contentRef}
                className="expandable-description-text"
                style={{
                    display: "-webkit-box",
                    WebkitLineClamp: isExpanded ? "unset" : maxLines,
                    WebkitBoxOrient: "vertical",
                    overflow: isExpanded ? "visible" : "hidden",
                }}
            >
                {description}
            </p>
            {needsTruncation && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                    {isExpanded ? t("seeLess") : t("seeMore")}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                        }}
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
            )}
        </div>
    );
}
