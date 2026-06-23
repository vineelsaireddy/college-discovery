"use client";

import { Star, User as UserIcon } from "lucide-react";

interface ReviewCardProps {
    review: {
        id: string;
        rating: number;
        title: string;
        content: string;
        category: string;
        createdAt: string;
        user: { name: string };
    };
}

export default function ReviewCard({ review }: ReviewCardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                    <h4 className="font-medium text-gray-900 text-sm">{review.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${i < Math.round(review.rating)
                                            ? "text-amber-500 fill-amber-500"
                                            : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">
                            {review.category}
                        </span>
                    </div>
                </div>
            </div>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{review.content}</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
                <UserIcon className="w-3.5 h-3.5" />
                <span>{review.user.name}</span>
                <span>·</span>
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
}
