import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await prisma.$connect();
        const count = await prisma.college.count();
        return NextResponse.json({ success: true, count });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            errorName: error.name,
            errorMessage: error.message,
            errorStack: error.stack,
            envVarsSet: {
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
            }
        }, { status: 500 });
    }
}
