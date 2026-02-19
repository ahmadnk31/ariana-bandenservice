"use client";

import { Angry, Check, Frown, Laugh, Loader2, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const feedback = [
    { happiness: 4, emoji: Laugh, color: "text-green-600" },
    { happiness: 3, emoji: Smile, color: "text-green-400" },
    { happiness: 2, emoji: Frown, color: "text-yellow-400" },
    { happiness: 1, emoji: Angry, color: "text-red-600" },
];

const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.2,
            staggerChildren: 0.04,
        },
    },
};

const item = {
    hidden: { y: 10 },
    show: { y: 0 },
};

const useSubmitFeedback = () => {
    const [feedback, setFeedback] = useState<{
        happiness: number;
        feedback: string;
    } | null>(null);
    const [isLoading, setLoadingState] = useState(false);
    const [error, setError] = useState<{ error: any } | null>(null);
    const [isSent, setRequestState] = useState(false);

    const submitFeedback = async (feedbackData: { happiness: number; feedback: string }) => {
        setLoadingState(true);
        setRequestState(false);
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            setRequestState(true);
            setError(null);
        } catch (err) {
            console.error(err);
            setRequestState(false);
            setError({ error: "Failed to submit feedback" });
        } finally {
            setLoadingState(false);
        }
    };

    useEffect(() => {
        if (feedback) {
            submitFeedback(feedback);
        }
    }, [feedback]);

    return {
        submitFeedback: (happiness: number, feedback: string) =>
            setFeedback({ happiness, feedback }),
        isLoading,
        error,
        isSent,
    };
};

export const Feedback = () => {
    const t = useTranslations("Feedback");
    const textRef = useRef<HTMLTextAreaElement>(null);
    const [happiness, setHappiness] = useState<null | number>(null);

    const [isSubmitted, setSubmissionState] = useState(false);
    const { submitFeedback, isLoading, isSent } = useSubmitFeedback();

    useEffect(() => {
        if (!happiness) {
            if (textRef.current) textRef.current.value = "";
        }
    }, [happiness]);

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;
        let submissionStateTimeout: NodeJS.Timeout | null = null;

        if (isSent) {
            setSubmissionState(true);
            timeout = setTimeout(() => {
                setHappiness(null);
                if (textRef.current) textRef.current.value = "";
            }, 2000);

            submissionStateTimeout = setTimeout(() => {
                setSubmissionState(false);
            }, 2200);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
            if (submissionStateTimeout) clearTimeout(submissionStateTimeout);
        };
    }, [isSent]);

    return (
        <div className="relative">
            <AnimatePresence>
                {happiness && (
                    <motion.div
                        key="feedback-popup"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full left-0 mb-2 w-[330px] overflow-hidden rounded-lg border bg-background p-2 shadow-xl dark:border-neutral-800 z-50"
                    >
                        <div className="pb-1 pt-1">
                            {!isSubmitted ? (
                                <motion.div
                                    key="form"
                                    exit={{ opacity: 0 }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <textarea
                                        ref={textRef}
                                        placeholder={t("placeholder")}
                                        className="min-h-32 w-full resize-none rounded-md border bg-transparent p-2 text-sm placeholder-neutral-400 focus:border-neutral-400 focus:outline-0 dark:border-neutral-800 focus:dark:border-white"
                                    />
                                    <div className="flex h-fit w-full justify-end px-1">
                                        <button
                                            onClick={() =>
                                                submitFeedback(happiness, textRef.current?.value || "")
                                            }
                                            disabled={isLoading}
                                            className={cn(
                                                "mt-1 flex h-9 items-center justify-center rounded-md border bg-neutral-950 px-4 text-sm text-white dark:bg-white dark:text-neutral-950 transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-200",
                                                {
                                                    "opacity-70 cursor-not-allowed": isLoading,
                                                },
                                            )}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    {t("loading")}
                                                </>
                                            ) : (
                                                t("submit")
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    className="flex h-40 w-full flex-col items-center justify-center gap-2 text-sm font-normal"
                                >
                                    <motion.div
                                        variants={item}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 dark:bg-green-600"
                                    >
                                        <Check strokeWidth={3} size={20} className="stroke-white" />
                                    </motion.div>
                                    <motion.div variants={item} className="font-semibold text-center px-4">
                                        {t("success")}
                                    </motion.div>
                                    <motion.div variants={item} className="text-neutral-500 dark:text-neutral-400">
                                        {t("thanks")}
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                layout
                className={twMerge(
                    "w-fit overflow-hidden border py-1 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 bg-background rounded-full px-2",
                )}
            >
                <div className="flex items-center gap-2">
                    <span className="pl-2 text-sm text-black dark:text-neutral-400 font-medium whitespace-nowrap">
                        {t("question")}
                    </span>
                    <div className="flex items-center">
                        {feedback.map((e) => {
                            const EmojiIcon = e.emoji;
                            return (
                                <button
                                    onClick={() =>
                                        setHappiness((prev) =>
                                            e.happiness === prev ? null : e.happiness,
                                        )
                                    }
                                    className={twMerge(
                                        "flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-neutral-100 dark:hover:bg-neutral-900",
                                        happiness === e.happiness
                                            ? e.color
                                            : "text-neutral-500 dark:text-neutral-400",
                                    )}
                                    key={e.happiness}
                                    title={`Rate ${e.happiness}`}
                                >
                                    <EmojiIcon size={18} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
