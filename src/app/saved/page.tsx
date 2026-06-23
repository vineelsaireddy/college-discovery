"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CollegeCard from "@/components/CollegeCard";
import { Heart, Loader2, LogIn, GitCompareArrows, Trash2 } from "lucide-react";

interface SavedItem {
    id: string;
    collegeId: string;
    college: {
        id: string;
        name: string;
        location: string;
        state: string;
        type: string;
        rating: number;
        fees: number;
        ownership: string;
        ranking: number | null;
        placements: { averagePackage: number; placementRate: number }[];
        _count: { reviews: number };
    };
}

interface SavedComparison {
    id: string;
    name: string | null;
    collegeIds: string;
    createdAt: string;
    colleges: {
        id: string;
        name: string;
        type: string;
        imageUrl: string | null;
    }[];
}

export default function SavedPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
    const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>([]);
    const [loading, setLoading] = useState(true);
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<"colleges" | "comparisons">("colleges");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }
        if (status === "authenticated") {
            Promise.all([
                fetch("/api/saved-colleges").then(res => res.json()),
                fetch("/api/saved-comparisons").then(res => res.json())
            ])
                .then(([collegesData, comparisonsData]) => {
                    setSavedItems(collegesData);
                    setSavedIds(collegesData.map((d: SavedItem) => d.college.id));
                    setSavedComparisons(comparisonsData);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [status, router]);

    const handleToggleSave = (collegeId: string) => {
        setSavedItems((prev) => prev.filter((item) => item.college.id !== collegeId));
        setSavedIds((prev) => prev.filter((id) => id !== collegeId));
    };

    const handleDeleteComparison = async (id: string) => {
        try {
            await fetch(`/api/saved-comparisons?id=${id}`, { method: "DELETE" });
            setSavedComparisons(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error("Failed to delete comparison", error);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <LogIn className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign In Required</h2>
                <p className="text-sm text-gray-500 mb-4">Please log in to view saved colleges.</p>
                <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    <LogIn className="w-4 h-4" />
                    Sign In
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Saved Items
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 mb-4">
                        Manage your saved colleges and comparisons
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab("colleges")}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "colleges" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                        Colleges ({savedItems.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("comparisons")}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "comparisons" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                        Comparisons ({savedComparisons.length})
                    </button>
                </div>
            </div>

            {activeTab === "colleges" && (
                savedItems.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
                        <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">No Saved Colleges</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Start exploring and save colleges you&apos;re interested in.
                        </p>
                        <Link href="/" className="text-sm text-blue-600 hover:underline">
                            ← Browse Colleges
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savedItems.map((item) => (
                            <CollegeCard
                                key={item.id}
                                college={item.college}
                                isSaved={savedIds.includes(item.college.id)}
                                onToggleSave={handleToggleSave}
                            />
                        ))}
                    </div>
                )
            )}

            {activeTab === "comparisons" && (
                savedComparisons.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
                        <GitCompareArrows className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">No Saved Comparisons</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Compare colleges and save the comparison to view it later.
                        </p>
                        <Link href="/" className="text-sm text-blue-600 hover:underline">
                            ← Browse Colleges
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedComparisons.map((comp) => (
                            <div key={comp.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{comp.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1">Saved on {new Date(comp.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteComparison(comp.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                        title="Delete comparison"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-2 mb-4">
                                    {comp.colleges.map((c, i) => (
                                        <div key={c.id} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                            <span className="w-5 h-5 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{i + 1}</span>
                                            <span className="font-medium truncate">{c.name}</span>
                                            <span className="text-xs text-gray-500 ml-auto flex-shrink-0">{c.type}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href={`/compare?ids=${comp.collegeIds}`}
                                    className="block w-full py-2 text-center text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                >
                                    View Comparison
                                </Link>
                            </div>
                        ))}
                    </div>
                )
            )}

            <div className="h-16" />
        </div>
    );
}
