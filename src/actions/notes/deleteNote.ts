"use server";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/server";

export const deleteNoteAction = async (notebookId: number) => {
    const supabase = await createClient();
    
    const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", notebookId);

    if (error)
        return {
            ok: false as const,
            err: error.message
        };

    return {
        ok: true as const,
        data: null
    }
};