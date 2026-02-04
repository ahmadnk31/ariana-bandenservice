
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import { PrismaClient } from './app/generated/prisma/client';

dotenv.config();

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

async function verifyData() {
    console.log('🔍 Verifying Falken tire data...\n');

    try {
        // Get count by condition
        const conditionCounts = await prisma.tire.groupBy({
            by: ['condition'],
            where: { brand: 'Falken' },
            _count: { id: true },
            orderBy: { condition: 'asc' }
        });

        console.log('\n🏷️  Count by condition:');
        conditionCounts.forEach(condition => {
            console.log(`   • ${condition.condition === 'new' ? 'Nieuw' : 'Tweedehands'}: ${condition._count.id} variants`);
        });

        // Get total count
        const totalTires = await prisma.tire.count({
            where: { brand: 'Falken' }
        });
        console.log(`📊 Total Falken tires in database: ${totalTires}`);

        // Get count by model
        const modelCounts = await prisma.tire.groupBy({
            by: ['name'],
            where: { brand: 'Falken' },
            _count: { id: true },
            orderBy: { name: 'asc' }
        });

        console.log('\n📈 Count by model:');
        modelCounts.forEach(model => {
            console.log(`   • ${model.name}: ${model._count.id} variants`);
        });

        // Get sample tires for each condition
        console.log('\n🔧 Sample tire specifications by condition:');
        
        const newTire = await prisma.tire.findFirst({
            where: { 
                brand: 'Falken',
                condition: 'new'
            }
        });
        
        const usedTire = await prisma.tire.findFirst({
            where: { 
                brand: 'Falken',
                condition: 'tweedehands'
            }
        });
        
        if (newTire) {
            console.log(`\n   🆕 NIEUW - ${newTire.name} (${newTire.size}):`);
            console.log(`     • Load Index: ${newTire.loadIndex}, Speed Rating: ${newTire.speedRating}`);
            console.log(`     • Price: €${newTire.price}`);
            console.log(`     • Stock: ${newTire.stock}`);
            console.log(`     • DOT: ${newTire.dot}`);
            console.log(`     • Features: ${JSON.parse(newTire.features || '[]').slice(0, 3).join(', ')}`);
        }
        
        if (usedTire) {
            console.log(`\n   ♻️  TWEEDEHANDS - ${usedTire.name} (${usedTire.size}):`);
            console.log(`     • Load Index: ${usedTire.loadIndex}, Speed Rating: ${usedTire.speedRating}`);
            console.log(`     • Price: €${usedTire.price}`);
            console.log(`     • Stock: ${usedTire.stock}`);
            console.log(`     • DOT: ${usedTire.dot}`);
            console.log(`     • Features: ${JSON.parse(usedTire.features || '[]').slice(0, 4).join(', ')}`);
        }

        // Get price range
        const priceStats = await prisma.tire.aggregate({
            where: { brand: 'Falken' },
            _min: { price: true },
            _max: { price: true },
            _avg: { price: true }
        });

        console.log('\n💰 Price statistics:');
        console.log(`   • Min: €${priceStats._min.price}`);
        console.log(`   • Max: €${priceStats._max.price}`);
        console.log(`   • Average: €${Math.round(priceStats._avg.price || 0)}`);

        // Get stock overview
        const stockStats = await prisma.tire.aggregate({
            where: { brand: 'Falken' },
            _sum: { stock: true },
            _avg: { stock: true }
        });

        console.log('\n📦 Stock overview:');
        console.log(`   • Total units in stock: ${stockStats._sum.stock}`);
        console.log(`   • Average per tire: ${Math.round(stockStats._avg.stock || 0)}`);

        // Get popular sizes
        const popularSizes = await prisma.tire.groupBy({
            by: ['size'],
            where: { brand: 'Falken' },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 5
        });

        console.log('\n🎯 Most common sizes:');
        popularSizes.forEach((size, index) => {
            console.log(`   ${index + 1}. ${size.size} (${size._count.id} models)`);
        });

        console.log('\n✅ Data verification complete!');

    } catch (error) {
        console.error('❌ Error verifying data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyData();