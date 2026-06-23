import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const college = await prisma.college.findUnique({
            where: { id },
            include: {
                courses: true,
                placements: {
                    orderBy: { year: "desc" },
                },
                reviews: {
                    include: {
                        user: {
                            select: { name: true },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
                _count: {
                    select: { reviews: true, savedBy: true },
                },
            },
        });

        if (!college) {
            return NextResponse.json(
                { error: "College not found" },
                { status: 404 }
            );
        }

        const avgRating =
            college.reviews.length > 0
                ? college.reviews.reduce((sum, r) => sum + r.rating, 0) /
                college.reviews.length
                : 0;

        return NextResponse.json({
            ...college,
            averageReviewRating: Math.round(avgRating * 10) / 10,
        });
    } catch (error) {
        console.error("GET /api/colleges/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to fetch college" },
            { status: 500 }
        );
    }
}
