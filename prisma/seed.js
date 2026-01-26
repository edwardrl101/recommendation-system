const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const artworks = [
    {
        title: "Neon Horizon",
        artist: "Alex Vance",
        imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab",
        price: 1200,
        tags: ["Abstract", "Contemporary", "Minimalist"],
    },
    {
        title: "Urban Silence",
        artist: "Maya Chen",
        imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5",
        price: 3500,
        tags: ["Minimalist", "Photography", "Street Art"],
    },
    {
        title: "Celestial Flow",
        artist: "Julian Thorne",
        imageUrl: "https://images.unsplash.com/photo-1501472312651-726afe119ff1",
        price: 8500,
        tags: ["Abstract", "Surrealism", "Impressionism"],
    },
    {
        title: "Pop Culture Echo",
        artist: "Luna Rossi",
        imageUrl: "https://images.unsplash.com/photo-1493333858332-68adc8edeaf7",
        price: 450,
        tags: ["Pop Art", "Contemporary"],
    },
    {
        title: "The Silent Watcher",
        artist: "Elena Petrov",
        imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
        price: 15000,
        tags: ["Classic", "Surrealism"],
    },
    {
        title: "Geometric Rhythm",
        artist: "David Ko",
        imageUrl: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb",
        price: 2800,
        tags: ["Abstract", "Minimalist", "Modern"],
    },
    {
        title: "Street Dreams",
        artist: "Ghost 7",
        imageUrl: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8",
        price: 950,
        tags: ["Street Art", "Pop Art"],
    },
    {
        title: "Ethereal Landscape",
        artist: "Sarah Miller",
        imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19",
        price: 5200,
        tags: ["Impressionism", "Contemporary"],
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
