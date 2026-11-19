"use server";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/server";

/**
 * Types
 */
type NotebookValues = {
    title: string;
};

export const putNotebookAction = async (value: NotebookValues, notebookId: number) => {
    const supabase = await createClient();
    
    const { data: notebook, error } = await supabase
        .from("notebooks")
        .update({ 
            title: value.title,
        })
        .eq("id", notebookId)
        .select("*")
        .single();

    if (error)
        return {
            ok: false,
            err: error.message
        };

    return {
        ok: true,
        data: notebook
    }
};