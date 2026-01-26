"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
                            Art Curator AI
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                                    <span className="text-sm text-gray-500">{session.user?.name || session.user?.email}</span>
                                    <button
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                        className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-500 transition-colors"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
