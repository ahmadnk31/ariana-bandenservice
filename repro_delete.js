const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Reproduction Script Started ---');

    // 1. Create a fresh tire
    const tire = await prisma.tire.create({
        data: {
            name: 'Test Delete Tire',
            brand: 'TestBrand',
            season: 'summer',
            size: '205/55 R16',
            price: 50.0,
            features: '[]',
            stock: 10
        }
    });
    console.log('Created tire:', tire.id);

    // 2. Try to delete it immediately (Should succeed)
    try {
        await prisma.tire.delete({ where: { id: tire.id } });
        console.log('Success: Deleted fresh tire.');
    } catch (e) {
        console.error('Error deleting fresh tire:', e.message);
    }

    // 3. Create another tire
    const tire2 = await prisma.tire.create({
        data: {
            name: 'Test Linked Tire',
            brand: 'TestBrand',
            season: 'winter',
            size: '205/55 R16',
            price: 60.0,
            features: '[]',
            stock: 10
        }
    });
    console.log('Created linked tire:', tire2.id);

    // 4. Create an order item linked to it (Need an order first usually, but check schema)
    // Schema needs Order to exist for OrderItem
    const order = await prisma.order.create({
        data: {
            orderNumber: `TEST-${Date.now()}`,
            status: 'pending',
            email: 'test@example.com',
            subtotal: 60,
            total: 60,
            items: {
                create: {
                    quantity: 1,
                    price: 60,
                    tireId: tire2.id
                }
            }
        }
    });
    console.log('Created order with item linked to tire:', order.id);

    // 5. Try to delete the linked tire (Should fail if no cascade)
    try {
        await prisma.tire.delete({ where: { id: tire2.id } });
        console.log('Success: Deleted linked tire (Unexpected unless cascade exists).');
    } catch (e) {
        console.log('Expected Failure deleting linked tire. Error Code:', e.code);
        console.log('Error Message:', e.message);
    }

    // Cleanup
    console.log('Cleaning up...');
    try {
        await prisma.order.delete({ where: { id: order.id } }); // Delete order (cascades to items)
        await prisma.tire.delete({ where: { id: tire2.id } }); // Now delete tire
    } catch (e) {
        console.log('Cleanup error:', e.message);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
