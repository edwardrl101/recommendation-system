// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import prisma from "@/lib/prisma";
// import Navbar from "@/components/ui/Navbar";
// import ArtCard from "@/components/ui/ArtCard";
// import Link from "next/link";
// import { redirect } from "next/navigation";

// export default async function DashboardPage() {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.email) {
//         redirect("/login");
//     }

//     const user = await prisma.user.findUnique({
//         where: { email: session.user.email },
//         include: { likes: true }
//     });

//     if (!user?.preferences) {
//         redirect("/onboarding");
//     }

//     const preferences = user.preferences as { budget: string, styles: string[] };

//     // Basic recommendation logic: filter by tags and price
//     const [minPrice, maxPrice] = preferences.budget.split("-").map(p => {
//         if (p.includes("+")) return 10000;
//         return parseInt(p);
//     });

//     const artworks = await prisma.artwork.findMany({
//         where: {
//             AND: [
//                 { tags: { hasSome: preferences.styles } },
//                 { price: { gte: minPrice || 0 } },
//                 maxPrice ? { price: { lte: maxPrice } } : {},
//             ]
//         },
//         take: 20
//     });

//     const likedIds = new Set(user.likes.map((l: any) => l.artworkId));

//     return (
//         <div className="min-h-screen bg-white text-black">
//             <Navbar />
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//                 <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
//                     <div>
//                         <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Your Personal Gallery</h1>
//                         <p className="text-gray-500">Curated based on your love for {preferences.styles.join(", ")}</p>
//                     </div>
//                     <Link
//                         href="/onboarding"
//                         className="text-sm font-bold text-indigo-600 hover:text-indigo-500 flex items-center gap-2 group"
//                     >
//                         Update Preferences
//                         <span className="group-hover:translate-x-1 transition-transform">→</span>
//                     </Link>
//                 </header>

//                 {artworks.length > 0 ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                         {artworks.map((art: any) => (
//                             <ArtCard
//                                 key={art.id}
//                                 artwork={{
//                                     ...art,
//                                     isLiked: likedIds.has(art.id)
//                                 }}
//                             />
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
//                         <h3 className="text-2xl font-bold text-gray-900 mb-4">No exact matches found</h3>
//                         <p className="text-gray-600 mb-8 mx-auto max-w-sm">We're still growing our collection. Try updating your preferences to see more results.</p>
//                         <Link
//                             href="/onboarding"
//                             className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all"
//                         >
//                             Adjust Preferences
//                         </Link>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import ArtCard from "@/components/ui/ArtCard";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function DashboardPage() {
    const [artworks, setArtworks] = useState<any[]>([]);
    const [styles, setStyles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadGallery = async () => {
            try {
                const res = await fetch("/api/user/preferences");
                if (res.ok) {
                    const data = await res.json();
                    setArtworks(data.artworks);
                    setStyles(data.userStyles);
                }
            } catch (err) {
                console.error("Failed to load gallery", err);
            } finally {
                setLoading(false);
            }
        };
        loadGallery();
    }, []);

    return (
        <div className="min-h-screen bg-white text-black">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 py-12">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">FOR YOU</h1>
                        <p className="text-gray-500 font-medium">
                            {loading ? "Curating your collection..." : `Based on your interest in ${styles.join(", ")}`}
                        </p>
                    </div>
                    <Link href="/preferences" className="text-indigo-600 font-bold hover:underline">
                        Update Preferences →
                    </Link>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-gray-100 aspect-[4/5] rounded-[2.5rem]" />
                        ))}
                    </div>
                ) : artworks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {artworks.map((art) => (
                            <ArtCard key={art.id} artwork={art} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                        <h3 className="text-xl font-bold mb-4">No exact matches yet</h3>
                        <Link href="/onboarding" className="bg-black text-white px-8 py-3 rounded-2xl">
                            Broaden Preferences
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}