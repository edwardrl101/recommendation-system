/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ART_STYLES = ["Minimalist", "Pop Art", "Impressionism", "Abstract", "Contemporary", "Street Art", "Classic", "Surrealism", "Cyberpunk", "Art Deco", "Expressionism", "Renaissance", "Bauhaus", "Baroque", "Photography", "Sculpture"];

const ADJECTIVES = ["Luminous", "Ethereal", "Urban", "Celestial", "Neon", "Silent", "Vibrant", "Geometric", "Digital", "Radiant", "Obscure", "Fading", "Golden", "Wandering", "Velvet", "Prismatic", "Industrial", "Organic", "Infinite", "Ephemeral"];
const NOUNS = ["Cityscape", "Whisper", "Vibes", "Horizon", "Symphony", "Structure", "Paradox", "Journey", "Solitude", "Rhythm", "Chaos", "Harmony", "Echo", "Dream", "Memories", "Reflections", "Portal", "Sequence", "Fragment", "Identity"];

const UNSPLASH_IDS = [
    "1541701494587-cb58502866ab", "1549490349-8643362247b5", "1501472312651-726afe119ff1",
    "1493333858332-68adc8edeaf7", "1579783902614-a3fb3927b6a5", "1543857778-c4a1a3e0b2eb",
    "1499781350541-7783f6c6a0c8", "1541963463532-d68292c34b19", "1550684848-fac1c5b4e853",
    "1506744038136-46273834b3fb", "1515405290389-35a766f29d4c", "1514343234326-4b680b59067c",
    "1497215728101-856f4ea42174", "1507646227500-4d389b0bb12a", "1523726491678-bf852e717f6a",
    "1541185933-ef5d8ed016c2", "1533154683836-84ea7a0bc310", "1525909002150-b3b3ef9a8686",
    "1502691876148-a841467bd0f5", "1513519245088-0e12902e5a38"
];

const MEDIUMS = ["Oil on Canvas", "Digital Illustration", "Mixed Media", "Acrylic on Wood", "Fine Art Photography", "Watercolor", "Graphic Print", "Sculpture"];
const DIMENSIONS = ["24 x 36 in", "40 x 40 in", "12 x 18 in", "60 x 48 in", "36 x 36 in", "20 x 24 in"];

async function main() {
    console.log('--- START BULK SEEDING ---');

    // 1. Create Artists
    console.log('Creating artists...');
    const artists = [];
    const artistData = [
        { name: "Julian Thorne", email: "thone.julian@art.com" },
        { name: "Elena Petrov", email: "epetrov@classic.org" },
        { name: "Satoshi Nakamoto", email: "k0de@cyber.net" },
        { name: "Isabella Rossi", email: "bella@italy.art" },
        { name: "Marcus Webb", email: "mwebb@studio.com" }
    ];

    for (const data of artistData) {
        const artist = await prisma.user.upsert({
            where: { email: data.email },
            update: {},
            create: {
                name: data.name,
                email: data.email,
                password: "hashed_dummy_password", // Not for login, just for DB integrity
                role: "ARTIST",
                onboarded: true
            }
        });
        artists.push(artist);
        console.log(`- Artist created/found: ${artist.name}`);
    }

    // 2. Clear previous artworks for testing
    console.log('Clearing old artworks...');
    await prisma.artwork.deleteMany();

    // 3. Generate 110 Artworks
    console.log('Generating 110 unique artworks...');
    const artworksToCreate = [];

    for (let i = 0; i < 110; i++) {
        const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
        const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
        const style1 = ART_STYLES[Math.floor(Math.random() * ART_STYLES.length)];
        const style2 = ART_STYLES[Math.floor(Math.random() * ART_STYLES.length)];
        const artist = artists[Math.floor(Math.random() * artists.length)];
        const unsplashId = UNSPLASH_IDS[i % UNSPLASH_IDS.length];

        artworksToCreate.push({
            title: `${adj} ${noun} ${i + 1}`,
            artistId: artist.id,
            imageUrl: `https://images.unsplash.com/photo-${unsplashId}`,
            price: Math.floor(Math.random() * (15000 - 200) + 200),
            medium: MEDIUMS[Math.floor(Math.random() * MEDIUMS.length)],
            dimensions: DIMENSIONS[Math.floor(Math.random() * DIMENSIONS.length)],
            tags: Array.from(new Set([style1, style2])),
            emotions: {
                "vibrant": Math.random().toFixed(2),
                "calming": Math.random().toFixed(2),
                "industrial": Math.random().toFixed(2)
            }
        });
    }

    console.log('Inserting into database...');
    // Sequential insertion for progress tracking (or createMany if DB supports it without issues)
    for (const art of artworksToCreate) {
        await prisma.artwork.create({
            data: art
        });
    }

    const count = await prisma.artwork.count();
    console.log(`--- SEEDING COMPLETE: ${count} artworks created ---`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
