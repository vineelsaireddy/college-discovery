import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "You must be logged in to view saved comparisons" },
                { status: 401 }
            );
        }

        const savedComparisons = await prisma.savedComparison.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        // We can't join directly because collegeIds is a string. 
        // We'll fetch all unique college IDs from these comparisons and get their data.
        const allCollegeIds = new Set<string>();
        const comparisonResults = savedComparisons.map(sc => {
            const ids = sc.collegeIds.split(",");
            ids.forEach(id => allCollegeIds.add(id));
            return { ...sc, ids };
        });

        const collegesData = await prisma.college.findMany({
            where: { id: { in: Array.from(allCollegeIds) } },
            select: { id: true, name: true, type: true, imageUrl: true }
        });

        const results = comparisonResults.map(sc => ({
            ...sc,
            colleges: sc.ids.map(id => collegesData.find(c => c.id === id)).filter(Boolean)
        }));

        return NextResponse.json(results);
    } catch (error) {
        console.error("GET /api/saved-comparisons error:", error);
        return NextResponse.json(
            { error: "Failed to fetch saved comparisons" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "You must be logged in to save a comparison" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { collegeIds, name } = body;

        if (!Array.isArray(collegeIds) || collegeIds.length < 2 || collegeIds.length > 3) {
            return NextResponse.json(
                { error: "Comparison must include 2 to 3 colleges" },
                { status: 400 }
            );
        }

        // Sort IDs to ensure uniqueness comparison if needed
        const sortedIds = [...collegeIds].sort().join(",");

        // Check if this exact comparison already exists
        const existing = await prisma.savedComparison.findFirst({
            where: {
                userId: session.user.id,
                collegeIds: sortedIds,
            }
        });

        if (existing) {
            return NextResponse.json(
                { error: "This comparison is already saved", comparison: existing },
                { status: 200 } // Or 409
            );
        }

        const savedComparison = await prisma.savedComparison.create({
            data: {
                userId: session.user.id,
                collegeIds: sortedIds,
                name: name || `${collegeIds.length} Colleges Comparison`,
            },
        });

        return NextResponse.json(
            { saved: true, comparison: savedComparison },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/saved-comparisons error:", error);
        return NextResponse.json(
            { error: "Failed to save comparison" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Comparison ID required" }, { status: 400 });
        }

        // Ensure they own it before deleting
        const existing = await prisma.savedComparison.findUnique({
            where: { id }
        });

        if (!existing || existing.userId !== session.user.id) {
            return NextResponse.json({ error: "Comparison not found or unauthorized" }, { status: 404 });
        }

        await prisma.savedComparison.delete({
            where: { id },
        });

        return NextResponse.json({ deleted: true });
    } catch (error) {
        console.error("DELETE /api/saved-comparisons error:", error);
        return NextResponse.json(
            { error: "Failed to delete saved comparison" },
            { status: 500 }
        );
    }
}
