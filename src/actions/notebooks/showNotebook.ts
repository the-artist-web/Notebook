"use server";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/actions/users/getUser";

export const showNotebookAction = async (id: string) => {
    const supabase = await createClient();
    const result = await getUser();

    if (!result.ok || !result.data)
        return {
            ok: false as const,
            err: "Unauthorized"
        };
    
    const { data: notebook, error } = await supabase
        .from("notebooks")
        .select("*")
        .eq("user_id", result.data.id)
        .eq("id", id)
        .maybeSingle();

    if (error)
        return {
            ok: false as const,
            err: error.message
        };

    return {
        ok: true as const,
        data: notebook
    }
};