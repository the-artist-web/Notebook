/**
 * Node modules
 */
import type { Metadata } from "next";
import { connection } from "next/server";

/**
 * Actions
 */
import { showNotebookAction } from "@/actions/notebooks/showNotebook";
import { selectNotes } from "@/actions/notes/selectNotes";

/**
 * Components
 */
import NotesList from "@/components/NotesList";

/**
 * Types
 */
import { NoteType } from "@/types";

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
    const notes = await selectNotes(notebook.data.id);

    if (!notes.ok) return;

    const result = notes.data as NoteType[];

    return (
        <div className="flex flex-col gap-3 px-4 px-6 mt-3 h-full">
            <h1 className="text-base font-medium">{notebook.data.title}</h1>

            <NotesList notes={result} />
        </div>
    );
};

export default page