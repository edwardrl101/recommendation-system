import prisma from "@/lib/prisma";
import Navbar from "@/components/ui/Navbar";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LikeButton from "@/components/ui/LikeButton";

export default async function ArtworkDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const artwork = await prisma.artwork.findUnique({
        where: { id },
        include: {
            artist: {
                select: {
                    name: true,
                    image: true,
                    bio: true
                }
            },
            likes: session?.user?.email ? {
                where: {
                    user: {
                        email: session.user.email
                    }
                }
            } : false
        }
    });

    if (!artwork) {
        notFound();
    }

    const isLiked = artwork.likes && artwork.likes.length > 0;

    return (
        <div className="min-h-screen bg-white text-black">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 py-12">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black mb-12 transition-colors group"
                >
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                    Back to Gallery
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Image Column */}
                    <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                        <Image
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Content Column */}
                    <div className="flex flex-col h-full py-4">
                        <div className="mb-8">
                            <h1 className="text-5xl font-black tracking-tight mb-4 leading-none uppercase">
                                {artwork.title}
                            </h1>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 bg-indigo-50 rounded-2xl flex-1">
                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Artist</p>
                                    <p className="text-xl font-bold">{artwork.artist.name}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl flex-1 border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Price</p>
                                    <p className="text-xl font-black text-gray-900">${artwork.price.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 flex-grow">
                            <section>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Specifications</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 border border-gray-100 rounded-xl">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Medium</p>
                                        <p className="font-medium">{artwork.medium || "Mixed Media"}</p>
                                    </div>
                                    <div className="p-3 border border-gray-100 rounded-xl">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Dimensions</p>
                                        <p className="font-medium">{artwork.dimensions || "Variable"}</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Aesthetic Keywords</h3>
                                <div className="flex flex-wrap gap-2">
                                    {artwork.tags.map(tag => (
                                        <span key={tag} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <section className="p-6 bg-indigo-600 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
                                <h3 className="text-xs font-bold opacity-70 uppercase tracking-widest mb-3">Collector's Note</h3>
                                <p className="text-lg font-medium leading-relaxed italic">
                                    "This piece represents a significant exploration of {artwork.tags[0] || "form"} and {artwork.tags[1] || "structure"}, curated specifically for your aesthetic profile."
                                </p>
                            </section>
                        </div>

                        <div className="mt-12 flex gap-4">
                            <button className="flex-1 bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-all transform active:scale-[0.98] shadow-xl">
                                Acquire Artwork
                            </button>
                            <LikeButton
                                artworkId={artwork.id}
                                initialLiked={isLiked}
                                className="w-20 rounded-2xl border-2"
                                size="lg"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
