import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { budget, styles } = await req.json();

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                preferences: {
                    budget,
                    styles,
                },
            },
        });

        return NextResponse.json({ message: "Preferences updated", user: updatedUser });
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error updating preferences", error: error.message },
            { status: 500 }
        );
    }
}
