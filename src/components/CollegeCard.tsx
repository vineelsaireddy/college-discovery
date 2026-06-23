"use client";

import Link from "next/link";
import { useCompare } from "./Providers";
import { useSession } from "next-auth/react";
import { Star, MapPin, IndianRupee, Heart, GitCompareArrows, TrendingUp } from "lucide-react";
import { useState } from "react";

interface CollegeCardProps {
    college: {
        id: string;
        name: string;
        location: string;
        state: string;
        type: string;
        rating: number;
        fees: number;
        ownership: string;
        ranking?: number | null;
        placements?: { averagePackage: number; placementRate: number }[];
        _count?: { reviews: number };
    };
    isSaved?: boolean;
    onToggleSave?: (collegeId: string) => void;
}

function formatFees(fees: number): string {
    if (fees >= 100000) {
        return `₹${(fees / 100000).toFixed(1)}L/yr`;
    }
    return `₹${(fees / 1000).toFixed(0)}K/yr`;
}

function formatPackage(pkg: number): string {
    return `₹${(pkg / 100).toFixed(1)} LPA`;
}

export default function CollegeCard({ college, isSaved = false, onToggleSave }: CollegeCardProps) {
    const { addToCompare, removeFromCompare, isInCompare, compareIds } = useCompare();
    const { data: session } = useSession();
    const [saving, setSaving] = useState(false);
    const inCompare = isInCompare(college.id);
    const latestPlacement = college.placements?.[0];

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!session) {
            window.location.href = "/login";
            return;
        }
        if (saving) return;
        setSaving(true);
        try {
            await fetch("/api/saved-colleges", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ collegeId: college.id }),
            });
            onToggleSave?.(college.id);
        } catch (err) {
            console.error("Save failed:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleCompare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (inCompare) {
            removeFromCompare(college.id);
        } else {
            addToCompare(college.id);
        }
    };

    return (
        <Link href={`/colleges/${college.id}`} className="block group">
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors truncate">
                            {college.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{college.location}, {college.state}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleSave}
                            className={`p-1.5 rounded-md transition-colors ${isSaved ? "text-red-500 hover:bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-gray-50"
                                }`}
                            title={isSaved ? "Unsave" : "Save college"}
                        >
                            <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                        </button>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md font-medium">
                        {college.type}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                        {college.ownership}
                    </span>
                    {college.ranking && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-md font-medium">
                            NIRF #{college.ranking}
                        </span>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium text-gray-900">{college.rating}</span>
                        <span className="text-xs text-gray-500">
                            ({college._count?.reviews || 0} reviews)
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <IndianRupee className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">{formatFees(college.fees)}</span>
                    </div>
                    {latestPlacement && (
                        <>
                            <div className="flex items-center gap-1.5">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <span className="text-xs text-gray-600">
                                    Avg: {formatPackage(latestPlacement.averagePackage)}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs text-gray-600">
                                    Placed: {latestPlacement.placementRate}%
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Compare button */}
                <button
                    onClick={handleCompare}
                    disabled={!inCompare && compareIds.length >= 3}
                    className={`w-full py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${inCompare
                            ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                            : compareIds.length >= 3
                                ? "bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed"
                                : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-800"
                        }`}
                >
                    <GitCompareArrows className="w-4 h-4" />
                    {inCompare ? "Remove from Compare" : "Add to Compare"}
                </button>
            </div>
        </Link>
    );
}
