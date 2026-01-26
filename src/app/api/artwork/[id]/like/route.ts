import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: artworkId } = await params;
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const existingLike = await prisma.like.findUnique({
            where: {
                userId_artworkId: {
                    userId: user.id,
                    artworkId: artworkId,
                },
            },
        });

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    userId_artworkId: {
                        userId: user.id,
                        artworkId: artworkId,
                    },
                },
            });
            return NextResponse.json({ message: "Unliked" });
        } else {
            await prisma.like.create({
                data: {
                    userId: user.id,
                    artworkId: artworkId,
                },
            });
            return NextResponse.json({ message: "Liked" });
        }
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error toggling like", error: error.message },
            { status: 500 }
        );
    }
}
