import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
            select: { collegeId: true },
        });

        return NextResponse.json(saved.map((s) => s.collegeId));
    } catch (error) {
        console.error("GET /api/saved-colleges/ids error:", error);
        return NextResponse.json(
            { error: "Failed to fetch saved college IDs" },
            { status: 500 }
        );
    }
}
