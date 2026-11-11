"use server";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/server";

export const resetPasswordAction = async (value: { password: string }) => {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.updateUser({ password: value.password });

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