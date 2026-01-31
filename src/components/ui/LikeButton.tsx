"use client";

import { useState } from "react";

interface LikeButtonProps {
    artworkId: string;
    initialLiked: boolean;
    className?: string;
    size?: "sm" | "md" | "lg";
}

export default function LikeButton({ artworkId, initialLiked, className = "", size = "md" }: LikeButtonProps) {
    const [liked, setLiked] = useState(initialLiked);
    const [loading, setLoading] = useState(false);

    const toggleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (loading) return;

        const previousState = liked;
        setLiked(!liked);
        setLoading(true);

        try {
            const res = await fetch(`/api/artwork/${artworkId}/like`, {
                method: "POST",
            });
            if (!res.ok) throw new Error();
        } catch (error) {
            setLiked(previousState);
        } finally {
            setLoading(false);
        }
    };

    const iconSizes = {
        sm: "w-5 h-5",
        md: "w-6 h-6",
        lg: "w-8 h-8"
    };

    return (
        <button
            onClick={toggleLike}
            disabled={loading}
            className={`flex items-center justify-center transition-all ${className} ${liked
                    ? "bg-red-500 text-white shadow-lg border-red-500"
                    : "bg-white/70 backdrop-blur-md text-gray-900 border-gray-100 hover:bg-white hover:scale-110"
                }`}
        >
            <svg
                className={`${iconSizes[size]} ${liked ? "fill-current" : "fill-none"}`}
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
    );
}
