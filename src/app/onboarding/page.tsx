"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";

const ART_STYLES = [
    "Minimalist", "Pop Art", "Impressionism", "Abstract",
    "Contemporary", "Street Art", "Classic", "Surrealism"
];

const BUDGET_RANGES = [
    { label: "Under $500", value: "0-500" },
    { label: "$500 - $2,000", value: "500-2000" },
    { label: "$2,000 - $10,000", value: "2000-10000" },
    { label: "$10,000+", value: "10000+" },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [preferences, setPreferences] = useState({
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
        try {
            const res = await fetch("/api/user/preferences", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(preferences),
            });

            if (res.ok) {
                router.push("/dashboard");
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
                    <div className="mb-10 text-center">
                        <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase">Step {step} of 2</span>
                        <h1 className="text-3xl font-bold mt-4">
                            {step === 1 ? "What's your preferred budget?" : "Which styles do you love?"}
                        </h1>
                    </div>

                    {step === 1 ? (
                        <div className="grid gap-4">
                            {BUDGET_RANGES.map((range) => (
                                <button
                                    key={range.value}
                                    onClick={() => setPreferences({ ...preferences, budget: range.value })}
                                    className={`w-full p-6 text-left rounded-2xl border-2 transition-all ${preferences.budget === range.value
                                            ? "border-indigo-600 bg-indigo-50 ring-4 ring-indigo-100"
                                            : "border-gray-100 hover:border-indigo-200 hover:bg-gray-50"
                                        }`}
                                >
                                    <p className={`text-lg font-bold ${preferences.budget === range.value ? "text-indigo-600" : "text-gray-900"}`}>
                                        {range.label}
                                    </p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {ART_STYLES.map((style) => (
                                <button
                                    key={style}
                                    onClick={() => toggleStyle(style)}
                                    className={`p-4 text-center rounded-2xl border-2 transition-all ${preferences.styles.includes(style)
                                            ? "border-indigo-600 bg-indigo-50 font-bold text-indigo-600 ring-4 ring-indigo-100"
                                            : "border-gray-100 hover:border-indigo-200"
                                        }`}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="mt-12 flex justify-between gap-4">
                        {step === 2 && (
                            <button
                                onClick={() => setStep(1)}
                                className="px-8 py-4 font-bold text-gray-400 hover:text-gray-600"
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={step === 1 ? () => setStep(2) : handleSave}
                            disabled={step === 1 ? !preferences.budget : preferences.styles.length === 0 || loading}
                            className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-500 transition-all shadow-lg disabled:bg-indigo-100 disabled:shadow-none"
                        >
                            {loading ? "Saving..." : step === 1 ? "Next Step" : "Find My Art"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
