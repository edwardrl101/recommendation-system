"use client";

import Image from "next/image";
import { useState } from "react";

export interface ArtworkProps {
    id: string;
    title: string;
    artist: {
        name: string;
    } | string;
    imageUrl: string;
    price: number;
    tags: string[];
    isLiked?: boolean;
    likes?: { id: string }[];
    medium?: string;
    createdAt?: string | Date;
    recommendationReason?: string;
}

// export default function ArtCard({ artwork }: { artwork: ArtworkProps }) {
//     const [liked, setLiked] = useState(artwork.isLiked || false);

//     const toggleLike = async () => {
//         // Optimistic UI
//         setLiked(!liked);
//         try {
//             await fetch(`/api/artwork/${artwork.id}/like`, {
//                 method: "POST",
//             });
//         } catch (error) {
//             setLiked(liked); // Rollback
//         }
//     };

//     return (
//         <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
//             <div className="relative aspect-[4/5] overflow-hidden">
//                 <Image
//                     src={artwork.imageUrl}
//                     alt={artwork.title}
//                     fill
//                     className="object-cover transition-transform duration-700 group-hover:scale-110"
//                 />
//                 <div className="absolute top-4 right-4">
//                     <button
//                         onClick={toggleLike}
//                         className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${liked
//                                 ? "bg-red-500 text-white shadow-lg"
//                                 : "bg-white/70 text-gray-900 hover:bg-white hover:scale-110"
//                             }`}
//                     >
//                         <svg
//                             className={`w-6 h-6 ${liked ? "fill-current" : "fill-none"}`}
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                             />
//                         </svg>
//                     </button>
//                 </div>
//                 <div className="absolute bottom-4 left-4 flex gap-1 flex-wrap">
//                     {artwork.tags.slice(0, 3).map(tag => (
//                         <span key={tag} className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-700">
//                             {tag}
//                         </span>
//                     ))}
//                 </div>
//             </div>
//             <div className="p-6 flex flex-col flex-grow">
//                 <div className="flex justify-between items-start mb-2">
//                     <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
//                         {artwork.title}
//                     </h3>
//                     <span className="text-lg font-black text-indigo-600">
//                         ${artwork.price.toLocaleString()}
//                     </span>
//                 </div>
//                 <p className="text-gray-500 font-medium mb-4">{artwork.artist}</p>
//                 <button className="w-full mt-auto py-3 bg-gray-50 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-all transform active:scale-95">
//                     View Details
//                 </button>
//             </div>
//         </div>
//     );
// }

export default function ArtCard({ artwork }: { artwork: ArtworkProps }) {
    const [liked, setLiked] = useState(artwork.isLiked || false);

    // Helper to handle both string and object formats
    const artistName = typeof artwork.artist === 'string'
        ? artwork.artist
        : artwork.artist?.name || "Unknown Artist";

    const toggleLike = async () => {
        setLiked(!liked);
        try {
            await fetch(`/api/artwork/${artwork.id}/like`, {
                method: "POST",
            });
        } catch {
            setLiked(liked);
        }
    };

    return (
        <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
            <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                    <button
                        onClick={toggleLike}
                        className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${liked
                            ? "bg-red-500 text-white shadow-lg"
                            : "bg-white/70 text-gray-900 hover:bg-white hover:scale-110"
                            }`}
                    >
                        <svg
                            className={`w-6 h-6 ${liked ? "fill-current" : "fill-none"}`}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </button>
                </div>
                <div className="absolute bottom-4 left-4 flex gap-1 flex-wrap">
                    {artwork.tags?.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-700">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {artwork.title}
                    </h3>
                    <span className="text-lg font-black text-indigo-600">
                        ${artwork.price.toLocaleString()}
                    </span>
                </div>
                <p className="text-gray-500 font-medium mb-2">{artistName}</p>

                {artwork.recommendationReason && (
                    <div className="mt-1 mb-4 p-2 bg-indigo-50 rounded-lg">
                        <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-tight">
                            Why it matches:
                        </p>
                        <p className="text-xs text-indigo-900 italic line-clamp-2">
                            "{artwork.recommendationReason}"
                        </p>
                    </div>
                )}

                <button className="w-full mt-auto py-3 bg-gray-50 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-all transform active:scale-95">
                    View Details
                </button>
            </div>
        </div>
    );
}