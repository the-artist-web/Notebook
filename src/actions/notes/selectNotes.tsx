"use server";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/server";

/**
 * Actions
 */
import { getUser } from "@/actions/users/getUser";

export const selectNotes = async (notebookId: number) => {
    if (!notebookId) 
        return {
            ok: false as const,
            err: "Please open a notebook first."
        };

    const supabase = await createClient();
    const result = await getUser();

    if (!result.ok || !result.data) 
        return {
            ok: false as const,
            err: "Unauthorized"
        };

    const { data: notes, error: notesError } = await supabase
        .from("notes")
        .select("*")
        .eq("notebook_id", notebookId)
        .eq("notebook_id", notebookId)
        .order("created_at", { ascending: false });

    if (notesError) 
        return {
            ok: false as const,
            err: notesError.message
        };

    return {
        ok: true as const,
        data: notes
    };
};