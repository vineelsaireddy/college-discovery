"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    defaultValue?: string;
}

export default function SearchBar({
    onSearch,
    placeholder = "Search colleges by name, location, or state...",
    defaultValue = "",
}: SearchBarProps) {
    const [value, setValue] = useState(defaultValue);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(value);
        }, 300);
        return () => clearTimeout(timer);
    }, [value, onSearch]);

    const handleClear = useCallback(() => {
        setValue("");
    }, []);

    return (
        <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {value && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
