import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ARTIST") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const artworks = await prisma.artwork.findMany({
      where: { artistId: (session.user as any).id },
      include: {
        artist: true,
        likes: true, // Include likes so the count works
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(artworks);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ARTIST") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const tagsRaw = formData.get("tags") as string;
    const tagsArray = tagsRaw 
    ? tagsRaw.split(",").map(t => t.trim().toLowerCase()).filter(t => t !== "") 
    : [];

    // 1. Convert File to ArrayBuffer for Supabase
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${session.user.id}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

    // 2. Upload to Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("artwork")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
        console.error("SUPABASE STORAGE ERROR:", uploadError);
        return NextResponse.json({ message: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from("artwork").getPublicUrl(fileName);

    // 3. Save to DB
    const newArtwork = await prisma.artwork.create({
      data: {
        title,
        price,
        imageUrl: publicUrl,
        artistId: (session.user as any).id,
        medium: formData.get("medium") as string || "Unknown",
        dimensions: formData.get("dimensions") as string || "N/A",
        tags: tagsArray,
      },
    });

    return NextResponse.json({ message: "Success", artwork: newArtwork });

  } catch (error: any) {
    console.error("FULL API ERROR:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}