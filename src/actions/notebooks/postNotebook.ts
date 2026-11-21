"use server";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/actions/users/getUser";

/**
 * Types
 */
type NotebookValues = {
    title: string;
};

export const postNotebookAction = async (value: NotebookValues) => {
    const supabase = await createClient();
    const result = await getUser();

    if (!result.ok || !result.data)
        return {
            ok: false,
            err: "Unauthorized"
        };
    
    const { data: notebook, error } = await supabase
        .from("notebooks")
        .insert({ 
            title: value.title,
            user_id: result.data.id
        })
        .select()
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