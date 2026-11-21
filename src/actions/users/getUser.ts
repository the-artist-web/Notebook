"use server";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/server";

export const getUser = async () => {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) 
        return {
            ok: false as const,
            err: error.message
        };

    return {
        ok: true as const,
        data: user
    }
}