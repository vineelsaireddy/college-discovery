import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { collegeQuerySchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const params = Object.fromEntries(searchParams.entries());
        const query = collegeQuerySchema.parse(params);

        const where: Record<string, unknown> = {};

        if (query.search) {
            where.OR = [
                { name: { contains: query.search } },
                { location: { contains: query.search } },
                { state: { contains: query.search } },
            ];
        }

        if (query.state) {
            where.state = query.state;
        }

        if (query.type) {
            where.type = query.type;
        }

        if (query.ownership) {
            where.ownership = query.ownership;
        }

        if (query.minFees || query.maxFees) {
            where.fees = {};
            if (query.minFees) (where.fees as Record<string, number>).gte = query.minFees;
            if (query.maxFees) (where.fees as Record<string, number>).lte = query.maxFees;
        }

        if (query.minRating) {
            where.rating = { gte: query.minRating };
        }

        const orderBy: Record<string, string> = {};
        if (query.sortBy) {
            orderBy[query.sortBy] = query.sortOrder || "desc";
        } else {
            orderBy.rating = "desc";
        }

        const skip = (query.page - 1) * query.limit;

        const [colleges, total] = await Promise.all([
            prisma.college.findMany({
                where,
                orderBy,
                skip,
                take: query.limit,
                include: {
                    placements: {
                        orderBy: { year: "desc" },
                        take: 1,
                    },
                    _count: {
                        select: { reviews: true, courses: true },
                    },
                },
            }),
            prisma.college.count({ where }),
        ]);

        // Get distinct values for filters
        const [states, types] = await Promise.all([
            prisma.college.findMany({ select: { state: true }, distinct: ["state"], orderBy: { state: "asc" } }),
            prisma.college.findMany({ select: { type: true }, distinct: ["type"], orderBy: { type: "asc" } }),
        ]);

        return NextResponse.json({
            colleges,
            pagination: {
                page: query.page,
                limit: query.limit,
                total,
                totalPages: Math.ceil(total / query.limit),
            },
            filters: {
                states: states.map((s) => s.state),
                types: types.map((t) => t.type),
            },
        });
    } catch (error) {
        console.error("GET /api/colleges error:", error);
        return NextResponse.json(
            { error: "Failed to fetch colleges" },
            { status: 500 }
        );
    }
}
