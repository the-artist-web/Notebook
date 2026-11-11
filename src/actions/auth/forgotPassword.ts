"use server";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/server";

export const forgotPasswordAction = async (value: { email: string }) => {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.resetPasswordForEmail(value.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/auth/callback?next=/reset-password`
    });

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