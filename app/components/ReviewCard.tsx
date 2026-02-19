import { Star } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ReviewCardProps {
    author_name: string;
    rating: number;
    relative_time_description: string;
    text: string;
    profile_photo_url: string;
}

export default function ReviewCard({
    author_name,
    rating,
    relative_time_description,
    text,
    profile_photo_url,
}: ReviewCardProps) {
    const t = useTranslations('Home.reviews');

    return (
        <div className="bg-card w-full h-full min-h-[240px] p-6 rounded-2xl border border-border/50 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-primary/20 transition-all duration-300">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-10 h-10 overflow-hidden rounded-full bg-secondary ring-2 ring-background">
                        {profile_photo_url && (
                            <Image
                                src={profile_photo_url}
                                alt={author_name}
                                fill
                                className="object-cover"
                                sizes="40px"
                            />
                        )}
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm">{author_name}</h4>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"
                                        }`}
                                />
                            ))}
                            <span className="text-xs text-muted-foreground ml-1">
                                {relative_time_description}
                            </span>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed italic">
                    &quot;{text}&quot;
                </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-2">
                <span className="text-[10px] font-medium text-muted-foreground/70 flex items-center gap-1.5 uppercase tracking-wider">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.3342 10.0197C21.4326 10.7411 21.5 11.4883 21.5 12.2857C21.5 20.3571 16.0959 22.5 10.7431 22.5C4.78286 22.5 1.5 17.8464 1.5 12.1071C1.5 6.01786 5.51737 1.5 11.235 1.5C13.8821 1.5 16.2763 2.50286 18.0628 4.19571L15.3582 6.87429C14.5059 6.05357 13.0626 5.25 11.235 5.25C7.45476 5.25 4.39845 8.36143 4.39845 12.1071C4.39845 15.8529 7.43837 18.9643 11.235 18.9643C14.9388 18.9643 16.7188 16.485 17.1613 14.1964H10.9644V10.605H21.2851L21.3342 10.0197Z" fill="currentColor" /></svg>
                    {t('postedOnGoogle')}
                </span>
            </div>
        </div>
    );
}
