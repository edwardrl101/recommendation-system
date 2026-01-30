/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const artworks = [
    {
        title: "Neon Horizon",
        artist: "Alex Vance",
        imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab",
        price: 1200,
        tags: ["Abstract", "Contemporary", "Minimalist", "Cyberpunk"],
        emotions: { "energetic": 0.8, "vibrant": 0.9, "calm": 0.1 }
    },
    {
        title: "Urban Silence",
        artist: "Maya Chen",
        imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5",
        price: 3500,
        tags: ["Minimalist", "Photography", "Street Art"],
        emotions: { "calm": 0.9, "melancholy": 0.4, "minimal": 0.8 }
    },
    {
        title: "Celestial Flow",
        artist: "Julian Thorne",
        imageUrl: "https://images.unsplash.com/photo-1501472312651-726afe119ff1",
        price: 8500,
        tags: ["Abstract", "Surrealism", "Impressionism"],
        emotions: { "dreamy": 0.9, "peaceful": 0.7, "mystical": 0.8 }
    },
    {
        title: "Pop Culture Echo",
        artist: "Luna Rossi",
        imageUrl: "https://images.unsplash.com/photo-1493333858332-68adc8edeaf7",
        price: 450,
        tags: ["Pop Art", "Contemporary", "Street Art"],
        emotions: { "playful": 0.8, "energetic": 0.7, "bold": 0.9 }
    },
    {
        title: "The Silent Watcher",
        artist: "Elena Petrov",
        imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
        price: 15000,
        tags: ["Classic", "Surrealism", "Renaissance", "Baroque"],
        emotions: { "serious": 0.7, "majestic": 0.8, "somber": 0.5 }
    },
    {
        title: "Geometric Rhythm",
        artist: "David Ko",
        imageUrl: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb",
        price: 2800,
        tags: ["Abstract", "Minimalist", "Modern", "Bauhaus"],
        emotions: { "balanced": 0.9, "structured": 0.8, "clean": 0.9 }
    },
    {
        title: "Street Dreams",
        artist: "Ghost 7",
        imageUrl: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8",
        price: 950,
        tags: ["Street Art", "Pop Art", "Expressionism"],
        emotions: { "raw": 0.8, "rebellious": 0.9, "vivid": 0.7 }
    },
    {
        title: "Ethereal Landscape",
        artist: "Sarah Miller",
        imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19",
        price: 5200,
        tags: ["Impressionism", "Contemporary", "Expressionism"],
        emotions: { "serene": 0.9, "soft": 0.8, "light": 0.7 }
    },
    {
        title: "Digital Awakening",
        artist: "K0de",
        imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853",
        price: 1500,
        tags: ["Cyberpunk", "Contemporary", "Abstract"],
        emotions: { "futuristic": 0.9, "intense": 0.8, "dark": 0.6 }
    },
    {
        title: "Deco Elegance",
        artist: "Victor Wells",
        imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        price: 4200,
        tags: ["Art Deco", "Modern", "Classic"],
        emotions: { "elegant": 0.9, "glamorous": 0.8, "refined": 0.7 }
    }
];

async function main() {
    console.log('Start seeding...');
    await prisma.artwork.deleteMany();

    for (const art of artworks) {
        const artwork = await prisma.artwork.create({
            data: art,
        });
        console.log(`Created artwork with id: ${artwork.id}`);
    }
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
