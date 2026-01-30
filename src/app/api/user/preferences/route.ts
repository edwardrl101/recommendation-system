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

        const preferences = user.preferences as {
            budget: string;
            styles: string[];
            context?: string
        };
        const searchStyles = preferences.styles.map(s => s.toLowerCase());

        // Parse Price Range
        const budgetStr = preferences.budget.replace(/[\$,]/g, "");
        let minPrice = 0, maxPrice = 1000000;

        if (budgetStr.includes("-")) {
            const parts = budgetStr.split("-");
            minPrice = parseInt(parts[0]) || 0;
            maxPrice = parseInt(parts[1]) || 1000000;
        } else if (budgetStr.includes("+")) {
            minPrice = parseInt(budgetStr.replace("+", "")) || 0;
        }

        // Fetch Artworks
        const artworks = await prisma.artwork.findMany({
            where: {
                price: { gte: minPrice, lte: maxPrice }
            },
            include: {
                artist: { select: { name: true } },
                likes: true
            }
        });

        const likedIds = user.likes.map(l => l.artworkId);

        // Advanced Logic: Score artworks based on tags and context-emotions
        const scoredArtworks = artworks.map(art => {
            let score = 0;
            const reasons: string[] = [];

            // 1. Tag Match Score
            const matchingTags = art.tags.filter(t => searchStyles.includes(t.toLowerCase()));
            if (matchingTags.length > 0) {
                score += matchingTags.length * 10;
                reasons.push(`Matches your interest in ${matchingTags.join(", ")}`);
            }

            // 2. Context-Emotion Match Score
            if (preferences.context && art.emotions) {
                const emotions = art.emotions as Record<string, number>;

                if (preferences.context === "home") {
                    // Home prefers calm, peaceful, serene
                    const homeScore = (emotions.calm || 0) + (emotions.peaceful || 0) + (emotions.serene || 0);
                    if (homeScore > 0.5) {
                        score += homeScore * 5;
                        reasons.push("Perfect for a relaxing home environment");
                    }
                } else if (preferences.context === "office") {
                    // Office prefers energetic, inspiring, structured
                    const officeScore = (emotions.energetic || 0) + (emotions.structured || 0) + (emotions.bold || 0);
                    if (officeScore > 0.5) {
                        score += officeScore * 5;
                        reasons.push("Provides energy and focus for your workspace");
                    }
                } else if (preferences.context === "collection") {
                    // Collections might prefer avant-garde or majestic pieces
                    const collectionScore = (emotions.majestic || 0) + (emotions.mystical || 0) + (emotions.raw || 0);
                    if (collectionScore > 0.5) {
                        score += collectionScore * 5;
                        reasons.push("Unique piece for high-end curation");
                    }
                }
            }

            return {
                ...art,
                artistName: art.artist?.name || "Independent Artist",
                isLiked: likedIds.includes(art.id),
                likesCount: art.likes.length,
                recommendationScore: score,
                recommendationReason: reasons[0] || "Fits your overall aesthetic"
            };
        });

        // Filter out zero scores if we have enough results, otherwise keep them
        let finalArtworks = scoredArtworks.sort((a, b) => b.recommendationScore - a.recommendationScore);

        // Ensure at least some variety if no tags match
        if (finalArtworks.length > 0 && finalArtworks[0].recommendationScore === 0) {
            // Keep original order or shuffle
        }

        return NextResponse.json({
            artworks: finalArtworks.slice(0, 20),
            userStyles: preferences.styles
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
