"use server";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/server";

export const logoutAction = async () => {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signOut();

    if (error)
        return {
            ok: false,
            err: error.message
        };

    return {
        ok: true,
        data: null
    }
};