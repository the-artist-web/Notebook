"use server";

/**
 * Custom modules
 */
import { createClient } from "@/lib/supabase/server";

/**
 * Types
 */
type LoginValues = {
    email: string;
    password: string;
};

export const loginAction = async (value: LoginValues) => {
    const supabase = await createClient();
    
    const { data: login, error } = await supabase.auth.signInWithPassword({
        email: value.email,
        password: value.password
    });

    if (error)
        return {
            ok: false,
            err: error.message
        };

    return {
        ok: true,
        data: login
    }
};