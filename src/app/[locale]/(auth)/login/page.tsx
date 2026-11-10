/**
 * Node modules
 */
import type { Metadata } from "next";

/**
 * Components
 */
import LoginForm from "@/components/auth/LoginForm";

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
    const pathname = `/${locale}/login`;
    const siteName = SETTING_SITE.siteName;
    const title = `Login | ${siteName}`;
    const description = SETTING_SITE.description;

    return {
        alternates: {
            canonical: pathname
        },
        title: "Login",
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

const page = () => <LoginForm />;

export default page