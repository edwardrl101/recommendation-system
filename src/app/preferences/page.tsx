"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";

const ART_STYLES = ["Minimalist", "Pop Art", "Impressionism", "Abstract", "Contemporary", "Street Art", "Classic", "Surrealism", "Cyberpunk", "Art Deco", "Expressionism", "Renaissance", "Bauhaus", "Baroque", "Photography", "Sculpture"];

const CONTEXTS = [
    { label: "🏡 Home", value: "home", description: "Warm and personal" },
    { label: "🏢 Office", value: "office", description: "Professional space" },
    { label: "🖼️ Collection", value: "collection", description: "Curated portfolio" }
];

const BUDGET_RANGES = [
    { label: "Under $500", value: "0-500" },
    { label: "$500 - $2k", value: "500-2000" },
    { label: "$2k - $10k", value: "2000-10000" },
    { label: "$10k+", value: "10000+" },
];

export default function PreferencesPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [prefs, setPrefs] = useState({
        context: "",
        budget: "",
        styles: [] as string[]
    });
    const [saving, setSaving] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        if (session?.user && !hasLoaded) {
            const userPrefs = session.user.preferences;
            if (userPrefs) {
                setPrefs(userPrefs);
                setHasLoaded(true);
            }
        }
    }, [session, hasLoaded]);

    const toggleStyle = (style: string) => {
        setPrefs(prev => {
            const currentStyles = prev.styles || [];
            const isSelected = currentStyles.includes(style);
            return {
                ...prev,
                styles: isSelected
                    ? currentStyles.filter(s => s !== style)
                    : [...currentStyles, style]
            };
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/user/preferences", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...prefs }),
            });

            if (res.ok) {
                await update();
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-10">
                    <h1 className="text-4xl text-black font-black tracking-tighter">PREFERENCES</h1>
                    <p className="text-gray-500">Fine-tune your discovery engine.</p>
                </div>

                <div className="space-y-12 bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100">
                    {/* SECTION 1: CONTEXT */}
                    <section>
                        <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-6">1. Display Context</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {CONTEXTS.map(ctx => (
                                <button key={ctx.value} onClick={() => setPrefs({ ...prefs, context: ctx.value })}
                                    className={`p-5 rounded-2xl border-2 text-left transition-all ${prefs.context === ctx.value ? "border-black bg-black text-black" : "border-gray-100 hover:border-gray-300"}`}>
                                    <p className="font-bold text-black">{ctx.label}</p>
                                    <p className={`text-xs ${prefs.context === ctx.value ? "text-black" : "text-black"}`}>{ctx.description}</p>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* SECTION 2: BUDGET */}
                    <section>
                        <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-6">2. Investment Range</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {BUDGET_RANGES.map(r => (
                                <button key={r.value} onClick={() => setPrefs({ ...prefs, budget: r.value })}
                                    className={`p-4 rounded-2xl border-2 text-black font-bold transition-all ${prefs.budget === r.value ? "border-black bg-black text-black" : "border-gray-100 hover:border-gray-300"}`}>
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* SECTION 3: STYLES */}
                    <section>
                        <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-6">3. Aesthetic Interest</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {ART_STYLES.map(style => (
                                <button key={style} onClick={() => toggleStyle(style)}
                                    className={`p-3 text-black text-sm rounded-xl border-2 transition-all font-medium ${prefs.styles.includes(style) ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-100 hover:border-gray-200"}`}>
                                    {style}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            {/* ACTION BUTTON */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-center">
                <div className="max-w-4xl w-full flex gap-4">
                    <button onClick={() => router.back()} className="px-8 py-4 font-bold text-gray-500 hover:text-black transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-black text-blue py-4 rounded-2xl font-bold text-lg shadow-xl shadow-black/10 hover:bg-gray-900 transition-all disabled:bg-gray-400"
                    >
                        {saving ? "Saving Changes..." : "Apply Preferences"}
                    </button>
                </div>
            </div>
        </div>
    );
}