import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { happiness, feedback } = body;

        const newFeedback = await prisma.feedback.create({
            data: {
                happiness,
                feedback,
            },
        });

        return NextResponse.json({ success: true, data: newFeedback });
    } catch (error) {
        console.error('Error processing feedback:', error);
        return NextResponse.json(
            { error: 'Failed to process feedback' },
            { status: 500 }
        );
    }
}
