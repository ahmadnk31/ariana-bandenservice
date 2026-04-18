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
        { name: 'Nieuws', description: 'Laatste updates en nieuws over Gent Bandenservice' },
        { name: 'Onderhoud', description: 'Tips en handleidingen voor banden- en auto-onderhoud' },
        { name: 'Tips', description: 'Handige tips voor het kiezen en verzorgen van banden' },
        { name: 'Veiligheid', description: 'Belangrijke veiligheidsinformatie voor bestuurders' },
        { name: 'Promoties', description: 'Speciale aanbiedingen en seizoensgebonden promoties' },
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
