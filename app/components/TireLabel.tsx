"use client";

interface TireLabelProps {
    efficiency?: string | null;
    grip?: string | null;
    noise?: string | null;
    noiseDb?: number | null;
    size?: "sm" | "md" | "lg";
}

export default function TireLabel({
    efficiency,
    grip,
    noise,
    noiseDb,
    size = "md"
}: TireLabelProps) {
    if (!efficiency && !grip && !noise && !noiseDb) return null;

    const getEfficiencyColor = (grade: string | null | undefined) => {
        if (!grade) return "bg-gray-100 text-gray-400";
        const g = grade.toUpperCase();
        if (g === 'A') return "bg-[#008D43]"; // Dark Green
        if (g === 'B') return "bg-[#4AAF47]"; // Light Green
        if (g === 'C') return "bg-[#FDDA24]"; // Yellow
        if (g === 'D') return "bg-[#ED6F22]"; // Orange
        if (g === 'E') return "bg-[#D91F26]"; // Red
        return "bg-gray-200 text-gray-500";
    };

    const getGripColor = (grade: string | null | undefined) => {
        if (!grade) return "bg-gray-100 text-gray-400";
        return "bg-[#0057B7]"; // Official EU Wet Grip Blue
    };

    const getNoiseColor = (grade: string | null | undefined) => {
        if (!grade) return "bg-gray-100 text-gray-400";
        return "bg-[#008D43]"; // Green
    };

    const iconSize = size === "sm" ? 20 : size === "md" ? 28 : 36;
    const textSize = size === "sm" ? "text-[9px]" : size === "md" ? "text-[11px]" : "text-[13px]";
    const letterSize = size === "sm" ? "text-[11px]" : size === "md" ? "text-[14px]" : "text-[18px]";
    const badgeSize = size === "sm" ? "h-5 w-5" : size === "md" ? "h-7 w-7" : "h-9 w-9";
    const containerSize = size === "sm" ? "p-1 gap-1" : size === "md" ? "p-1.5 gap-2" : "p-2 gap-3";

    return (
        <div className={`flex flex-wrap items-center ${size === "sm" ? "gap-2" : "gap-4"}`}>
            {/* Fuel Efficiency */}
            {efficiency && (
                <div className={`flex items-center bg-white border border-muted rounded-lg shadow-sm ${containerSize}`}>
                    {/* Detailed EU Fuel Pump */}
                    <svg width={iconSize} height={iconSize} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28 14V8C28 6.89543 27.1046 6 26 6H10C8.89543 6 8 6.89543 8 8V32H28V14Z" stroke="#333" strokeWidth="2"/>
                        <rect x="11" y="9" width="14" height="8" rx="1" fill="#EEE" stroke="#333" strokeWidth="1.5"/>
                        <path d="M28 14L32 18V30C32 31.1046 32.8954 32 34 32C35.1046 32 36 31.1046 36 30V15C36 13.8954 35.1046 13 34 13C33 13 32 14 32 14" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="34" cy="18" r="2" fill="#333"/>
                        <line x1="12" y1="22" x2="24" y2="22" stroke="#333" strokeWidth="1.5"/>
                        <line x1="12" y1="26" x2="24" y2="26" stroke="#333" strokeWidth="1.5"/>
                    </svg>
                    <div className={`
                        flex items-center justify-center font-black rounded shadow-sm
                        ${badgeSize} ${letterSize} ${getEfficiencyColor(efficiency)} text-white
                    `}>
                        {efficiency.toUpperCase()}
                    </div>
                </div>
            )}

            {/* Wet Grip */}
            {grip && (
                <div className={`flex items-center bg-white border border-muted rounded-lg shadow-sm ${containerSize}`}>
                    {/* Detailed EU Wet Grip (Cloud + Rain + Road) */}
                    <svg width={iconSize} height={iconSize} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28 22C30.2091 22 32 20.2091 32 18C32 15.7909 30.2091 14 28 14C27.7 14 27.4 14.05 27.1 14.15C26.3 11.25 23.65 9.15 20.5 9.15C16.9 9.15 13.95 11.85 13.6 15.3C13 14.65 12.1 14.15 11.1 14.15C9.25 14.15 7.75 15.65 7.75 17.5C7.75 17.65 7.75 17.8 7.8 17.95C6.75 18.25 6 19.25 6 20.4C6 21.85 7.15 23 8.6 23" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M14 26L12 30M20 26L18 30M26 26L24 30" stroke="#0057B7" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M8 34H32" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <div className={`
                        flex items-center justify-center font-black rounded shadow-sm
                        ${badgeSize} ${letterSize} ${getGripColor(grip)} text-white
                    `}>
                        {grip.toUpperCase()}
                    </div>
                </div>
            )}

            {/* Noise */}
            {(noise || noiseDb) && (
                <div className={`flex items-center bg-white border border-muted rounded-lg shadow-sm ${containerSize}`}>
                    {/* Modern Speaker / Noise Icon */}
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
                        <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15.54 8.46002C16.4774 9.39766 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19.07 4.92999C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="flex flex-col items-center">
                        {noise && (
                            <div className={`
                                flex items-center justify-center font-black rounded shadow-sm
                                ${badgeSize} ${letterSize} ${getNoiseColor(noise)} text-white
                            `}>
                                {noise.toUpperCase()}
                            </div>
                        )}
                        {noiseDb && (
                            <span className={`${textSize} font-black text-foreground mt-0.5 leading-none tabular-nums`}>
                                {noiseDb} dB
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
