"use client";

import Link from "next/link";
import { useCompare } from "./Providers";
import { X, GitCompareArrows } from "lucide-react";

export default function CompareBar() {
    const { compareIds, removeFromCompare, clearCompare } = useCompare();

    if (compareIds.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <GitCompareArrows className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-600">
                            <span className="font-medium">{compareIds.length}</span> of 3 colleges selected
                        </span>
                        <button
                            onClick={clearCompare}
                            className="text-xs text-gray-400 hover:text-gray-600 underline"
                        >
                            Clear all
                        </button>
                    </div>
                    <Link
                        href={`/compare?ids=${compareIds.join(",")}`}
                        className={`inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium rounded-lg transition-colors ${compareIds.length >= 2
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                        onClick={(e) => {
                            if (compareIds.length < 2) e.preventDefault();
                        }}
                    >
                        Compare Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
