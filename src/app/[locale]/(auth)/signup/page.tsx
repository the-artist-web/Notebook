/**
 * Node modules
 */
import type { Metadata } from "next";

/**
 * Components
 */
import SignupForm from "@/components/auth/SignupForm";

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
    const pathname = `/${locale}/signup`;
    const siteName = SETTING_SITE.siteName;
    const title = `Sign up | ${siteName}`;
    const description = SETTING_SITE.description;

    return {
        alternates: {
            canonical: pathname
        },
        title: "Sign up",
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

const page = () => <SignupForm />;

export default page