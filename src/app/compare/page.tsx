"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCompare } from "@/components/Providers";
import Link from "next/link";
import {
    GitCompareArrows,
    Loader2,
    Star,
    MapPin,
    IndianRupee,
    TrendingUp,
    Users,
    ArrowLeft,
    AlertCircle,
} from "lucide-react";

interface CompareCollege {
    id: string;
    name: string;
    location: string;
    type: string;
    ownership: string;
    establishedYear: number;
    rating: number;
    fees: number;
    ranking: number | null;
    affiliation: string | null;
    totalCourses: number;
    courses: string[];
    latestPlacement: {
        averagePackage: number;
        highestPackage: number;
        medianPackage: number | null;
        placementRate: number;
        topRecruiters: string;
    } | null;
    totalReviews: number;
}

function CompareContent() {
    const searchParams = useSearchParams();
    const { compareIds: contextIds } = useCompare();
    const { data: session } = useSession();
    const [colleges, setColleges] = useState<CompareCollege[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const ids = searchParams.get("ids")?.split(",").filter(Boolean) || contextIds;

    const fetchCompare = useCallback(async () => {
        if (ids.length < 2) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/colleges/compare?ids=${ids.join(",")}`);
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error);
            }
            const data = await res.json();
            setColleges(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to compare");
        } finally {
            setLoading(false);
        }
    }, [ids.join(",")]);

    useEffect(() => {
        fetchCompare();
    }, [fetchCompare]);

    const handleSaveComparison = async () => {
        if (!session) {
            window.location.href = "/login";
            return;
        }
        setSaving(true);
        try {
            const res = await fetch("/api/saved-comparisons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ collegeIds: ids }),
            });
            if (res.ok) {
                setSaveSuccess(true);
            }
        } catch (error) {
            console.error("Failed to save comparison", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (ids.length < 2) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <GitCompareArrows className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Compare Colleges</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Select 2-3 colleges from the listing to compare them side by side.
                </p>
                <Link href="/" className="text-sm text-blue-600 hover:underline">
                    ← Browse Colleges
                </Link>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Comparison Error</h2>
                <p className="text-sm text-gray-500">{error}</p>
            </div>
        );
    }

    const rows = [
        { label: "Location", icon: MapPin, render: (c: CompareCollege) => c.location },
        { label: "Type", render: (c: CompareCollege) => c.type },
        { label: "Ownership", render: (c: CompareCollege) => c.ownership },
        { label: "Established", render: (c: CompareCollege) => String(c.establishedYear) },
        {
            label: "Rating",
            icon: Star,
            render: (c: CompareCollege) => (
                <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-semibold">{c.rating}</span>
                </span>
            ),
        },
        {
            label: "Annual Fees",
            icon: IndianRupee,
            render: (c: CompareCollege) => `₹${(c.fees / 100000).toFixed(1)}L`,
        },
        { label: "NIRF Ranking", render: (c: CompareCollege) => c.ranking ? `#${c.ranking}` : "N/A" },
        { label: "Affiliation", render: (c: CompareCollege) => c.affiliation || "N/A" },
        { label: "Total Courses", render: (c: CompareCollege) => String(c.totalCourses) },
        {
            label: "Avg Package",
            icon: TrendingUp,
            render: (c: CompareCollege) =>
                c.latestPlacement ? `₹${(c.latestPlacement.averagePackage / 100).toFixed(1)} LPA` : "N/A",
        },
        {
            label: "Highest Package",
            render: (c: CompareCollege) =>
                c.latestPlacement ? `₹${(c.latestPlacement.highestPackage / 100).toFixed(1)} LPA` : "N/A",
        },
        {
            label: "Placement Rate",
            icon: Users,
            render: (c: CompareCollege) =>
                c.latestPlacement ? `${c.latestPlacement.placementRate}%` : "N/A",
        },
        {
            label: "Top Recruiters",
            render: (c: CompareCollege) =>
                c.latestPlacement ? c.latestPlacement.topRecruiters : "N/A",
        },
        { label: "Reviews", render: (c: CompareCollege) => String(c.totalReviews) },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to colleges
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <GitCompareArrows className="w-5 h-5 text-blue-600" />
                    Compare Colleges
                </h1>

                <button
                    onClick={handleSaveComparison}
                    disabled={saving || saveSuccess}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                    {saving ? "Saving..." : saveSuccess ? "✓ Saved" : "Save Comparison"}
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-4 px-4 text-gray-500 font-medium w-40 bg-gray-50">Feature</th>
                                {colleges.map((c) => (
                                    <th key={c.id} className="text-left py-4 px-4 min-w-[200px]">
                                        <Link href={`/colleges/${c.id}`} className="text-blue-600 hover:underline font-semibold">
                                            {c.name}
                                        </Link>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => (
                                <tr key={row.label} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-gray-50/50" : ""}`}>
                                    <td className="py-3 px-4 text-gray-500 font-medium bg-gray-50">{row.label}</td>
                                    {colleges.map((c) => (
                                        <td key={c.id} className="py-3 px-4 text-gray-900">
                                            {typeof row.render(c) === "string" ? row.render(c) : row.render(c)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {/* Courses row */}
                            <tr className="border-b border-gray-100">
                                <td className="py-3 px-4 text-gray-500 font-medium bg-gray-50">Courses</td>
                                {colleges.map((c) => (
                                    <td key={c.id} className="py-3 px-4">
                                        <ul className="space-y-1">
                                            {c.courses.map((course) => (
                                                <li key={course} className="text-xs text-gray-600">• {course}</li>
                                            ))}
                                        </ul>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="h-16" />
        </div>
    );
}

export default function ComparePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="w-6 h-6 text-blue-600 animate-spin" /></div>}>
            <CompareContent />
        </Suspense>
    );
}
