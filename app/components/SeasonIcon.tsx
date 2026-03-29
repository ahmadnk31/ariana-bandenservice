"use client";

import { Sun, Snowflake, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeasonIconProps {
  season?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export default function SeasonIcon({ season, size = "md", className }: SeasonIconProps) {
  const sizeMap = {
    xs: "w-2.5 h-2.5",
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const iconSize = sizeMap[size] || sizeMap.md;
  const activeSeason = season?.toLowerCase();

  if (activeSeason === "summer") {
    return (
      <Sun 
        className={cn(iconSize, "text-amber-500 fill-amber-500/20", className)} 
        strokeWidth={2.5}
      />
    );
  }

  if (activeSeason === "winter") {
    return (
      <Snowflake 
        className={cn(iconSize, "text-blue-500", className)} 
        strokeWidth={2.5}
      />
    );
  }

  if (activeSeason === "all-season" || activeSeason === "4-season" || activeSeason === "allseason") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(iconSize, className)}
      >
        {/* Sun half (left) - Semi-circle path */}
        <path 
          d="M 12 7 A 5 5 0 0 0 12 17 Z" 
          className="text-amber-500 fill-amber-500/20" 
          stroke="currentColor" 
          strokeWidth="1.5"
        />
        {/* Sun rays (left only) */}
        <g stroke="currentColor" strokeWidth="2.5" className="text-amber-500">
          <path d="M 12 2 v 2" />
          <path d="M 5.22 5.22 l 1.42 1.42" />
          <path d="M 2 12 h 2" />
          <path d="M 5.22 18.78 l 1.42 -1.42" />
          <path d="M 12 22 v -2" />
        </g>
        
        {/* Snowflake half (right) */}
        <g stroke="currentColor" strokeWidth="2" className="text-blue-500">
          <path d="M 12 2 v 20" />
          <path d="M 12 12 l 8 -1.5" />
          <path d="M 12 12 l 8 1.5" />
          <path d="M 20 10.5 l -3 1.5 l 3 1.5" />
          <path d="M 12 12 l 5 -7" />
          <path d="M 17 5 l -3 2" />
          <path d="M 12 12 l 5 7" />
          <path d="M 17 19 l -3 -2" />
        </g>

        {/* Central Divider */}
        <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30" />
      </svg>
    );
  }

  // Fallback to sun/summer icon if season is missing or unrecognized
  return (
    <Sun 
      className={cn(iconSize, "text-amber-500 fill-amber-500/20", className)} 
      strokeWidth={2.5}
    />
  );
}
