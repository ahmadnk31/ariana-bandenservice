"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComboboxProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    className?: string;
}

export function Combobox({
    options,
    value,
    onChange,
    placeholder = "Select option...",
    searchPlaceholder = "Search...",
    emptyMessage = "No results found.",
    className,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Filter options based on search
    const filteredOptions = React.useMemo(() => {
        if (!search) return options;
        const lowSearch = search.toLowerCase();
        return options.filter((opt) => opt.toLowerCase().includes(lowSearch));
    }, [options, search]);

    // Close on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Reset search when opening/closing
    React.useEffect(() => {
        if (!open) setSearch("");
    }, [open]);

    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-muted bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span className="truncate">
                    {value === "all" ? placeholder : value}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-muted bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 duration-100">
                    <div className="flex items-center border-b border-muted px-2 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                            className="flex h-6 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <div className="max-h-60 overflow-y-auto overflow-x-hidden p-1 overscroll-contain pointer-events-auto relative z-50">
                        {filteredOptions.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                {emptyMessage}
                            </div>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange("all");
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                        value === "all" && "bg-accent/50"
                                    )}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === "all" ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {placeholder}
                                </button>
                                {filteredOptions.map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => {
                                            onChange(opt);
                                            setOpen(false);
                                        }}
                                        className={cn(
                                            "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                            value === opt && "bg-accent/50"
                                        )}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === opt ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <span className="truncate">{opt}</span>
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
