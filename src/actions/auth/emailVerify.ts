"use server";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/server";

export const emailVerify = async (email: string) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/auth/callback`
        }
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