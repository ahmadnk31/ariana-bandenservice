import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding local SEO blog posts...');

    // Get categories first
    const newsCat = await prisma.blogCategory.findUnique({ where: { slug: 'nieuws' } });
    const maintenanceCat = await prisma.blogCategory.findUnique({ where: { slug: 'onderhoud' } });
    const tipsCat = await prisma.blogCategory.findUnique({ where: { slug: 'tips' } });

    const posts = [
        {
            title: 'Waar banden wisselen in Gent? De beste opties op een rij',
            slug: 'waar-banden-wisselen-in-gent',
            excerpt: 'Bent u op zoek naar een betrouwbare plek om uw banden te laten wisselen in Gent? In dit artikel bespreken we de beste opties, van Sint-Amandsberg tot Oostakker.',
            content: `
                <h2>Bandenwissel in Gent: Kwaliteit en Lokale Service</h2>
                <p>Het wisselen van uw autobanden is een essentieel onderdeel van het onderhoud van uw voertuig, vooral bij de overgang tussen zomer- en winterseizoenen. Voor inwoners van Gent is het belangrijk om een plek te vinden die niet alleen deskundig is, maar ook gemakkelijk bereikbaar.</p>
                
                <h3>Waarom kiezen voor een lokale bandencentrale?</h3>
                <p>Een lokale bandencentrale zoals <strong>Gent Bandenservice</strong> in Sint-Amandsberg biedt tal van voordelen. U hoeft niet ver te rijden en u steunt de lokale economie. Wij bedienen niet alleen het centrum van Gent, maar ook omliggende deelgemeenten zoals:</p>
                <ul>
                    <li>Sint-Amandsberg</li>
                    <li>Oostakker</li>
                    <li>Destelbergen</li>
                    <li>Gentbrugge</li>
                    <li>Ledeberg</li>
                </ul>

                <h3>Wat kost een bandenwissel in Gent?</h3>
                <p>Bij Gent Bandenservice hanteren we transparante prijzen. Montage en balanceren begint al vanaf <strong>€25 per band</strong>. Dit maakt ons een van de meest competitieve spelers in de regio.</p>
                
                <p>Wilt u direct een afspraak maken? Bezoek onze <a href="/nl/tires">bandenpagina</a> of neem telefonisch contact op via +32 466 19 56 22.</p>
            `,
            locale: 'nl',
            status: 'published',
            categoryId: maintenanceCat?.id,
            metaTitle: 'Waar banden wisselen in Gent? | Gent Bandenservice',
            metaDescription: 'Zoekt u een plek om banden te wisselen in Gent? Ontdek waarom Gent Bandenservice in Sint-Amandsberg de beste keuze is voor kwaliteit en prijs.',
            author: 'Gent Bandenservice',
            readingTime: 3,
            publishedAt: new Date(),
        },
        {
            title: 'Goedkoopste banden in Sint-Amandsberg: Waar moet u op letten?',
            slug: 'goedkoopste-banden-sint-amandsberg',
            excerpt: 'Op zoek naar de scherpste prijzen voor autobanden in Sint-Amandsberg? Wij leggen uit hoe u kunt besparen zonder in te leveren op veiligheid.',
            content: `
                <h2>Bespaar op uw banden in Sint-Amandsberg</h2>
                <p>Iedereen wil de beste deal wanneer het tijd is voor nieuwe autobanden. In Sint-Amandsberg zijn er verschillende opties, maar hoe weet u zeker dat u de goedkoopste banden van de hoogste kwaliteit krijgt?</p>
                
                <h3>Nieuwe vs. Tweedehands banden</h3>
                <p>Bij Gent Bandenservice bieden we zowel nieuwe als zorgvuldig gecontroleerde tweedehands banden aan. Tweedehands banden kunnen een uitstekende manier zijn om te besparen, mits ze voldoen aan de wettelijke veiligheidseisen.</p>

                <h3>Onze prijzen in Sint-Amandsberg</h3>
                <ul>
                    <li><strong>Check-up:</strong> Gratis bij elke montage</li>
                    <li><strong>Montage:</strong> Vanaf €25</li>
                    <li><strong>Tweedehands banden:</strong> Scherpe prijzen op basis van profieldiepte</li>
                </ul>

                <p>Wij zijn gevestigd aan de Dendermondsesteenweg 428 in Sint-Amandsberg. Kom gerust langs voor advies op maat of bekijk onze <a href="/nl/services">diensten</a> voor meer informatie over montage en uitlijning.</p>
            `,
            locale: 'nl',
            status: 'published',
            categoryId: tipsCat?.id,
            metaTitle: 'Goedkoopste banden in Sint-Amandsberg | Gent Bandenservice',
            metaDescription: 'Vind de goedkoopste banden in Sint-Amandsberg. Tips over nieuwe en tweedehands banden en waarom Gent Bandenservice de beste deal biedt.',
            author: 'Gent Bandenservice',
            readingTime: 4,
            publishedAt: new Date(),
        }
    ];

    for (const post of posts) {
        await prisma.blogPost.upsert({
            where: { slug: post.slug },
            update: post,
            create: post,
        });
    }

    console.log(`Successfully seeded ${posts.length} local SEO blog posts.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
