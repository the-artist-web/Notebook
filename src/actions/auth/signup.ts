"use server";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/server";

/**
 * Types
 */
type SignupValues = {
    username: string;
    email: string;
    password: string;
};

export const signupAction = async (value: SignupValues) => {
    const supabase = await createClient();
    
    const { data: signup, error } = await supabase.auth.signUp({
        email: value.email,
        password: value.password,
        options: {
            data: {
                username: value.username
            },
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
        data: signup
    }
};