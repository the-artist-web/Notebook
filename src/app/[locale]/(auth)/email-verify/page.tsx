/**
 * Node modules
 */
import type { Metadata } from "next";

/**
 * Components
 */
import EmailVerify from "@/components/auth/EmailVerify";
import Loading from "@/components/Loading";

/**
 * Constants
 */
import { SETTING_SITE } from "@/constants";
import { Suspense } from "react";

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
    const pathname = `/${locale}/email-verify`;
    const siteName = SETTING_SITE.siteName;
    const title = `Email verify | ${siteName}`;
    const description = SETTING_SITE.description;

    return {
        alternates: {
            canonical: pathname
        },
        title: "Email verify",
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

const page = async () =>
    <Suspense fallback={<Loading />}>
        <EmailVerify />
    </Suspense>;

export default page