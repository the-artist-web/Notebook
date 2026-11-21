/**
 * Node modules
 */
import type { Metadata } from "next";
import { connection } from "next/server";

/**
 * Actions
 */
import { showNotebookAction } from "@/actions/notebooks/showNotebook";

/**
 * Components
 */
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

/**
 * Assets
 */
import { StickyNotesIcon } from "lucide-react";

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
        id: string;
    }>;
}): Promise<Metadata> {
    const { locale, id } = await params;

    await connection();

    const notebook = await showNotebookAction(id);

    const pathname = `/${locale}/notebook/${id}`;
    const siteName = SETTING_SITE.siteName;
    const title = `${notebook.data.title} | ${siteName}`;
    const description = `Notebook: ${notebook.data.title}`;

    return {
        alternates: {
            canonical: pathname,
        },
        title: notebook.data.title,
        description,
        openGraph: {
            title,
            description,
            url: pathname,
        },
        twitter: {
            title,
            description,
        },
    };
}

const page = async ({
    params
}: {
    params: Promise<{
        id: string;
    }>;
}) => {
    const { id } = await params;
    
    await connection();

    const notebook = await showNotebookAction(id);

    return (
        <Empty>
            <EmptyHeader>
                <StickyNotesIcon size={68} className="opacity-25" />

                <EmptyTitle className="text-2xl font-normal">No Notes</EmptyTitle>
            </EmptyHeader>
        </Empty>
    )
};

export default page