'use client';

import { useEffect } from 'react';
import { incrementBlogPostView } from '@/app/actions/blog';

interface ViewTrackerProps {
    slug: string;
}

export default function ViewTracker({ slug }: ViewTrackerProps) {
    useEffect(() => {
        // Check if we've already tracked a view for this post in this session
        const viewKey = `blog-view-${slug}`;
        const hasViewedInSession = sessionStorage.getItem(viewKey);
        
        if (!hasViewedInSession) {
            // Track the view
            incrementBlogPostView(slug).catch(console.error);
            
            // Mark as viewed in this session
            sessionStorage.setItem(viewKey, 'true');
        }
    }, [slug]);

    // This component doesn't render anything
    return null;
}