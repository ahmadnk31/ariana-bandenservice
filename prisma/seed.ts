import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

async function main() {
    const brands = [
        'Michelin', 'Bridgestone', 'Pirelli', 'Continental', 'Goodyear',
        'Dunlop', 'Yokohama', 'Hankook', 'Toyo', 'Kumho', 'Nokian', 'Vredestein'
    ];

    const modelSuffixes = [
        'Sport', 'Alenza', 'Scorpion', 'ProContact', 'Eagle F1',
        'Grandtrek', 'Geolandar', 'Ventus', 'Proxes', 'Crugen', 'Hakka', 'Quatrac'
    ];

    const seasons = ['summer', 'winter', 'all-season'];
    const rimSizes = [13, 14, 15, 16, 17, 18, 19];
    const aspectRatios = [40, 45, 50, 55, 60, 65, 70];
    const widths = [175, 185, 195, 205, 215, 225, 235, 245, 255];

    console.log('Start seeding 100+ SUV tires...');

    const tires = [];
    let count = 0;

    for (const brand of brands) {
        for (const suffix of modelSuffixes) {
            if (count >= 110) break; // Generate a few more than 100 to be safe

            const modelName = `${brand} ${suffix} SUV`;
            const season = seasons[Math.floor(Math.random() * seasons.length)];
            const rimSize = rimSizes[Math.floor(Math.random() * rimSizes.length)];
            const aspectRatio = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
            const width = widths[Math.floor(Math.random() * widths.length)];

            const loadIndex = Math.floor(Math.random() * (110 - 80) + 80).toString();
            const speedRatings = ['H', 'V', 'W', 'Y'];
            const speedRating = speedRatings[Math.floor(Math.random() * speedRatings.length)];

            const size = `${width}/${aspectRatio} R${rimSize}`;
            const price = Math.floor(Math.random() * (350 - 80) + 80);
            const stock = Math.floor(Math.random() * 50);

            tires.push({
                name: modelName,
                brand,
                season,
                condition: 'new',
                size,
                width,
                aspectRatio,
                rimSize,
                loadIndex,
                speedRating,
                price: parseFloat(price.toFixed(2)),
                stock,
                inStock: stock > 0,
                features: JSON.stringify(['SUV Optimized', 'Premium Grip', 'Durable Sidewall']),
                description: `High-quality ${brand} ${suffix} tire designed for SUVs, providing excellent performance in ${season} conditions.`,
                slug: `${brand.toLowerCase()}-${suffix.toLowerCase()}-suv-${width}-${aspectRatio}-r${rimSize}`.replace(/ /g, '-'),
            });

            count++;
        }
        if (count >= 110) break;
    }

    for (const tire of tires) {
        await prisma.tire.upsert({
            where: { slug: tire.slug },
            update: tire,
            create: tire,
        });
    }

    console.log(`Successfully seeded ${tires.length} SUV tires.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
