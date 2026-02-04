import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding Falken Summer 2025 tire catalog...');

    // Falken summer tire models for 2025
    const falkenModels = [
        {
            name: 'Azenis FK510',
            description: 'Ultra-high-performance summer tire with excellent wet grip and sporty handling characteristics.',
            features: ['High Performance', 'Wet Grip Technology', 'Sporty Handling', 'Silica Compound']
        },
        {
            name: 'Azenis FK460 A/S',
            description: 'High-performance all-season tire with summer-focused compound for year-round versatility.',
            features: ['All-Season Performance', 'Summer Optimized', 'Comfort Ride', 'Long Wearing']
        },
        {
            name: 'Ziex ZE950 A/S',
            description: 'Premium touring tire with excellent summer performance and comfortable ride quality.',
            features: ['Touring Comfort', 'Fuel Efficiency', 'Low Noise', 'Even Wear Pattern']
        },
        {
            name: 'Azenis RT660',
            description: 'Extreme performance summer tire designed for track and autocross use.',
            features: ['Track Performance', 'Maximum Grip', 'Racing Compound', 'Professional Grade']
        },
        {
            name: 'Azenis RT615K+',
            description: 'Competition-grade summer tire for serious enthusiasts and weekend racers.',
            features: ['Competition Ready', 'Extreme Grip', 'Track Tested', 'DOT Approved']
        },
        {
            name: 'Sincera SN250 A/S',
            description: 'Value-oriented touring tire with reliable summer performance and long tread life.',
            features: ['Value Performance', 'Long Tread Life', 'Smooth Ride', 'All-Weather Capable']
        },
        {
            name: 'Wildpeak A/T3W',
            description: 'Rugged all-terrain tire with excellent summer on-road performance for trucks and SUVs.',
            features: ['All-Terrain', 'Truck/SUV', 'Rugged Design', 'On/Off Road']
        },
        {
            name: 'Azenis FK450 A/S',
            description: 'Sport-touring tire combining summer performance with all-season capability.',
            features: ['Sport Touring', 'Enhanced Cornering', 'Wet Performance', 'Refined Ride']
        }
    ];

    // Comprehensive tire size matrix for all vehicle categories
    const tireSizes = [
        // 14" wheels - Economy/vintage cars
        { width: 175, aspectRatio: 70, rimSize: 14, loadIndex: '84', speedRating: 'T' },
        { width: 185, aspectRatio: 70, rimSize: 14, loadIndex: '88', speedRating: 'T' },
        { width: 175, aspectRatio: 65, rimSize: 14, loadIndex: '82', speedRating: 'T' },
        { width: 185, aspectRatio: 65, rimSize: 14, loadIndex: '86', speedRating: 'H' },
        
        // 15" wheels - Compact/entry-level cars
        { width: 175, aspectRatio: 65, rimSize: 15, loadIndex: '84', speedRating: 'H' },
        { width: 185, aspectRatio: 65, rimSize: 15, loadIndex: '88', speedRating: 'H' },
        { width: 185, aspectRatio: 60, rimSize: 15, loadIndex: '84', speedRating: 'H' },
        { width: 195, aspectRatio: 65, rimSize: 15, loadIndex: '91', speedRating: 'H' },
        { width: 195, aspectRatio: 60, rimSize: 15, loadIndex: '88', speedRating: 'V' },
        { width: 205, aspectRatio: 60, rimSize: 15, loadIndex: '91', speedRating: 'V' },
        { width: 195, aspectRatio: 55, rimSize: 15, loadIndex: '85', speedRating: 'V' },
        { width: 205, aspectRatio: 65, rimSize: 15, loadIndex: '94', speedRating: 'H' },
        
        // 16" wheels - Mid-size/mainstream cars
        { width: 185, aspectRatio: 55, rimSize: 16, loadIndex: '83', speedRating: 'V' },
        { width: 195, aspectRatio: 55, rimSize: 16, loadIndex: '87', speedRating: 'V' },
        { width: 205, aspectRatio: 55, rimSize: 16, loadIndex: '91', speedRating: 'V' },
        { width: 215, aspectRatio: 55, rimSize: 16, loadIndex: '93', speedRating: 'V' },
        { width: 225, aspectRatio: 55, rimSize: 16, loadIndex: '95', speedRating: 'V' },
        { width: 205, aspectRatio: 60, rimSize: 16, loadIndex: '92', speedRating: 'V' },
        { width: 215, aspectRatio: 60, rimSize: 16, loadIndex: '95', speedRating: 'H' },
        { width: 225, aspectRatio: 60, rimSize: 16, loadIndex: '98', speedRating: 'H' },
        { width: 215, aspectRatio: 65, rimSize: 16, loadIndex: '98', speedRating: 'H' },
        { width: 225, aspectRatio: 50, rimSize: 16, loadIndex: '92', speedRating: 'W' },
        { width: 205, aspectRatio: 50, rimSize: 16, loadIndex: '87', speedRating: 'W' },
        
        // 17" wheels - Performance/luxury cars  
        { width: 205, aspectRatio: 50, rimSize: 17, loadIndex: '89', speedRating: 'W' },
        { width: 215, aspectRatio: 45, rimSize: 17, loadIndex: '87', speedRating: 'W' },
        { width: 215, aspectRatio: 50, rimSize: 17, loadIndex: '91', speedRating: 'W' },
        { width: 215, aspectRatio: 55, rimSize: 17, loadIndex: '94', speedRating: 'V' },
        { width: 225, aspectRatio: 45, rimSize: 17, loadIndex: '91', speedRating: 'W' },
        { width: 225, aspectRatio: 50, rimSize: 17, loadIndex: '94', speedRating: 'V' },
        { width: 225, aspectRatio: 55, rimSize: 17, loadIndex: '97', speedRating: 'V' },
        { width: 235, aspectRatio: 45, rimSize: 17, loadIndex: '94', speedRating: 'W' },
        { width: 235, aspectRatio: 50, rimSize: 17, loadIndex: '96', speedRating: 'V' },
        { width: 235, aspectRatio: 55, rimSize: 17, loadIndex: '99', speedRating: 'V' },
        { width: 245, aspectRatio: 45, rimSize: 17, loadIndex: '95', speedRating: 'W' },
        { width: 245, aspectRatio: 40, rimSize: 17, loadIndex: '91', speedRating: 'W' },
        { width: 255, aspectRatio: 40, rimSize: 17, loadIndex: '94', speedRating: 'W' },
        
        // 18" wheels - Sports/luxury vehicles
        { width: 215, aspectRatio: 40, rimSize: 18, loadIndex: '85', speedRating: 'W' },
        { width: 225, aspectRatio: 40, rimSize: 18, loadIndex: '88', speedRating: 'Y' },
        { width: 225, aspectRatio: 45, rimSize: 18, loadIndex: '91', speedRating: 'W' },
        { width: 235, aspectRatio: 40, rimSize: 18, loadIndex: '91', speedRating: 'Y' },
        { width: 235, aspectRatio: 45, rimSize: 18, loadIndex: '94', speedRating: 'W' },
        { width: 245, aspectRatio: 35, rimSize: 18, loadIndex: '88', speedRating: 'Y' },
        { width: 245, aspectRatio: 40, rimSize: 18, loadIndex: '93', speedRating: 'Y' },
        { width: 245, aspectRatio: 45, rimSize: 18, loadIndex: '96', speedRating: 'W' },
        { width: 255, aspectRatio: 35, rimSize: 18, loadIndex: '90', speedRating: 'Y' },
        { width: 255, aspectRatio: 40, rimSize: 18, loadIndex: '95', speedRating: 'Y' },
        { width: 265, aspectRatio: 35, rimSize: 18, loadIndex: '93', speedRating: 'Y' },
        { width: 275, aspectRatio: 35, rimSize: 18, loadIndex: '95', speedRating: 'Y' },
        { width: 225, aspectRatio: 50, rimSize: 18, loadIndex: '95', speedRating: 'V' },
        { width: 235, aspectRatio: 50, rimSize: 18, loadIndex: '97', speedRating: 'V' },
        
        // 19" wheels - High-performance vehicles
        { width: 225, aspectRatio: 35, rimSize: 19, loadIndex: '88', speedRating: 'Y' },
        { width: 235, aspectRatio: 35, rimSize: 19, loadIndex: '91', speedRating: 'Y' },
        { width: 245, aspectRatio: 35, rimSize: 19, loadIndex: '93', speedRating: 'Y' },
        { width: 255, aspectRatio: 30, rimSize: 19, loadIndex: '87', speedRating: 'Y' },
        { width: 255, aspectRatio: 35, rimSize: 19, loadIndex: '96', speedRating: 'Y' },
        { width: 265, aspectRatio: 30, rimSize: 19, loadIndex: '89', speedRating: 'Y' },
        { width: 275, aspectRatio: 30, rimSize: 19, loadIndex: '92', speedRating: 'Y' },
        { width: 275, aspectRatio: 35, rimSize: 19, loadIndex: '100', speedRating: 'Y' },
        { width: 285, aspectRatio: 30, rimSize: 19, loadIndex: '94', speedRating: 'Y' },
        { width: 225, aspectRatio: 40, rimSize: 19, loadIndex: '89', speedRating: 'Y' },
        { width: 235, aspectRatio: 40, rimSize: 19, loadIndex: '92', speedRating: 'Y' },
        { width: 245, aspectRatio: 40, rimSize: 19, loadIndex: '94', speedRating: 'Y' },
        { width: 255, aspectRatio: 40, rimSize: 19, loadIndex: '96', speedRating: 'Y' },
        
        // 20" wheels - Luxury/sports vehicles
        { width: 235, aspectRatio: 30, rimSize: 20, loadIndex: '88', speedRating: 'Y' },
        { width: 245, aspectRatio: 30, rimSize: 20, loadIndex: '90', speedRating: 'Y' },
        { width: 255, aspectRatio: 30, rimSize: 20, loadIndex: '92', speedRating: 'Y' },
        { width: 265, aspectRatio: 30, rimSize: 20, loadIndex: '94', speedRating: 'Y' },
        { width: 275, aspectRatio: 30, rimSize: 20, loadIndex: '97', speedRating: 'Y' },
        { width: 285, aspectRatio: 25, rimSize: 20, loadIndex: '87', speedRating: 'Y' },
        { width: 285, aspectRatio: 30, rimSize: 20, loadIndex: '99', speedRating: 'Y' },
        { width: 295, aspectRatio: 25, rimSize: 20, loadIndex: '91', speedRating: 'Y' },
        { width: 235, aspectRatio: 35, rimSize: 20, loadIndex: '92', speedRating: 'Y' },
        { width: 245, aspectRatio: 35, rimSize: 20, loadIndex: '95', speedRating: 'Y' },
        { width: 255, aspectRatio: 35, rimSize: 20, loadIndex: '97', speedRating: 'Y' },
        { width: 265, aspectRatio: 35, rimSize: 20, loadIndex: '99', speedRating: 'Y' },
        
        // 21" wheels - Premium luxury/performance
        { width: 245, aspectRatio: 25, rimSize: 21, loadIndex: '85', speedRating: 'Y' },
        { width: 255, aspectRatio: 25, rimSize: 21, loadIndex: '87', speedRating: 'Y' },
        { width: 275, aspectRatio: 25, rimSize: 21, loadIndex: '92', speedRating: 'Y' },
        { width: 285, aspectRatio: 25, rimSize: 21, loadIndex: '94', speedRating: 'Y' },
        { width: 245, aspectRatio: 30, rimSize: 21, loadIndex: '91', speedRating: 'Y' },
        { width: 255, aspectRatio: 30, rimSize: 21, loadIndex: '93', speedRating: 'Y' },
        { width: 275, aspectRatio: 30, rimSize: 21, loadIndex: '98', speedRating: 'Y' },
        
        // 22" wheels - Ultra-luxury/exotic
        { width: 265, aspectRatio: 25, rimSize: 22, loadIndex: '89', speedRating: 'Y' },
        { width: 285, aspectRatio: 25, rimSize: 22, loadIndex: '95', speedRating: 'Y' },
        { width: 295, aspectRatio: 25, rimSize: 22, loadIndex: '98', speedRating: 'Y' },
        
        // SUV/Crossover sizes
        { width: 225, aspectRatio: 65, rimSize: 16, loadIndex: '100', speedRating: 'H' },
        { width: 235, aspectRatio: 65, rimSize: 16, loadIndex: '103', speedRating: 'H' },
        { width: 235, aspectRatio: 70, rimSize: 16, loadIndex: '106', speedRating: 'H' },
        { width: 245, aspectRatio: 65, rimSize: 16, loadIndex: '107', speedRating: 'H' },
        { width: 245, aspectRatio: 70, rimSize: 16, loadIndex: '107', speedRating: 'H' },
        { width: 225, aspectRatio: 60, rimSize: 17, loadIndex: '99', speedRating: 'H' },
        { width: 235, aspectRatio: 60, rimSize: 17, loadIndex: '102', speedRating: 'H' },
        { width: 245, aspectRatio: 60, rimSize: 17, loadIndex: '105', speedRating: 'H' },
        { width: 255, aspectRatio: 60, rimSize: 17, loadIndex: '106', speedRating: 'H' },
        { width: 265, aspectRatio: 60, rimSize: 17, loadIndex: '108', speedRating: 'H' },
        { width: 275, aspectRatio: 60, rimSize: 17, loadIndex: '110', speedRating: 'H' },
        { width: 235, aspectRatio: 65, rimSize: 17, loadIndex: '104', speedRating: 'H' },
        { width: 245, aspectRatio: 65, rimSize: 17, loadIndex: '107', speedRating: 'H' },
        { width: 265, aspectRatio: 65, rimSize: 17, loadIndex: '112', speedRating: 'H' },
        { width: 225, aspectRatio: 55, rimSize: 18, loadIndex: '98', speedRating: 'V' },
        { width: 235, aspectRatio: 55, rimSize: 18, loadIndex: '100', speedRating: 'V' },
        { width: 245, aspectRatio: 55, rimSize: 18, loadIndex: '103', speedRating: 'V' },
        { width: 255, aspectRatio: 55, rimSize: 18, loadIndex: '109', speedRating: 'V' },
        { width: 265, aspectRatio: 55, rimSize: 18, loadIndex: '109', speedRating: 'V' },
        { width: 235, aspectRatio: 60, rimSize: 18, loadIndex: '103', speedRating: 'H' },
        { width: 245, aspectRatio: 60, rimSize: 18, loadIndex: '105', speedRating: 'H' },
        { width: 255, aspectRatio: 60, rimSize: 18, loadIndex: '108', speedRating: 'H' },
        { width: 265, aspectRatio: 60, rimSize: 18, loadIndex: '110', speedRating: 'H' },
        
        // Large SUV/Truck sizes
        { width: 245, aspectRatio: 50, rimSize: 19, loadIndex: '104', speedRating: 'V' },
        { width: 255, aspectRatio: 50, rimSize: 19, loadIndex: '107', speedRating: 'V' },
        { width: 265, aspectRatio: 50, rimSize: 19, loadIndex: '110', speedRating: 'V' },
        { width: 275, aspectRatio: 50, rimSize: 19, loadIndex: '112', speedRating: 'V' },
        { width: 235, aspectRatio: 55, rimSize: 19, loadIndex: '101', speedRating: 'V' },
        { width: 245, aspectRatio: 55, rimSize: 19, loadIndex: '104', speedRating: 'V' },
        { width: 255, aspectRatio: 55, rimSize: 19, loadIndex: '111', speedRating: 'V' },
        { width: 275, aspectRatio: 45, rimSize: 20, loadIndex: '110', speedRating: 'V' },
        { width: 285, aspectRatio: 45, rimSize: 20, loadIndex: '112', speedRating: 'V' },
        { width: 295, aspectRatio: 45, rimSize: 20, loadIndex: '114', speedRating: 'V' },
        { width: 275, aspectRatio: 40, rimSize: 20, loadIndex: '106', speedRating: 'W' },
        { width: 285, aspectRatio: 40, rimSize: 20, loadIndex: '108', speedRating: 'W' },
        { width: 295, aspectRatio: 40, rimSize: 20, loadIndex: '110', speedRating: 'W' },
        
        // Light Truck/Commercial sizes
        { width: 215, aspectRatio: 75, rimSize: 15, loadIndex: '100', speedRating: 'S' },
        { width: 225, aspectRatio: 75, rimSize: 15, loadIndex: '102', speedRating: 'S' },
        { width: 235, aspectRatio: 75, rimSize: 15, loadIndex: '105', speedRating: 'S' },
        { width: 31, aspectRatio: 10.5, rimSize: 15, loadIndex: '109', speedRating: 'S' }, // 31x10.50R15
        { width: 215, aspectRatio: 70, rimSize: 16, loadIndex: '100', speedRating: 'H' },
        { width: 225, aspectRatio: 70, rimSize: 16, loadIndex: '103', speedRating: 'H' },
        { width: 245, aspectRatio: 75, rimSize: 16, loadIndex: '111', speedRating: 'S' },
        { width: 265, aspectRatio: 70, rimSize: 16, loadIndex: '112', speedRating: 'H' },
        { width: 285, aspectRatio: 75, rimSize: 16, loadIndex: '116', speedRating: 'S' },
        
        // Performance SUV sizes
        { width: 305, aspectRatio: 40, rimSize: 20, loadIndex: '112', speedRating: 'W' },
        { width: 315, aspectRatio: 35, rimSize: 20, loadIndex: '110', speedRating: 'Y' },
        { width: 325, aspectRatio: 30, rimSize: 21, loadIndex: '108', speedRating: 'Y' },
        { width: 275, aspectRatio: 35, rimSize: 21, loadIndex: '103', speedRating: 'Y' },
        { width: 285, aspectRatio: 35, rimSize: 21, loadIndex: '105', speedRating: 'Y' },
        { width: 295, aspectRatio: 35, rimSize: 21, loadIndex: '107', speedRating: 'Y' }
    ];

    const tires = [];
    const conditions = ['new', 'used'];

    // Generate tires for each model, size, and condition combination
    for (const model of falkenModels) {
        for (const sizeSpec of tireSizes) {
            const size = `${sizeSpec.width}/${sizeSpec.aspectRatio} R${sizeSpec.rimSize}`;
            
            // Calculate base price based on size and model positioning
            let basePrice = 80; // Base price
            
            // Price adjustments based on model tier
            if (model.name.includes('RT660') || model.name.includes('RT615K+')) {
                basePrice = 150; // Track tires are more expensive
            } else if (model.name.includes('FK510')) {
                basePrice = 120; // Ultra-high performance
            } else if (model.name.includes('FK460') || model.name.includes('FK450')) {
                basePrice = 100; // High performance
            } else if (model.name.includes('Wildpeak')) {
                basePrice = 110; // All-terrain premium
            }
            
            // Price adjustments based on size
            const sizeMultiplier = 1 + (sizeSpec.rimSize - 15) * 0.1 + (sizeSpec.width - 185) * 0.001;
            const newPrice = Math.round(basePrice * sizeMultiplier * 100) / 100;

            // Create both new and used variants
            for (const condition of conditions) {
                // Calculate condition-specific pricing and features
                let finalPrice, stock, features, description, dotCode;
                
                if (condition === 'new') {
                    finalPrice = newPrice;
                    stock = Math.floor(Math.random() * 25) + 2;
                    features = model.features;
                    description = model.description;
                    // New tires: recent DOT codes (2024-2025)
                    const dotWeek = String(Math.floor(Math.random() * 52) + 1).padStart(2, '0');
                    const dotYear = Math.random() > 0.3 ? '25' : '24'; // Mostly 2025, some 2024
                    dotCode = `DOT${Math.random().toString(36).substring(2, 6).toUpperCase()}${dotWeek}${dotYear}`;
                } else { // used
                    // Used tires: 40-70% of new price
                    const discountFactor = 0.4 + Math.random() * 0.3; // 40-70%
                    finalPrice = Math.round(newPrice * discountFactor * 100) / 100;
                    // Lower stock for used tires
                    stock = Math.floor(Math.random() * 15) + 1;
                    // Add "used" specific features
                    features = [...model.features, 'Inspected Quality', 'Value Price', 'Good Tread Remaining'];
                    description = `${model.description} Deze tweedehands band is grondig geïnspecteerd en biedt uitstekende waarde voor geld.`;
                    // Used tires: older DOT codes (2020-2023)
                    const dotWeek = String(Math.floor(Math.random() * 52) + 1).padStart(2, '0');
                    const dotYear = String(20 + Math.floor(Math.random() * 4)).slice(-2); // 2020-2023
                    dotCode = `DOT${Math.random().toString(36).substring(2, 6).toUpperCase()}${dotWeek}${dotYear}`;
                }
                
                const slug = `falken-${model.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${sizeSpec.width}-${sizeSpec.aspectRatio}-r${sizeSpec.rimSize}-${condition}`;
                
                tires.push({
                    name: `Falken ${model.name}`,
                    brand: 'Falken',
                    season: 'summer',
                    condition,
                    size,
                    width: sizeSpec.width,
                    aspectRatio: sizeSpec.aspectRatio,
                    rimSize: sizeSpec.rimSize,
                    loadIndex: sizeSpec.loadIndex,
                    speedRating: sizeSpec.speedRating,
                    price: finalPrice,
                    stock,
                    inStock: stock > 0,
                    features: JSON.stringify(features),
                    description,
                    slug,
                    dot: dotCode,
                });
            }
        }
    }

    console.log(`Generated ${tires.length} Falken summer tire variants (new + used)`);

    // Insert tires in batches to avoid memory issues
    const batchSize = 50;
    let inserted = 0;
    
    for (let i = 0; i < tires.length; i += batchSize) {
        const batch = tires.slice(i, i + batchSize);
        
        for (const tire of batch) {
            await prisma.tire.upsert({
                where: { slug: tire.slug },
                update: tire,
                create: tire,
            });
            inserted++;
        }
        
        console.log(`Inserted ${inserted}/${tires.length} tires...`);
    }

    console.log(`Successfully seeded ${tires.length} Falken summer 2025 tires.`);
    
    // Print summary by model and condition
    const newTires = tires.filter(t => t.condition === 'new');
    const usedTires = tires.filter(t => t.condition === 'used');
    
    console.log('\nSummary:');
    console.log(`- Total tires: ${tires.length}`);
    console.log(`- New tires: ${newTires.length}`);
    console.log(`- Used tires: ${usedTires.length}`);
    
    console.log('\nBy model (new + used):');
    const summary = falkenModels.map(model => {
        const newCount = newTires.filter(t => t.name.includes(model.name)).length;
        const usedCount = usedTires.filter(t => t.name.includes(model.name)).length;
        return `- ${model.name}: ${newCount} new + ${usedCount} used = ${newCount + usedCount} total variants`;
    });
    console.log(summary.join('\n'));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });