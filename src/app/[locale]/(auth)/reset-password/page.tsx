/**
 * Node modules
 */
import type { Metadata } from "next";

/**
 * Components
 */
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

/**
 * Constants
 */
import { SETTING_SITE } from "@/constants";

/**
 * Meta tags
 */
export async function generateMetadata({
    params
}: {
    params: Promise<{
        locale: string;
    }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const pathname = `/${locale}/reset-password`;
    const siteName = SETTING_SITE.siteName;
    const title = `Reset password | ${siteName}`;
    const description = SETTING_SITE.description;

    return {
        alternates: {
            canonical: pathname
        },
        title: "Reset password",
        description,
        openGraph: {
            title,
            description,
            url: pathname
        },
        twitter: {
            title,
            description
        },
    };
}

const page = () => <ResetPasswordForm />;

export default page