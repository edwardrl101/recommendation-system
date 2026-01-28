"use client";
import { useSession } from "next-auth/react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";

const ART_STYLES = [
    "Minimalist", "Pop Art", "Impressionism", "Abstract",
    "Contemporary", "Street Art", "Classic", "Surrealism",
    "Cyberpunk", "Art Deco", "Expressionism", "Renaissance",
    "Bauhaus", "Baroque", "Photography", "Sculpture"
];

const CONTEXTS = [
    { label: "🏡 Home", value: "home", description: "Warm and personal spaces" },
    { label: "🏢 Office", value: "office", description: "Professional and inspiring" },
    { label: "🖼️ Collection", value: "collection", description: "Building a curated portfolio" }
];

const BUDGET_RANGES = [
    { label: "Under $500", value: "0-500" },
    { label: "$500 - $2,000", value: "500-2000" },
    { label: "$2,000 - $10,000", value: "2000-10000" },
    { label: "$10,000+", value: "10000+" },
];

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session, update, status } = useSession();
    const [step, setStep] = useState(0);
    const [role, setRole] = useState<"COLLECTOR" | "ARTIST" | null>(null);
    const [preferences, setPreferences] = useState({
        context: "",
        budget: "",
        styles: [] as string[],
    });
    const [loading, setLoading] = useState(false);

    const toggleStyle = (style: string) => {
        setPreferences(prev => ({
            ...prev,
            styles: prev.styles.includes(style)
                ? prev.styles.filter(s => s !== style)
                : [...prev.styles, style]
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        console.log("Sending to API:", { role, ...preferences });
        try {
            const res = await fetch("/api/user/preferences", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role, ...preferences }),
            });

            if (res.ok) {
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        role: role,
                        onboarded: true
                    }
                });

                if (role === "ARTIST") {
                    router.push("/artist/dashboard");
                } else {
                    router.push("/dashboard");
                }
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to save preferences", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-black">
            <Navbar />
            <div className="max-w-2xl mx-auto py-16 px-4">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 transition-all">
                    
                    {/* Progress Indicator */}
                    <div className="mb-10 text-center">
                        <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase">
                            Step {step + 1} of 4
                        </span>
                        <h1 className="text-3xl font-bold mt-4">
                            {step === 0 && "Welcome! How will you use the platform?"}
                            {step === 1 && "Where will this art be displayed?"}
                            {step === 2 && "What is your preferred budget?"}
                            {step === 3 && "Which styles speak to you?"}
                        </h1>
                    </div>

                    {/* Step 0: Role Selection */}
                    {step === 0 && (
                        <div className="grid gap-4">
                            <button onClick={() => { setRole("COLLECTOR"); setStep(1); }}
                                className="p-8 border-2 rounded-2xl text-left hover:border-indigo-600 transition-all group">
                                <h3 className="text-xl font-bold group-hover:text-indigo-600">I am a Collector</h3>
                                <p className="text-gray-500">I want to discover and buy unique art.</p>
                            </button>
                            <button onClick={() => { setRole("ARTIST"); setStep(1); }}
                                className="p-8 border-2 rounded-2xl text-left hover:border-indigo-600 transition-all group">
                                <h3 className="text-xl font-bold group-hover:text-indigo-600">I am an Artist</h3>
                                <p className="text-gray-500">I want to showcase and sell my work.</p>
                            </button>
                        </div>
                    )}

                    {/* Step 1: Context (Only for Collector) */}
                    {step === 1 && (
                        <div className="grid gap-4">
                            {CONTEXTS.map((ctx) => (
                                <button key={ctx.value} onClick={() => setPreferences({ ...preferences, context: ctx.value })}
                                    className={`w-full p-6 text-left rounded-2xl border-2 transition-all ${preferences.context === ctx.value ? "border-indigo-600 bg-indigo-50" : "border-gray-100"}`}>
                                    <p className="text-lg font-bold">{ctx.label}</p>
                                    <p className="text-sm text-gray-500">{ctx.description}</p>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 2: Budget */}
                    {step === 2 && (
                        <div className="grid gap-4">
                            {BUDGET_RANGES.map((range) => (
                                <button key={range.value} onClick={() => setPreferences({ ...preferences, budget: range.value })}
                                    className={`w-full p-6 text-left rounded-2xl border-2 transition-all ${preferences.budget === range.value ? "border-indigo-600 bg-indigo-50" : "border-gray-100"}`}>
                                    <p className="text-lg font-bold">{range.label}</p>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 3: Styles */}
                    {step === 3 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {ART_STYLES.map((style) => (
                                <button key={style} onClick={() => toggleStyle(style)}
                                    className={`p-3 text-sm rounded-xl border-2 transition-all ${preferences.styles.includes(style) ? "border-indigo-600 bg-indigo-50 font-bold" : "border-gray-100"}`}>
                                    {style}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Navigation */}
                    {step > 0 && (
                        <div className="mt-12 flex justify-between gap-4">
                            <button onClick={() => setStep(step - 1)} className="px-8 py-4 font-bold text-gray-400">Back</button>
                            <button
                                onClick={step === 3 ? handleSave : () => setStep(step + 1)}
                                disabled={loading}
                                className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg"
                            >
                                {loading ? "Saving..." : step === 3 ? "Find My Art" : "Next Step"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}