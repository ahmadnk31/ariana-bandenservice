"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

interface DualRangeSliderProps
    extends React.ComponentProps<typeof SliderPrimitive.Root> {
    labelPosition?: "top" | "bottom";
    label?: (value: number | undefined) => React.ReactNode;
}

const DualRangeSlider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    DualRangeSliderProps & { labels?: string[] }
>(({ className, label, labelPosition = "top", labels, ...props }, ref) => {
    const value = (props.value as number[]) || [props.min ?? 0, props.max ?? 100];

    return (
        <SliderPrimitive.Root
            ref={ref}
            className={cn(
                "relative flex w-full touch-none select-none items-center pt-6 pb-2",
                className,
            )}
            {...props}
        >
            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
                <SliderPrimitive.Range className="absolute h-full bg-primary" />
            </SliderPrimitive.Track>
            {value.map((val, index) => (
                <SliderPrimitive.Thumb
                    key={index}
                    aria-label={labels?.[index] || (index === 0 ? "Minimum" : "Maximum")}
                    className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer shadow-sm hover:scale-110 active:scale-125"
                >
                    {label && (
                        <span
                            className={cn(
                                "absolute flex w-full justify-center text-[10px] whitespace-nowrap pointer-events-none font-bold",
                                labelPosition === "top" && "-top-6",
                                labelPosition === "bottom" && "top-6",
                            )}
                        >
                            {label(val)}
                        </span>
                    )}
                </SliderPrimitive.Thumb>
            ))}
        </SliderPrimitive.Root>
    );
});
DualRangeSlider.displayName = "DualRangeSlider";

export { DualRangeSlider };
