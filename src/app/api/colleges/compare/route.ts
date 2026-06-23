import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const idsParam = searchParams.get("ids");

        if (!idsParam) {
            return NextResponse.json(
                { error: "Please provide college IDs to compare (ids=id1,id2,id3)" },
                { status: 400 }
            );
        }

        const ids = idsParam.split(",").filter(Boolean);

        if (ids.length < 2 || ids.length > 3) {
            return NextResponse.json(
                { error: "Please select 2 or 3 colleges to compare" },
                { status: 400 }
            );
        }

        const colleges = await prisma.college.findMany({
            where: { id: { in: ids } },
            include: {
                courses: true,
                placements: {
                    orderBy: { year: "desc" },
                    take: 1,
                },
                _count: {
                    select: { reviews: true },
                },
            },
        });

        if (colleges.length !== ids.length) {
            return NextResponse.json(
                { error: "One or more colleges not found" },
                { status: 404 }
            );
        }

        // Structure data for comparison
        const comparisonData = colleges.map((college) => ({
            id: college.id,
            name: college.name,
            location: `${college.location}, ${college.state}`,
            type: college.type,
            ownership: college.ownership,
            establishedYear: college.establishedYear,
            rating: college.rating,
            fees: college.fees,
            ranking: college.ranking,
            affiliation: college.affiliation,
            totalCourses: college.courses.length,
            courses: college.courses.map((c) => `${c.name} (${c.degree})`),
            latestPlacement: college.placements[0] || null,
            totalReviews: college._count.reviews,
        }));

        return NextResponse.json(comparisonData);
    } catch (error) {
        console.error("GET /api/colleges/compare error:", error);
        return NextResponse.json(
            { error: "Failed to compare colleges" },
            { status: 500 }
        );
    }
}
