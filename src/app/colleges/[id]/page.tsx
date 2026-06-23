"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useCompare } from "@/components/Providers";
import ReviewCard from "@/components/ReviewCard";
import {
    Star,
    MapPin,
    IndianRupee,
    Calendar,
    ExternalLink,
    Heart,
    GitCompareArrows,
    TrendingUp,
    Users,
    Loader2,
    ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Course {
    id: string;
    name: string;
    duration: string;
    degree: string;
    fees: number;
}

interface Placement {
    id: string;
    year: number;
    averagePackage: number;
    highestPackage: number;
    medianPackage: number | null;
    placementRate: number;
    topRecruiters: string;
}

interface Review {
    id: string;
    rating: number;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    user: { name: string };
}

interface CollegeDetail {
    id: string;
    name: string;
    slug: string;
    location: string;
    state: string;
    type: string;
    establishedYear: number;
    rating: number;
    fees: number;
    description: string;
    website: string | null;
    affiliation: string | null;
    ranking: number | null;
    ownership: string;
    courses: Course[];
    placements: Placement[];
    reviews: Review[];
    averageReviewRating: number;
    _count: { reviews: number; savedBy: number };
}

export default function CollegeDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { data: session } = useSession();
    const { addToCompare, removeFromCompare, isInCompare, compareIds } = useCompare();
    const [college, setCollege] = useState<CollegeDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("overview");
    const [isSaved, setIsSaved] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", content: "", category: "Academics" });
    const [submitting, setSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState("");

    useEffect(() => {
        fetch(`/api/colleges/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("College not found");
                return res.json();
            })
            .then(setCollege)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (session) {
            fetch("/api/saved-colleges/ids")
                .then((res) => res.json())
                .then((ids: string[]) => setIsSaved(ids.includes(id)))
                .catch(console.error);
        }
    }, [session, id]);

    const handleSave = async () => {
        if (!session) { window.location.href = "/login"; return; }
        const res = await fetch("/api/saved-colleges", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ collegeId: id }),
        });
        const data = await res.json();
        setIsSaved(data.saved);
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) { window.location.href = "/login"; return; }
        setSubmitting(true);
        setReviewError("");
        try {
            const res = await fetch(`/api/colleges/${id}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reviewForm),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error);
            }
            const newReview = await res.json();
            setCollege((prev) => prev ? { ...prev, reviews: [newReview, ...prev.reviews] } : prev);
            setReviewForm({ rating: 5, title: "", content: "", category: "Academics" });
        } catch (err) {
            setReviewError(err instanceof Error ? err.message : "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error || !college) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">College Not Found</h2>
                <p className="text-gray-500 mb-4">{error || "This college does not exist."}</p>
                <Link href="/" className="text-blue-600 hover:underline text-sm">← Back to colleges</Link>
            </div>
        );
    }

    const inCompare = isInCompare(college.id);
    const latestPlacement = college.placements[0];

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "courses", label: `Courses (${college.courses.length})` },
        { id: "placements", label: "Placements" },
        { id: "reviews", label: `Reviews (${college.reviews.length})` },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to colleges
            </Link>

            {/* Header */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{college.name}</h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{college.location}, {college.state}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Est. {college.establishedYear}</span>
                            {college.website && (
                                <a href={college.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                                    <ExternalLink className="w-4 h-4" />Website
                                </a>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium">{college.type}</span>
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">{college.ownership}</span>
                            {college.affiliation && <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">{college.affiliation}</span>}
                            {college.ranking && <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs rounded-md font-medium">NIRF #{college.ranking}</span>}
                        </div>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2">
                        <button onClick={handleSave} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${isSaved ? "bg-red-50 border-red-200 text-red-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                            <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                            {isSaved ? "Saved" : "Save"}
                        </button>
                        <button
                            onClick={() => inCompare ? removeFromCompare(college.id) : addToCompare(college.id)}
                            disabled={!inCompare && compareIds.length >= 3}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${inCompare ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                        >
                            <GitCompareArrows className="w-4 h-4" />
                            {inCompare ? "In Compare" : "Compare"}
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                            <span className="text-lg font-bold text-gray-900">{college.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">Overall Rating</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <IndianRupee className="w-5 h-5 text-green-600" />
                            <span className="text-lg font-bold text-gray-900">{(college.fees / 100000).toFixed(1)}L</span>
                        </div>
                        <p className="text-xs text-gray-500">Annual Fees</p>
                    </div>
                    {latestPlacement && (
                        <>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                    <span className="text-lg font-bold text-gray-900">{(latestPlacement.averagePackage / 100).toFixed(1)}L</span>
                                </div>
                                <p className="text-xs text-gray-500">Avg Package</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Users className="w-5 h-5 text-purple-600" />
                                    <span className="text-lg font-bold text-gray-900">{latestPlacement.placementRate}%</span>
                                </div>
                                <p className="text-xs text-gray-500">Placement Rate</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex border-b border-gray-200 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-5">
                    {activeTab === "overview" && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">About {college.name}</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">{college.description}</p>
                        </div>
                    )}

                    {activeTab === "courses" && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Courses Offered</h2>
                            {college.courses.length === 0 ? (
                                <p className="text-sm text-gray-500">No courses listed yet.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-2.5 px-3 text-gray-500 font-medium">Course</th>
                                                <th className="text-left py-2.5 px-3 text-gray-500 font-medium">Degree</th>
                                                <th className="text-left py-2.5 px-3 text-gray-500 font-medium">Duration</th>
                                                <th className="text-right py-2.5 px-3 text-gray-500 font-medium">Total Fees</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {college.courses.map((course) => (
                                                <tr key={course.id} className="border-b border-gray-100 last:border-0">
                                                    <td className="py-2.5 px-3 text-gray-900 font-medium">{course.name}</td>
                                                    <td className="py-2.5 px-3 text-gray-600">{course.degree}</td>
                                                    <td className="py-2.5 px-3 text-gray-600">{course.duration}</td>
                                                    <td className="py-2.5 px-3 text-gray-900 text-right">₹{(course.fees / 100000).toFixed(1)}L</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "placements" && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Placement Statistics</h2>
                            {college.placements.length === 0 ? (
                                <p className="text-sm text-gray-500">No placement data available.</p>
                            ) : (
                                <div className="space-y-4">
                                    {college.placements.map((p) => (
                                        <div key={p.id} className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="font-medium text-gray-900 mb-3">Year {p.year}</h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-0.5">Average Package</p>
                                                    <p className="text-sm font-semibold text-gray-900">₹{(p.averagePackage / 100).toFixed(1)} LPA</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-0.5">Highest Package</p>
                                                    <p className="text-sm font-semibold text-green-700">₹{(p.highestPackage / 100).toFixed(1)} LPA</p>
                                                </div>
                                                {p.medianPackage && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-0.5">Median Package</p>
                                                        <p className="text-sm font-semibold text-gray-900">₹{(p.medianPackage / 100).toFixed(1)} LPA</p>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-0.5">Placement Rate</p>
                                                    <p className="text-sm font-semibold text-blue-700">{p.placementRate}%</p>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <p className="text-xs text-gray-500 mb-1">Top Recruiters</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {p.topRecruiters.split(", ").map((r) => (
                                                        <span key={r} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs text-gray-700">{r}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "reviews" && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Reviews</h2>

                            {session ? (
                                <form onSubmit={handleReviewSubmit} className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <h3 className="text-sm font-medium text-gray-900 mb-3">Write a Review</h3>
                                    {reviewError && <p className="text-sm text-red-600 mb-3">{reviewError}</p>}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Rating</label>
                                            <select
                                                value={reviewForm.rating}
                                                onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                                            >
                                                {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map((r) => (
                                                    <option key={r} value={r}>{r} Stars</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Category</label>
                                            <select
                                                value={reviewForm.category}
                                                onChange={(e) => setReviewForm({ ...reviewForm, category: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                                            >
                                                {["Academics", "Infrastructure", "Placements", "Campus Life"].map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-xs text-gray-500 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={reviewForm.title}
                                            onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                                            placeholder="Summary of your review"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-xs text-gray-500 mb-1">Review</label>
                                        <textarea
                                            value={reviewForm.content}
                                            onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                                            placeholder="Share your experience..."
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        {submitting ? "Submitting..." : "Submit Review"}
                                    </button>
                                </form>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
                                    <p className="text-sm text-gray-600">
                                        <Link href="/login" className="text-blue-600 hover:underline font-medium">Log in</Link> to write a review
                                    </p>
                                </div>
                            )}

                            {college.reviews.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                            ) : (
                                <div className="space-y-3">
                                    {college.reviews.map((review) => (
                                        <ReviewCard key={review.id} review={review} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="h-16" />
        </div>
    );
}
