import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding blog categories...');

    const categories = [
        { name: 'News', description: 'Latest updates and news about Gent Bandenservice' },
        { name: 'Maintenance', description: 'Tips and guides for tire and car maintenance' },
        { name: 'Tips', description: 'Helpful tips for choosing and caring for tires' },
        { name: 'Safety', description: 'Important safety information for drivers' },
        { name: 'Promotions', description: 'Special offers and seasonal promotions' },
    ];

    for (const category of categories) {
        const slug = category.name.toLowerCase().replace(/ /g, '-');
        await prisma.blogCategory.upsert({
            where: { slug },
            update: { ...category, slug },
            create: { ...category, slug },
        });
    }

    console.log(`Successfully seeded ${categories.length} blog categories.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
