"use client";

/**
 * Node modules
 */
import { motion } from "motion/react";
import Image from "next/image";

/**
 * Custom modules
 */
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

/**
 * Components
 */

/**
 * Assets
 */
import {
    LogoDark,
    LogoLight
} from "@/assets/images";

/**
 * Motions
 */
const MotionLink = motion.create(Link);

/**
 * Constants
 */
import { SETTING_SITE } from "@/constants";

const Logo = ({
    className,
    ...props
}: React.ComponentProps<typeof MotionLink>) => {
    const siteName = SETTING_SITE.siteName;

    return (
        <MotionLink
            href="/"
            className={cn("h-6", className)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            {...props}
        >
            <Image
                src={LogoDark.src}
                alt={siteName}
                width={LogoDark.width}
                height={LogoDark.height}
                className="w-full h-full object-contain hidden dark:block"
            />

            <Image
                src={LogoLight.src}
                alt={siteName}
                width={LogoLight.width}
                height={LogoLight.height}
                className="w-full h-full object-contain dark:hidden"
            />
        </MotionLink>
    );
}

export default Logo;