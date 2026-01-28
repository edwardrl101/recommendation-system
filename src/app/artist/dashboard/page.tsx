"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import { useRouter } from "next/navigation";

export default function ArtistDashboard() {
    const router = useRouter();
    const [artworks, setArtworks] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        medium: "",
        dimensions: "",
        tags: "",
    });

    const fetchArtworks = async () => {
        try {
            const res = await fetch("/api/artist/artwork");
            if (res.ok) {
                const data = await res.json();
                setArtworks(data);
            }
        } catch (error) {
            console.error("Error fetching art:", error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => { fetchArtworks(); }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert("Please select an image");

        setLoading(true);
        const data = new FormData();
        data.append("file", file);
        Object.entries(formData).forEach(([key, val]) => data.append(key, val));

        try {
            const res = await fetch("/api/artist/artwork", {
                method: "POST",
                body: data,
            });

            if (res.ok) {
                setIsUploading(false);
                setFile(null);
                setPreview(null);
                setFormData({ title: "", price: "", medium: "", dimensions: "", tags: "" });
                fetchArtworks();
                router.refresh();
            } else {
                const err = await res.json();
                alert(`Upload failed: ${err.message}`);
            }
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-50 text-black">
            <Navbar />
            <main className="max-w-7xl mx-auto py-12 px-6">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Artist Studio</h1>
                        <p className="text-gray-500 mt-2">Manage your collection and track your reach.</p>
                    </div>
                    <button 
                        onClick={() => setIsUploading(true)}
                        className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                    >
                        + List New Work
                    </button>
                </div>

                {/* GALLERY GRID */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 min-h-[500px]">
                    <h2 className="text-xl font-bold mb-8">Published Portfolio</h2>
                    
                    {fetching ? (
                        <div className="flex justify-center py-20 italic text-gray-400">Loading gallery...</div>
                    ) : artworks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {artworks.map((art) => (
                                <div key={art.id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
                                    <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                                        <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                            ❤️ {art.likes?.length || 0}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-xl text-gray-900">{art.title}</h3>
                                                <p className="text-indigo-600 text-sm font-medium">
                                                    by {art.artist?.name || "Unknown Artist"}
                                                </p>
                                            </div>
                                            <span className="text-indigo-600 font-bold">${art.price}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-4">
                                            {art.medium} • Published {new Date(art.createdAt).toLocaleDateString()}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {art.tags?.map((tag: string) => (
                                                <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-medium">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-gray-100 rounded-[2rem]">
                            <p className="text-gray-400 mb-4">No artworks found.</p>
                            <button onClick={() => setIsUploading(true)} className="text-indigo-600 font-bold hover:underline">Start your first listing</button>
                        </div>
                    )}
                </div>

                {/* MODAL */}
                {isUploading && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" onClick={() => setIsUploading(false)} />
                        
                        <div className="relative bg-white rounded-[3rem] p-8 md:p-12 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh] z-[101]" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-black italic">NEW LISTING</h2>
                                <button onClick={() => setIsUploading(false)} className="text-gray-400 hover:text-black text-2xl">✕</button>
                            </div>
                            
                            <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1">
                                    <div className="relative border-2 border-dashed border-gray-200 rounded-[2rem] aspect-square flex flex-col items-center justify-center bg-gray-50 overflow-hidden group hover:border-indigo-400">
                                        {preview ? (
                                            <div className="relative w-full h-full">
                                                <img src={preview} className="w-full h-full object-cover" alt="preview" />
                                                <button type="button" onClick={() => {setFile(null); setPreview(null);}} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full text-xs">✕</button>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer flex flex-col items-center p-6 text-center w-full h-full justify-center">
                                                <span className="text-indigo-600 font-bold mb-2">Select Image</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="col-span-1 space-y-4">
                                    <input type="text" placeholder="Title" required className="w-full p-4 rounded-2xl bg-gray-100 outline-indigo-500" onChange={e => setFormData({...formData, title: e.target.value})} />
                                    <input type="number" placeholder="Price ($)" required className="w-full p-4 rounded-2xl bg-gray-100 outline-indigo-500" onChange={e => setFormData({...formData, price: e.target.value})} />
                                    <input type="text" placeholder="Medium" className="w-full p-4 rounded-2xl bg-gray-100 outline-indigo-500" onChange={e => setFormData({...formData, medium: e.target.value})} />
                                    <input type="text" placeholder="Dimensions" className="w-full p-4 rounded-2xl bg-gray-100 outline-indigo-500" onChange={e => setFormData({...formData, dimensions: e.target.value})} />
                                    <input type="text" placeholder="Tags (comma separated)" className="w-full p-4 rounded-2xl bg-gray-100 outline-indigo-500" onChange={e => setFormData({...formData, tags: e.target.value})} />
                                </div>

                                <div className="pt-4 shrink-0">
                                    <button 
                                        type="submit" 
                                        disabled={loading} 
                                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 active:scale-[0.98] disabled:bg-gray-300 shadow-lg transition-all"
                                    >
                                        {loading ? "PROCESSING..." : "PUBLISH TO GALLERY"}
                                    </button>
                                    <p className="text-center text-gray-400 text-xs mt-4 italic">Verify all details before publishing.</p>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}