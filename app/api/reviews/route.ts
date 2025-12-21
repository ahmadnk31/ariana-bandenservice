import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    // Place ID for Ariana Bandenservice
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
        // Return mock data if credentials are missing (for development/demo purposes)
        return NextResponse.json({
            reviews: [
                {
                    author_name: "John Doe",
                    rating: 5,
                    relative_time_description: "a week ago",
                    text: "Great service! Fast and professional.",
                    profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s128-c0x00000000-cc-rp-mo",
                },
                {
                    author_name: "Sarah Smith",
                    rating: 5,
                    relative_time_description: "2 months ago",
                    text: "Best tire shop in town. Highly recommend!",
                    profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s128-c0x00000000-cc-rp-mo",
                },
                {
                    author_name: "Michael Johnson",
                    rating: 4,
                    relative_time_description: "3 months ago",
                    text: "Good prices and quick turnaround.",
                    profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s128-c0x00000000-cc-rp-mo",
                },
                {
                    author_name: "Emily Davis",
                    rating: 5,
                    relative_time_description: "a month ago",
                    text: "Very helpful staff via whatsapp. Will come back.",
                    profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s128-c0x00000000-cc-rp-mo",
                },
            ]
        });
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}&language=nl`;

        const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
        const data = await response.json();

        if (!data.result || !data.result.reviews) {
            console.error('Google Places API error:', data);
            return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
        }

        return NextResponse.json({ reviews: data.result.reviews });

    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
