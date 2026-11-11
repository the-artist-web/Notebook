/**
 * Node modules
 */
import type { Metadata } from "next";

/**
 * Components
 */
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

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
    const pathname = `/${locale}/forgot-password`;
    const siteName = SETTING_SITE.siteName;
    const title = `Forgot password | ${siteName}`;
    const description = SETTING_SITE.description;

    return {
        alternates: {
            canonical: pathname
        },
        title: "Forgot password",
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

const page = () => <ForgotPasswordForm />;

export default page