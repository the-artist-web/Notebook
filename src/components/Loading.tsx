"use client";

/**
 * Node modules
 */
import { motion } from "motion/react";

/**
 * Custom modules
 */
import { cn } from "@/lib/utils";

/**
 * Components
 */
import { Spinner } from "@/components/ui/spinner";

/**
 * Motions
 */
const fadeInOut = {
    initial: {
        opacity: 0,
        y: -10
    },
    animate: {
        opacity: 1,
        y: 0
    },
    exit: {
        opacity: 0,
        y: -10
    }
}

const Loading = ({
    className
}: React.ComponentProps<"div">) => {
    return (
        <motion.div
            className={cn("fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-full shadow-lg p-2", className)}
            {...fadeInOut}
        >
            <Spinner className="!size-7" />
        </motion.div>
    )
}

export default Loading