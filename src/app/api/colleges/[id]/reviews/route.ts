import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { reviewSchema } from "@/lib/validators";

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const reviews = await prisma.review.findMany({
            where: { collegeId: id },
            include: {
                user: {
                    select: { name: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error("GET /api/colleges/[id]/reviews error:", error);
        return NextResponse.json(
            { error: "Failed to fetch reviews" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "You must be logged in to submit a review" },
                { status: 401 }
            );
        }

        const { id } = params;

        const college = await prisma.college.findUnique({ where: { id } });
        if (!college) {
            return NextResponse.json(
                { error: "College not found" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const data = reviewSchema.parse(body);

        const existingReview = await prisma.review.findFirst({
            where: { userId: session.user.id, collegeId: id },
        });

        if (existingReview) {
            return NextResponse.json(
                { error: "You have already reviewed this college" },
                { status: 409 }
            );
        }

        const review = await prisma.review.create({
            data: {
                ...data,
                userId: session.user.id,
                collegeId: id,
            },
            include: {
                user: {
                    select: { name: true },
                },
            },
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json(
                { error: "Invalid review data", details: error },
                { status: 400 }
            );
        }
        console.error("POST /api/colleges/[id]/reviews error:", error);
        return NextResponse.json(
            { error: "Failed to submit review" },
            { status: 500 }
        );
    }
}
