import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                role: body.role,
                onboarded: true,
                preferences: {
                    context: body.context,
                    budget: body.budget,
                    styles: body.styles,
                },
            },
        });

        return NextResponse.json({ message: "Preferences updated", user: updatedUser });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json(
            { message: "Error updating preferences", error: message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { likes: true }
        });

        if (!user || !user.preferences) {
            return NextResponse.json({ message: "No preferences found" }, { status: 404 });
        }

        const preferences = user.preferences as { budget: string; styles: string[] };
        const searchStyles = preferences.styles.map(s => s.toLowerCase());

        // Parse Price Range
        const budgetStr = preferences.budget.replace(/[\$,]/g, "");
        let minPrice = 0, maxPrice = 1000000;

        if (budgetStr.includes("-")) {
            const parts = budgetStr.split("-");
            minPrice = parseInt(parts[0]) || 0;
            maxPrice = parseInt(parts[1]) || 1000000;
        } else if (budgetStr.includes("+")) {
            minPrice = parseInt(budgetStr) || 0;
        }

        // Fetch Artworks with Join
        const artworks = await prisma.artwork.findMany({
            where: {
                OR: [
                    // 1. Check for exact matches in tags
                    { tags: { hasSome: searchStyles } },
                    // 2. Fuzzy search: Check if any style is contained in the title or medium
                    ...searchStyles.map(style => ({
                        title: { contains: style, mode: 'insensitive' as const }
                    }))
                ],
                // Only apply price filter if explicitly set
                price: { gte: minPrice, lte: maxPrice }
            },
            include: {
                artist: { select: { name: true } },
                likes: true
            }
        });

        const likedIds = user.likes.map(l => l.artworkId);

        // Map data to a "Flat" structure for the frontend
        const formattedArtworks = artworks.map(art => ({
            ...art,
            artistName: art.artist?.name || "Independent Artist",
            isLiked: likedIds.includes(art.id),
            likesCount: art.likes.length
        }));

        return NextResponse.json({
            artworks: formattedArtworks,
            userStyles: preferences.styles // Send back for the UI header
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ message }, { status: 500 });
    }
}