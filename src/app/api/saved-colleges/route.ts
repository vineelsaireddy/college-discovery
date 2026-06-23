import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "You must be logged in" },
                { status: 401 }
            );
        }

        const saved = await prisma.savedCollege.findMany({
            where: { userId: session.user.id },
            include: {
                college: {
                    include: {
                        placements: {
                            orderBy: { year: "desc" },
                            take: 1,
                        },
                        _count: {
                            select: { reviews: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(saved);
    } catch (error) {
        console.error("GET /api/saved-colleges error:", error);
        return NextResponse.json(
            { error: "Failed to fetch saved colleges" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "You must be logged in" },
                { status: 401 }
            );
        }

        const { collegeId } = await request.json();

        if (!collegeId) {
            return NextResponse.json(
                { error: "College ID is required" },
                { status: 400 }
            );
        }

        // Check if college exists
        const college = await prisma.college.findUnique({
            where: { id: collegeId },
        });

        if (!college) {
            return NextResponse.json(
                { error: "College not found" },
                { status: 404 }
            );
        }

        // Check if already saved
        const existing = await prisma.savedCollege.findUnique({
            where: {
                userId_collegeId: {
                    userId: session.user.id,
                    collegeId,
                },
            },
        });

        if (existing) {
            // Unsave (toggle behavior)
            await prisma.savedCollege.delete({
                where: { id: existing.id },
            });
            return NextResponse.json({ saved: false, message: "College removed from saved" });
        }

        // Save
        await prisma.savedCollege.create({
            data: {
                userId: session.user.id,
                collegeId,
            },
        });

        return NextResponse.json({ saved: true, message: "College saved" }, { status: 201 });
    } catch (error) {
        console.error("POST /api/saved-colleges error:", error);
        return NextResponse.json(
            { error: "Failed to save college" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "You must be logged in" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const collegeId = searchParams.get("collegeId");

        if (!collegeId) {
            return NextResponse.json(
                { error: "College ID is required" },
                { status: 400 }
            );
        }

        await prisma.savedCollege.deleteMany({
            where: {
                userId: session.user.id,
                collegeId,
            },
        });

        return NextResponse.json({ message: "College removed from saved" });
    } catch (error) {
        console.error("DELETE /api/saved-colleges error:", error);
        return NextResponse.json(
            { error: "Failed to remove saved college" },
            { status: 500 }
        );
    }
}
