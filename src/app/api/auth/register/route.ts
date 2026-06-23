import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { registerSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = registerSchema.parse(body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await hash(data.password, 12);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            { message: "Account created successfully", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json(
                { error: "Invalid registration data", details: error },
                { status: 400 }
            );
        }
        console.error("POST /api/auth/register error:", error);
        return NextResponse.json(
            { error: "Failed to create account" },
            { status: 500 }
        );
    }
}
